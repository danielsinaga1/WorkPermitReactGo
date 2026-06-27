<?php

namespace App\Http\Controllers;

use App\Models\LotoProcedure;
use App\Models\LotoPoint;
use App\Models\LotoLock;
use App\Models\LotoVerification;
use App\Models\AuditTrail;
use Illuminate\Http\Request;

class LotoController extends Controller
{
    // ================================================================
    // LOTO PROCEDURES
    // ================================================================

    public function index(Request $request)
    {
        $query = LotoProcedure::with(['workArea', 'workPermit']);

        if ($request->has('status'))    $query->where('status', $request->status);
        if ($request->has('work_area')) $query->where('work_area_id', $request->work_area);

        return $this->paginatedResponse(
            $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15))
        );
    }

    public function show($id)
    {
        $procedure = LotoProcedure::with([
            'workArea', 'workPermit',
            'points.activeLock.lockedBy',
            'points.verifications',
            'locks.lockedBy',
        ])->find($id);

        if (!$procedure) return $this->notFoundResponse();

        $procedure->is_fully_locked = $procedure->isFullyLocked();

        return $this->successResponse($procedure);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title'             => 'required|string|max:255',
            'machine_equipment' => 'required|string',
            'energy_sources'    => 'required|array',
            'isolation_steps'   => 'required|array',
            'prepared_by'       => 'required|string',
        ]);

        $procedure = LotoProcedure::create(array_merge($request->all(), [
            'procedure_number' => LotoProcedure::generateNumber(),
        ]));

        // Tambahkan points
        if ($request->has('points')) {
            foreach ($request->points as $index => $point) {
                LotoPoint::create(array_merge($point, [
                    'loto_procedure_id' => $procedure->id,
                    'sequence_order'    => $point['sequence_order'] ?? ($index + 1),
                ]));
            }
        }

        AuditTrail::log('loto', $procedure, 'created', $request->prepared_by);

        return $this->successResponse($procedure->load('points'), 'Prosedur LOTO berhasil dibuat', 201);
    }

    public function update(Request $request, $id)
    {
        $procedure = LotoProcedure::find($id);
        if (!$procedure) return $this->notFoundResponse();

        if ($procedure->activeLocks()->count() > 0) {
            return $this->errorResponse('Prosedur tidak dapat diubah saat ada kunci aktif');
        }

        $procedure->update($request->all());
        return $this->successResponse($procedure->fresh()->load('points'));
    }

    // ================================================================
    // LOCK / UNLOCK OPERATIONS
    // ================================================================

    public function applyLock(Request $request, $procedureId)
    {
        $procedure = LotoProcedure::find($procedureId);
        if (!$procedure) return $this->notFoundResponse();

        $this->validate($request, [
            'loto_point_id'  => 'required|exists:loto_points,id',
            'lock_number'    => 'required|string',
            'tag_number'     => 'required|string',
            'locked_by_id'   => 'required|exists:personnel,id',
            'locked_by_name' => 'required|string',
        ]);

        // Cek apakah point sudah dikunci
        $point = LotoPoint::find($request->loto_point_id);
        if ($point->isLocked()) {
            return $this->errorResponse('Titik isolasi ini sudah dikunci');
        }

        $lock = LotoLock::create(array_merge($request->all(), [
            'loto_procedure_id' => $procedureId,
            'work_permit_id'    => $procedure->work_permit_id,
            'locked_at'         => now(),
            'status'            => 'locked',
        ]));

        AuditTrail::log('loto', $lock, 'locked', $request->locked_by_name, $request->locked_by_id);

        return $this->successResponse($lock, 'Kunci berhasil dipasang', 201);
    }

    public function removeLock(Request $request, $procedureId, $lockId)
    {
        $lock = LotoLock::where('loto_procedure_id', $procedureId)->find($lockId);
        if (!$lock) return $this->notFoundResponse();

        if ($lock->status !== 'locked') {
            return $this->errorResponse('Kunci sudah dilepas');
        }

        $this->validate($request, [
            'unlocked_by_id'   => 'required|exists:personnel,id',
            'unlocked_by_name' => 'required|string',
        ]);

        // Verifikasi pelepas harus orang yang memasang (kecuali force remove)
        $isForceRemove = $request->get('force_remove', false);
        if (!$isForceRemove && $lock->locked_by_id !== (int) $request->unlocked_by_id) {
            return $this->errorResponse('Kunci hanya dapat dilepas oleh orang yang memasang. Gunakan force_remove jika diperlukan.');
        }

        $updateData = [
            'status'            => $isForceRemove ? 'force_removed' : 'unlocked',
            'unlocked_at'       => now(),
            'unlocked_by_id'    => $request->unlocked_by_id,
            'unlocked_by_name'  => $request->unlocked_by_name,
        ];

        if ($isForceRemove) {
            $updateData['force_remove_reason']        = $request->get('force_remove_reason', '');
            $updateData['force_remove_authorized_by'] = $request->get('authorized_by', '');
        }

        $lock->update($updateData);

        AuditTrail::log('loto', $lock, $isForceRemove ? 'force_removed' : 'unlocked', $request->unlocked_by_name, $request->unlocked_by_id);

        return $this->successResponse($lock->fresh());
    }

    // ================================================================
    // VERIFICATION
    // ================================================================

    public function verify(Request $request, $procedureId)
    {
        $procedure = LotoProcedure::find($procedureId);
        if (!$procedure) return $this->notFoundResponse();

        $this->validate($request, [
            'loto_point_id'     => 'required|exists:loto_points,id',
            'verified_by_name'  => 'required|string',
            'verification_result' => 'required|in:isolated,not_isolated,partial',
            'method_used'       => 'required|string',
        ]);

        $verification = LotoVerification::create(array_merge($request->all(), [
            'loto_procedure_id' => $procedureId,
            'work_permit_id'    => $procedure->work_permit_id,
            'verified_at'       => now(),
        ]));

        return $this->successResponse($verification, 'Verifikasi berhasil dicatat', 201);
    }

    // ================================================================
    // QR / NFC SCAN
    // ================================================================

    public function scanQr(Request $request)
    {
        $this->validate($request, [
            'qr_code' => 'required|string',
        ]);

        $point = LotoPoint::where('qr_code', $request->qr_code)
                          ->with(['procedure', 'activeLock.lockedBy', 'verifications'])
                          ->first();

        if (!$point) return $this->notFoundResponse('QR Code tidak ditemukan');

        return $this->successResponse($point);
    }

    public function scanNfc(Request $request)
    {
        $this->validate($request, [
            'nfc_tag_id' => 'required|string',
        ]);

        $point = LotoPoint::where('nfc_tag_id', $request->nfc_tag_id)
                          ->with(['procedure', 'activeLock.lockedBy', 'verifications'])
                          ->first();

        if (!$point) return $this->notFoundResponse('NFC Tag tidak ditemukan');

        return $this->successResponse($point);
    }
}
