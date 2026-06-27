<?php

namespace App\Http\Controllers;

use App\Models\GasTestLog;
use App\Models\WorkPermit;
use App\Models\EmergencySosAlert;
use App\Models\LessonLearned;
use App\Models\LessonAcknowledgement;
use App\Models\ESignature;
use App\Models\JsaTemplate;
use App\Models\JsaRecord;
use App\Models\ContractorCompany;
use App\Models\Notification;
use App\Models\PermitPhoto;
use App\Models\GeofenceLog;
use App\Services\WorkPermitService;
use App\Services\GasTestService;
use App\Services\EmergencyService;
use App\Services\ESignatureService;
use App\Models\AuditTrail;
use Illuminate\Http\Request;

class ExtendedHseController extends Controller
{
    // ================================================================
    // FEATURE #12 — GAS TESTING LOG (Blue Form only)
    // ================================================================

    /**
     * List gas test logs for a permit.
     */
    public function indexGasTests($permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        return $this->successResponse(
            $permit->gasTestLogs()->with('tester')->orderBy('tested_at', 'desc')->get()
        );
    }

    /**
     * Record a new gas test reading.
     * Business rule: only for CONFINED_SPACE / BLUE permits.
     */
    public function storeGasTest(Request $request, $permitId)
    {
        $permit = WorkPermit::with('permitType')->find($permitId);
        if (!$permit) return $this->notFoundResponse();

        $this->validate($request, [
            'tested_by_name' => 'required|string',
            'o2_level'       => 'required|numeric|min:0|max:100',
            'lel_level'      => 'required|numeric|min:0|max:100',
            'h2s_level'      => 'required|numeric|min:0',
            'co_level'       => 'required|numeric|min:0',
        ]);

        $service = new GasTestService();
        $result  = $service->recordTest($permit, $request->all());

        if (isset($result['errors'])) {
            return $this->errorResponse($result['errors'][0], 422);
        }

        return $this->successResponse($result, 'Gas test recorded', 201);
    }

    // ================================================================
    // FEATURE #16 — EMERGENCY SOS BUTTON
    // ================================================================

    /**
     * Trigger an SOS alert.
     */
    public function triggerSos(Request $request)
    {
        $this->validate($request, [
            'triggered_by_name' => 'required|string',
        ]);

        $service = new EmergencyService();
        $alert   = $service->triggerSos($request->all());

        return $this->successResponse($alert, 'SOS alert triggered', 201);
    }

    /**
     * List active SOS alerts.
     */
    public function indexSosAlerts(Request $request)
    {
        $query = EmergencySosAlert::orderBy('triggered_at', 'desc');

        if ($request->get('active_only')) {
            $query->active();
        }

        return $this->paginatedResponse($query->paginate($request->get('per_page', 15)));
    }

    /**
     * Acknowledge an SOS alert.
     */
    public function acknowledgeSos(Request $request, $id)
    {
        $alert = EmergencySosAlert::find($id);
        if (!$alert) return $this->notFoundResponse();

        $service = new EmergencyService();
        $alert   = $service->acknowledge($alert, $request->get('acknowledged_by', 'ERT'));

        return $this->successResponse($alert);
    }

    /**
     * Resolve an SOS alert.
     */
    public function resolveSos(Request $request, $id)
    {
        $alert = EmergencySosAlert::find($id);
        if (!$alert) return $this->notFoundResponse();

        $service = new EmergencyService();
        $alert   = $service->resolve($alert, $request->get('resolved_by', 'ERT'), $request->get('notes'));

        return $this->successResponse($alert);
    }

    // ================================================================
    // FEATURE #20 — LESSON LEARNED REPOSITORY
    // ================================================================

    /**
     * List lessons learned (optionally filtered by permit type).
     */
    public function indexLessons(Request $request)
    {
        $query = LessonLearned::where('is_active', true);

        if ($request->has('permit_type')) {
            $query->whereJsonContains('applicable_permit_types', $request->permit_type);
        }

        return $this->successResponse($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Get mandatory lessons for a permit (Red Form pop-up).
     */
    public function mandatoryLessons($permitId)
    {
        $permit = WorkPermit::with('permitType')->find($permitId);
        if (!$permit) return $this->notFoundResponse();

        $lessons = LessonLearned::getMandatoryForPermitType($permit->permitType->code ?? '');

        // Check which are already acknowledged
        $lessons->each(function ($lesson) use ($permit) {
            $lesson->is_acknowledged = LessonAcknowledgement::where('lesson_id', $lesson->id)
                ->where('personnel_id', $permit->requested_by)
                ->where('work_permit_id', $permit->id)
                ->exists();
        });

        return $this->successResponse($lessons);
    }

    /**
     * Acknowledge a lesson learned.
     */
    public function acknowledgLesson(Request $request, $lessonId)
    {
        $this->validate($request, [
            'personnel_id'  => 'required|exists:personnel,id',
            'work_permit_id'=> 'nullable|exists:work_permits,id',
        ]);

        LessonAcknowledgement::updateOrCreate(
            [
                'lesson_id'      => $lessonId,
                'personnel_id'   => $request->personnel_id,
                'work_permit_id' => $request->work_permit_id,
            ],
            ['acknowledged_at' => now()]
        );

        return $this->successResponse(null, 'Lesson acknowledged');
    }

    /**
     * Create a lesson learned entry.
     */
    public function storeLesson(Request $request)
    {
        $this->validate($request, [
            'title'               => 'required|string|max:255',
            'summary'             => 'required|string',
            'preventive_measures' => 'required|string',
        ]);

        $lesson = LessonLearned::create($request->all());

        return $this->successResponse($lesson, 'Lesson learned created', 201);
    }

    // ================================================================
    // FEATURE #6 — E-SIGNATURE
    // ================================================================

    /**
     * Store an electronic signature.
     */
    public function storeSignature(Request $request)
    {
        $this->validate($request, [
            'signable_type'       => 'required|string',
            'signable_id'         => 'required|integer',
            'signature_image'     => 'required|string', // base64
            'signer_name'         => 'required|string',
        ]);

        $service   = new ESignatureService();
        $signature = $service->sign(
            $request->signable_type,
            $request->signable_id,
            $request->signature_image,
            $request->signer_name,
            $request->signer_id,
            $request->signer_role,
            $request
        );

        return $this->successResponse($signature, 'Signature recorded', 201);
    }

    // ================================================================
    // FEATURE #1 — DIGITAL JSA
    // ================================================================

    /**
     * List JSA templates.
     */
    public function indexJsaTemplates()
    {
        return $this->successResponse(JsaTemplate::where('is_active', true)->get());
    }

    /**
     * Generate or get JSA for a permit.
     */
    public function getOrCreateJsa($permitId)
    {
        $permit = WorkPermit::with(['permitType', 'workArea'])->find($permitId);
        if (!$permit) return $this->notFoundResponse();

        $jsa = $permit->jsaRecord;

        if (!$jsa) {
            $service = new WorkPermitService();
            $jsa     = $service->generateJsa($permit);

            if (!$jsa) {
                return $this->errorResponse('No JSA template found for this permit type', 404);
            }
        }

        return $this->successResponse($jsa->load('template'));
    }

    /**
     * Update JSA record steps (editable by permit requester).
     */
    public function updateJsa(Request $request, $permitId)
    {
        $jsa = JsaRecord::where('work_permit_id', $permitId)->first();
        if (!$jsa) return $this->notFoundResponse();

        $jsa->update($request->only(['steps', 'reviewed_by', 'status']));

        if ($request->status === 'approved') {
            $jsa->update(['approved_at' => now()]);
        }

        return $this->successResponse($jsa->fresh());
    }

    // ================================================================
    // FEATURE #14 — CONTRACTOR MANAGEMENT
    // ================================================================

    public function indexContractors(Request $request)
    {
        $query = ContractorCompany::query();

        if ($request->has('compliance_status')) {
            $query->where('compliance_status', $request->compliance_status);
        }

        return $this->paginatedResponse($query->orderBy('name')->paginate($request->get('per_page', 15)));
    }

    public function storeContractor(Request $request)
    {
        $this->validate($request, [
            'name'                => 'required|string|max:255',
            'registration_number' => 'required|string|unique:contractor_companies',
        ]);

        $company = ContractorCompany::create($request->all());
        return $this->successResponse($company, 'Contractor registered', 201);
    }

    public function updateContractor(Request $request, $id)
    {
        $company = ContractorCompany::find($id);
        if (!$company) return $this->notFoundResponse();

        $company->update($request->all());
        return $this->successResponse($company->fresh());
    }

    // ================================================================
    // FEATURE #9 — PHOTO EVIDENCE
    // ================================================================

    public function indexPermitPhotos($permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        return $this->successResponse($permit->photos()->orderBy('created_at')->get());
    }

    public function storePermitPhoto(Request $request, $permitId)
    {
        $permit = WorkPermit::find($permitId);
        if (!$permit) return $this->notFoundResponse();

        $this->validate($request, [
            'photo_path' => 'required|string',
            'photo_type' => 'required|in:before,during,after',
        ]);

        $photo = PermitPhoto::create(array_merge($request->all(), [
            'work_permit_id' => $permitId,
        ]));

        return $this->successResponse($photo, 'Photo uploaded', 201);
    }

    // ================================================================
    // FEATURE #3 — GEOFENCE VALIDATION
    // ================================================================

    public function validateGeofence(Request $request, $permitId)
    {
        $permit = WorkPermit::with('workArea')->find($permitId);
        if (!$permit) return $this->notFoundResponse();

        $this->validate($request, [
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $service = new WorkPermitService();
        $result  = $service->validateGeofence($permit, $request->latitude, $request->longitude);

        return $this->successResponse($result);
    }

    // ================================================================
    // FEATURE #5 — NOTIFICATIONS
    // ================================================================

    public function indexNotifications(Request $request)
    {
        $query = Notification::query();

        if ($request->has('personnel_id')) {
            $query->where('personnel_id', $request->personnel_id);
        }
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->get('unread_only')) {
            $query->unread();
        }

        return $this->paginatedResponse(
            $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 20))
        );
    }

    public function markNotificationRead($id)
    {
        $notif = Notification::find($id);
        if (!$notif) return $this->notFoundResponse();

        $notif->update(['is_read' => true, 'read_at' => now()]);
        return $this->successResponse($notif->fresh());
    }

    // ================================================================
    // FEATURE #4 — QR CODE VERIFICATION
    // ================================================================

    public function verifyPermitQr(Request $request)
    {
        $this->validate($request, ['permit_number' => 'required|string']);

        $permit = WorkPermit::with(['permitType', 'workArea', 'requester', 'approvals'])
            ->where('permit_number', $request->permit_number)
            ->first();

        if (!$permit) {
            return $this->errorResponse('Permit not found', 404);
        }

        return $this->successResponse([
            'permit'     => $permit,
            'is_valid'   => in_array($permit->status, ['approved', 'active']),
            'is_expired' => $permit->isExpired(),
            'verified_at'=> now()->toIso8601String(),
        ]);
    }

    // ================================================================
    // ENHANCED SUBMIT WITH ALL VALIDATIONS
    // ================================================================

    /**
     * Submit permit with full service-layer validation (SIMOPS, gas test, certs, lessons).
     */
    public function submitPermitV2(Request $request, $id)
    {
        $permit = WorkPermit::with(['permitType', 'workArea', 'personnel.qualifications', 'equipment', 'jsaRecord'])->find($id);
        if (!$permit) return $this->notFoundResponse();

        $service = new WorkPermitService();
        $result  = $service->submitForApproval($permit);

        if (isset($result['errors'])) {
            return $this->errorResponse(
                $result['errors'][0],
                422,
                [
                    'validation_errors' => $result['errors'],
                    'clashes'           => $result['clashes'] ?? [],
                ]
            );
        }

        return $this->successResponse($result['permit']->load(['permitType', 'workArea', 'approvals']), 'Permit submitted successfully');
    }

    /**
     * Activate permit with geofence validation.
     */
    public function activatePermitV2(Request $request, $id)
    {
        $permit = WorkPermit::with('workArea')->find($id);
        if (!$permit) return $this->notFoundResponse();

        $service = new WorkPermitService();
        $result  = $service->activatePermit(
            $permit,
            $request->input('latitude'),
            $request->input('longitude')
        );

        if (isset($result['errors'])) {
            return $this->errorResponse($result['errors'][0], 422);
        }

        return $this->successResponse($result['permit']);
    }

    /**
     * Close permit with photo evidence validation (Green Form).
     */
    public function closePermitV2(Request $request, $id)
    {
        $permit = WorkPermit::with(['permitType', 'photos'])->find($id);
        if (!$permit) return $this->notFoundResponse();

        $service = new WorkPermitService();
        $result  = $service->closePermit(
            $permit,
            $request->get('closed_by', 'User'),
            $request->get('remarks')
        );

        if (isset($result['errors'])) {
            return $this->errorResponse($result['errors'][0], 422);
        }

        return $this->successResponse($result['permit']);
    }

    // ================================================================
    // AUDIT TRAIL
    // ================================================================

    /**
     * List audit trail records with search, filters and pagination.
     */
    public function indexAuditTrails(Request $request)
    {
        $query = AuditTrail::with('performer')->orderBy('created_at', 'desc');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('performed_by', 'like', "%{$search}%")
                  ->orWhere('module', 'like', "%{$search}%")
                  ->orWhere('auditable_type', 'like', "%{$search}%");
            });
        }

        if ($action = $request->get('action')) {
            $query->where('action', $action);
        }

        if ($dateFrom = $request->get('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->get('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        return $this->paginatedResponse(
            $query->paginate($request->get('per_page', 20))
        );
    }
}
