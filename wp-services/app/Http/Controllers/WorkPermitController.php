<?php

namespace App\Http\Controllers;

use App\Models\WorkPermit;
use App\Models\WorkArea;
use App\Models\PermitType;
use App\Models\PermitApproval;
use App\Models\PermitRiskAssessment;
use App\Models\ClashDetection;
use App\Models\AuditTrail;
use Illuminate\Http\Request;

class WorkPermitController extends Controller
{
    /**
     * Daftar semua izin kerja (dengan filter & pagination).
     */
    public function index(Request $request)
    {
        $query = WorkPermit::with(['permitType', 'workArea', 'requester']);

        if ($request->has('status'))       $query->byStatus($request->status);
        if ($request->has('priority'))     $query->byPriority($request->priority);
        if ($request->has('permit_type'))  $query->where('permit_type_id', $request->permit_type);
        if ($request->has('work_area'))    $query->where('work_area_id', $request->work_area);
        if ($request->has('date_from'))    $query->where('planned_start', '>=', $request->date_from);
        if ($request->has('date_to'))      $query->where('planned_end', '<=', $request->date_to);

        if ($request->has('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('permit_number', 'like', "%{$term}%")
                  ->orWhere('title', 'like', "%{$term}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->get('per_page', 15);
        return $this->paginatedResponse($query->paginate($perPage));
    }

    /**
     * Detail izin kerja lengkap.
     */
    public function show($id)
    {
        $permit = WorkPermit::with([
            'permitType', 'workArea', 'requester',
            'approvals.approver', 'riskAssessments',
            'personnel.qualifications', 'equipment.certifications',
            'attachments', 'extensions',
        ])->find($id);

        if (!$permit) return $this->notFoundResponse();

        // Sertakan clash info
        $permit->clashes = $permit->getAllClashes();

        return $this->successResponse($permit);
    }

    /**
     * Buat izin kerja baru (draft).
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'permit_type_id'   => 'required|exists:permit_types,id',
            'work_area_id'     => 'required|exists:work_areas,id',
            'requested_by'     => 'required|exists:personnel,id',
            'title'            => 'required|string|max:255',
            'work_description' => 'required|string',
            'planned_start'    => 'required|date|after_or_equal:now',
            'planned_end'      => 'required|date|after:planned_start',
            'priority'         => 'in:low,medium,high,critical',
        ]);

        $permitType = PermitType::findOrFail($request->permit_type_id);
        $permitNumber = WorkPermit::generatePermitNumber($permitType->code);

        $permit = WorkPermit::create(array_merge($request->all(), [
            'permit_number' => $permitNumber,
            'status'        => 'draft',
        ]));

        // Generate workflow stages dari template tipe izin
        if ($permitType->workflow_stages) {
            foreach ($permitType->workflow_stages as $index => $stage) {
                PermitApproval::create([
                    'work_permit_id' => $permit->id,
                    'stage_order'    => $index + 1,
                    'stage_name'     => $stage['name'] ?? "Stage " . ($index + 1),
                    'stage_type'     => $stage['type'] ?? 'approval',
                    'approver_role'  => $stage['role'] ?? null,
                    'conditions'     => $stage['conditions'] ?? null,
                ]);
            }
        }

        AuditTrail::log('work_permit', $permit, 'created', $permit->requester->name ?? 'System', $request->requested_by);

        return $this->successResponse(
            $permit->load(['permitType', 'workArea', 'approvals']),
            'Izin kerja berhasil dibuat',
            201
        );
    }

    /**
     * Update izin kerja.
     */
    public function update(Request $request, $id)
    {
        $permit = WorkPermit::find($id);
        if (!$permit) return $this->notFoundResponse();

        if (!in_array($permit->status, ['draft', 'returned'])) {
            return $this->errorResponse('Izin kerja hanya dapat diubah saat berstatus draft atau dikembalikan');
        }

        $oldValues = $permit->toArray();
        $permit->update($request->all());

        AuditTrail::log('work_permit', $permit, 'updated', 'User', null, $oldValues, $permit->fresh()->toArray());

        return $this->successResponse($permit->fresh()->load(['permitType', 'workArea']));
    }

    /**
     * Submit izin kerja untuk proses persetujuan.
     */
    public function submit($id)
    {
        $permit = WorkPermit::with(['permitType', 'workArea', 'personnel', 'equipment'])->find($id);
        if (!$permit) return $this->notFoundResponse();

        if ($permit->status !== 'draft') {
            return $this->errorResponse('Hanya izin berstatus draft yang dapat disubmit');
        }

        // Verifikasi kualifikasi personel
        $qualErrors = $this->verifyPersonnelQualifications($permit);
        if (!empty($qualErrors)) {
            return $this->errorResponse('Verifikasi kualifikasi gagal', 422, $qualErrors);
        }

        // Verifikasi sertifikasi alat
        $certErrors = $this->verifyEquipmentCertifications($permit);
        if (!empty($certErrors)) {
            return $this->errorResponse('Verifikasi sertifikasi alat gagal', 422, $certErrors);
        }

        // Jalankan clash detection
        $clashes = ClashDetection::detectClashes($permit);
        if (!empty($clashes)) {
            foreach ($clashes as $clashData) {
                ClashDetection::create(array_merge($clashData, [
                    'permit_a_id' => $permit->id,
                ]));
            }
            $permit->update(['has_clash' => true]);

            $hasCritical = collect($clashes)->contains('severity', 'critical');
            if ($hasCritical) {
                return $this->errorResponse('Terdeteksi konflik kritis yang harus diselesaikan terlebih dahulu', 409, $clashes);
            }
        }

        $permit->update([
            'status'                 => 'submitted',
            'current_approval_stage' => 1,
        ]);

        AuditTrail::log('work_permit', $permit, 'submitted', $permit->requester->name ?? 'User');

        return $this->successResponse($permit->fresh(), 'Izin kerja berhasil disubmit');
    }

    /**
     * Proses keputusan approval pada tahapan tertentu.
     */
    public function processApproval(Request $request, $id)
    {
        $this->validate($request, [
            'decision'    => 'required|in:approved,rejected,returned',
            'remarks'     => 'nullable|string',
            'approver_id' => 'required|exists:personnel,id',
        ]);

        $permit = WorkPermit::with('approvals')->find($id);
        if (!$permit) return $this->notFoundResponse();

        $currentApproval = $permit->approvals()
            ->where('stage_order', $permit->current_approval_stage)
            ->first();

        if (!$currentApproval) {
            return $this->errorResponse('Tahapan persetujuan tidak ditemukan');
        }

        $currentApproval->update([
            'approver_id'   => $request->approver_id,
            'approver_name' => \App\Models\Personnel::find($request->approver_id)?->name,
            'decision'      => $request->decision,
            'remarks'       => $request->remarks,
            'decided_at'    => now(),
        ]);

        switch ($request->decision) {
            case 'approved':
                $nextStage = $permit->approvals()
                    ->where('stage_order', '>', $permit->current_approval_stage)
                    ->where('decision', 'pending')
                    ->first();

                if ($nextStage) {
                    $permit->update([
                        'current_approval_stage' => $nextStage->stage_order,
                        'status'                 => 'pending_approval',
                    ]);
                } else {
                    $permit->update(['status' => 'approved']);
                }
                break;

            case 'rejected':
                $permit->update([
                    'status'           => 'rejected',
                    'rejection_reason' => $request->remarks,
                ]);
                break;

            case 'returned':
                $permit->update([
                    'status'                 => 'draft',
                    'current_approval_stage' => 0,
                ]);
                // Reset semua approval
                $permit->approvals()->update(['decision' => 'pending', 'decided_at' => null]);
                break;
        }

        AuditTrail::log('work_permit', $permit, "approval_{$request->decision}", $currentApproval->approver_name ?? 'Approver', $request->approver_id);

        return $this->successResponse($permit->fresh()->load('approvals'), 'Keputusan berhasil diproses');
    }

    /**
     * Aktivasi izin kerja (memulai pekerjaan).
     */
    public function activate($id)
    {
        $permit = WorkPermit::find($id);
        if (!$permit) return $this->notFoundResponse();
        if ($permit->status !== 'approved') {
            return $this->errorResponse('Hanya izin yang sudah diapprove yang dapat diaktivasi');
        }

        $permit->update(['status' => 'active', 'actual_start' => now()]);
        AuditTrail::log('work_permit', $permit, 'activated', 'User');

        return $this->successResponse($permit->fresh());
    }

    /**
     * Selesaikan / tutup izin kerja.
     */
    public function close(Request $request, $id)
    {
        $permit = WorkPermit::find($id);
        if (!$permit) return $this->notFoundResponse();

        $permit->update([
            'status'          => 'closed',
            'actual_end'      => now(),
            'closed_at'       => now(),
            'closed_by_name'  => $request->get('closed_by', 'User'),
            'closure_remarks' => $request->get('remarks'),
        ]);

        AuditTrail::log('work_permit', $permit, 'closed', $request->get('closed_by', 'User'));

        return $this->successResponse($permit->fresh());
    }

    /**
     * Risk Assessment: tambah/update per izin.
     */
    public function addRiskAssessment(Request $request, $id)
    {
        $permit = WorkPermit::find($id);
        if (!$permit) return $this->notFoundResponse();

        $this->validate($request, [
            'hazard_description' => 'required|string',
            'hazard_category'    => 'required|string',
            'likelihood'         => 'required|integer|min:1|max:5',
            'severity'           => 'required|integer|min:1|max:5',
            'control_measures'   => 'required|string',
        ]);

        $riskLevel = PermitRiskAssessment::calculateRiskLevel($request->likelihood, $request->severity);

        $ra = PermitRiskAssessment::create(array_merge($request->all(), [
            'work_permit_id' => $id,
            'risk_level'     => $riskLevel,
            'assessed_at'    => now(),
        ]));

        return $this->successResponse($ra, 'Risk assessment berhasil ditambahkan', 201);
    }

    /**
     * Clash detection manual trigger.
     */
    public function checkClash($id)
    {
        $permit = WorkPermit::with(['workArea', 'equipment'])->find($id);
        if (!$permit) return $this->notFoundResponse();

        $clashes = ClashDetection::detectClashes($permit);

        return $this->successResponse([
            'permit_id'   => $id,
            'clash_count' => count($clashes),
            'clashes'     => $clashes,
        ]);
    }

    /**
     * Verifikasi kualifikasi personel.
     */
    private function verifyPersonnelQualifications(WorkPermit $permit): array
    {
        $errors = [];
        $requiredQuals = $permit->permitType->required_qualifications ?? [];

        foreach ($permit->personnel as $person) {
            foreach ($requiredQuals as $qual) {
                if (!$person->hasValidQualification($qual)) {
                    $errors[] = "{$person->name} tidak memiliki kualifikasi valid: {$qual}";
                }
            }
        }
        return $errors;
    }

    /**
     * Verifikasi sertifikasi alat.
     */
    private function verifyEquipmentCertifications(WorkPermit $permit): array
    {
        $errors = [];
        $requiredCerts = $permit->permitType->required_equipment_certs ?? [];

        foreach ($permit->equipment as $equip) {
            foreach ($requiredCerts as $cert) {
                if (!$equip->hasValidCertification($cert)) {
                    $errors[] = "{$equip->name} tidak memiliki sertifikasi valid: {$cert}";
                }
            }
        }
        return $errors;
    }
}
