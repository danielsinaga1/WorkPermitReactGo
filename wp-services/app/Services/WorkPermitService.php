<?php

namespace App\Services;

use App\Models\WorkPermit;
use App\Models\WorkArea;
use App\Models\PermitType;
use App\Models\ClashDetection;
use App\Models\GasTestLog;
use App\Models\GeofenceLog;
use App\Models\JsaTemplate;
use App\Models\JsaRecord;
use App\Models\LessonLearned;
use App\Models\LessonAcknowledgement;
use App\Models\AuditTrail;
use App\Models\Notification;
use Carbon\Carbon;

class WorkPermitService
{
    /**
     * ================================================================
     * STATE TRANSITION: Draft -> Submitted -> Approved -> Active -> Closed
     * ================================================================
     * Enforces all business rules before state changes.
     */

    /**
     * Submit a draft permit for approval. Runs all validations.
     */
    public function submitForApproval(WorkPermit $permit): array
    {
        $errors = [];

        // Rule: Must be in draft status
        if ($permit->status !== 'draft') {
            return ['errors' => ['Only draft permits can be submitted']];
        }

        // Feature #13 — Safety Induction Linkage: block if worker certs expired
        $qualErrors = $this->verifyPersonnelQualifications($permit);
        if (!empty($qualErrors)) {
            $errors = array_merge($errors, $qualErrors);
        }

        // Feature #12 — Blue Form: gas testing mandatory before submit
        $gasErrors = $this->validateGasTestingRequirement($permit);
        if (!empty($gasErrors)) {
            $errors = array_merge($errors, $gasErrors);
        }

        // Feature #1 — JSA must be attached
        if (!$permit->jsaRecord) {
            $errors[] = 'Job Safety Analysis (JSA) must be completed before submission';
        }

        // Feature #7 — SIMOPS: conflict detection
        $clashes = $this->runConflictDetection($permit);
        $criticalClashes = array_filter($clashes, fn($c) => $c['severity'] === 'critical');
        if (!empty($criticalClashes)) {
            $errors[] = 'Critical SIMOPS conflict detected: ' . $clashes[0]['description'];
        }

        // Feature #20 — Lesson Learned: Red Form must acknowledge past incidents
        $lessonErrors = $this->validateLessonLearnedAcknowledgement($permit);
        if (!empty($lessonErrors)) {
            $errors = array_merge($errors, $lessonErrors);
        }

        if (!empty($errors)) {
            return ['errors' => $errors, 'clashes' => $clashes ?? []];
        }

        // Persist any warning-level clashes
        if (!empty($clashes)) {
            foreach ($clashes as $clashData) {
                ClashDetection::create(array_merge($clashData, [
                    'permit_a_id' => $permit->id,
                ]));
            }
            $permit->update(['has_clash' => true]);
        }

        $permit->update([
            'status'                 => 'submitted',
            'current_approval_stage' => 1,
        ]);

        AuditTrail::log('work_permit', $permit, 'submitted', $permit->requester->name ?? 'User');

        // Feature #5 — notify first approver
        $this->notifyNextApprover($permit);

        return ['success' => true, 'permit' => $permit->fresh()];
    }

    /**
     * Activate an approved permit. Validates geofencing.
     */
    public function activatePermit(WorkPermit $permit, ?float $lat = null, ?float $lng = null): array
    {
        if ($permit->status !== 'approved') {
            return ['errors' => ['Only approved permits can be activated']];
        }

        // Feature #3 — Geofencing: validate worker is on-site
        if ($lat !== null && $lng !== null) {
            $geoResult = $this->validateGeofence($permit, $lat, $lng);
            if (!$geoResult['is_within']) {
                return ['errors' => ["Worker is outside the geofence ({$geoResult['distance']}m from site, max {$geoResult['radius']}m)"]];
            }
        }

        $permit->update(['status' => 'active', 'actual_start' => now()]);
        AuditTrail::log('work_permit', $permit, 'activated', 'User');

        return ['success' => true, 'permit' => $permit->fresh()];
    }

    /**
     * Close/complete a permit. Validates photo evidence for Green Form.
     */
    public function closePermit(WorkPermit $permit, string $closedBy, ?string $remarks = null): array
    {
        if (!in_array($permit->status, ['active', 'approved'])) {
            return ['errors' => ['Only active permits can be closed']];
        }

        // Feature #9 — Green Form (General Work): mandatory before/after photos
        $permitType = $permit->permitType;
        if ($permitType && in_array($permitType->code, ['GENERAL', 'NON_PLANT', 'GREEN'])) {
            $beforePhotos = $permit->photos()->where('photo_type', 'before')->count();
            $afterPhotos  = $permit->photos()->where('photo_type', 'after')->count();
            if ($beforePhotos === 0 || $afterPhotos === 0) {
                return ['errors' => ['Green Form requires both before and after photo evidence for closing']];
            }
        }

        $permit->update([
            'status'          => 'closed',
            'actual_end'      => now(),
            'closed_at'       => now(),
            'closed_by_name'  => $closedBy,
            'closure_remarks' => $remarks,
        ]);

        AuditTrail::log('work_permit', $permit, 'closed', $closedBy);

        return ['success' => true, 'permit' => $permit->fresh()];
    }

    // ================================================================
    // FEATURE #12 — GAS TESTING VALIDATION (Blue Form only)
    // ================================================================

    /**
     * Validate that Blue Form (Confined Space) has valid gas test results.
     */
    public function validateGasTestingRequirement(WorkPermit $permit): array
    {
        $permitType = $permit->permitType;
        if (!$permitType || !in_array($permitType->code, ['CONFINED_SPACE', 'BLUE'])) {
            return []; // Only mandatory for Blue Form
        }

        $latestTest = $permit->gasTestLogs()->latest('tested_at')->first();

        if (!$latestTest) {
            return ['Gas testing is mandatory for Confined Space permits — no gas test recorded'];
        }

        if (!$latestTest->is_safe) {
            return ['Latest gas test readings are outside safe limits. Entry forbidden.'];
        }

        // Check if gas test is recent (within 4 hours)
        if ($latestTest->tested_at->diffInHours(now()) > 4) {
            return ['Gas test results are stale (>4 hours old). Re-testing required.'];
        }

        return [];
    }

    // ================================================================
    // FEATURE #7 — SIMOPS CONFLICT DETECTION
    // ================================================================

    /**
     * Simultaneous Operations (SIMOPS) detection.
     * Block Red Forms if Flammable-related Blue/Green forms exist within 50m.
     */
    public function runConflictDetection(WorkPermit $permit): array
    {
        $clashes = [];
        $permitType = $permit->permitType;
        $workArea = $permit->workArea;

        if (!$permitType || !$workArea) {
            return $clashes;
        }

        $isHotWork = in_array($permitType->code, ['HOT_WORK', 'RED']);

        if (!$isHotWork) {
            return $clashes; // SIMOPS primarily blocks Red Forms
        }

        // Find active/approved permits in nearby areas
        $nearbyPermits = WorkPermit::where('id', '!=', $permit->id)
            ->whereNotIn('status', ['cancelled', 'rejected', 'closed', 'completed', 'draft', 'expired'])
            ->where(function ($q) use ($permit) {
                // Overlapping time window
                $q->where('planned_start', '<', $permit->planned_end)
                  ->where('planned_end', '>', $permit->planned_start);
            })
            ->with(['workArea', 'permitType'])
            ->get();

        foreach ($nearbyPermits as $other) {
            if (!$other->workArea || !$other->permitType) continue;

            // Calculate distance between work areas
            $distance = GeofenceLog::haversineDistance(
                $workArea->latitude ?? 0,
                $workArea->longitude ?? 0,
                $other->workArea->latitude ?? 0,
                $other->workArea->longitude ?? 0
            );

            // Within 50m radius — check for flammable conflicts
            if ($distance <= 50) {
                $otherCode = $other->permitType->code;
                $isConflicting = in_array($otherCode, ['CONFINED_SPACE', 'BLUE', 'GENERAL', 'GREEN', 'NON_PLANT']);

                if ($isConflicting) {
                    $clashes[] = [
                        'permit_b_id'       => $other->id,
                        'clash_type'        => 'location',
                        'severity'          => 'critical',
                        'description'       => "Hot Work (RED) permit conflicts with {$other->permitType->name} "
                                             . "(#{$other->permit_number}) within {$distance}m radius. "
                                             . "Fire/explosion risk from simultaneous operations.",
                        'resolution_status' => 'unresolved',
                    ];
                }
            }
        }

        return $clashes;
    }

    // ================================================================
    // FEATURE #3 — GEOFENCING
    // ================================================================

    /**
     * Validate GPS position is within work area geofence.
     */
    public function validateGeofence(WorkPermit $permit, float $lat, float $lng): array
    {
        $workArea = $permit->workArea;
        if (!$workArea || !$workArea->latitude || !$workArea->longitude) {
            return ['is_within' => true, 'distance' => 0, 'radius' => 0]; // No geofence configured
        }

        $distance = GeofenceLog::haversineDistance(
            $lat, $lng,
            $workArea->latitude, $workArea->longitude
        );

        $isWithin = $distance <= $workArea->radius_meters;

        // Log the geofence check
        GeofenceLog::create([
            'work_permit_id'      => $permit->id,
            'personnel_name'      => $permit->requester->name ?? 'Unknown',
            'personnel_id'        => $permit->requested_by,
            'latitude'            => $lat,
            'longitude'           => $lng,
            'distance_from_center'=> round($distance, 2),
            'is_within_geofence'  => $isWithin,
            'event_type'          => $isWithin ? 'check_in' : 'violation',
        ]);

        return [
            'is_within' => $isWithin,
            'distance'  => round($distance, 2),
            'radius'    => $workArea->radius_meters,
        ];
    }

    // ================================================================
    // FEATURE #13 — SAFETY INDUCTION LINKAGE
    // ================================================================

    /**
     * Check all personnel have valid (non-expired) qualifications.
     */
    public function verifyPersonnelQualifications(WorkPermit $permit): array
    {
        $errors = [];
        $requiredQuals = $permit->permitType->required_qualifications ?? [];

        foreach ($permit->personnel as $person) {
            foreach ($requiredQuals as $qual) {
                $valid = $person->qualifications()
                    ->where('qualification_type', $qual)
                    ->where('status', 'valid')
                    ->where('expiry_date', '>', now())
                    ->exists();

                if (!$valid) {
                    $errors[] = "{$person->name}: HSE certificate '{$qual}' is expired or missing — permit blocked";
                }
            }
        }

        return $errors;
    }

    // ================================================================
    // FEATURE #20 — LESSON LEARNED (Red Form mandatory reading)
    // ================================================================

    /**
     * Verify requester has acknowledged all mandatory lessons for this permit type.
     */
    public function validateLessonLearnedAcknowledgement(WorkPermit $permit): array
    {
        $permitType = $permit->permitType;
        if (!$permitType || !in_array($permitType->code, ['HOT_WORK', 'RED'])) {
            return []; // Only mandatory for Red Forms
        }

        $mandatoryLessons = LessonLearned::getMandatoryForPermitType($permitType->code);
        $errors = [];

        foreach ($mandatoryLessons as $lesson) {
            $acknowledged = LessonAcknowledgement::where('lesson_id', $lesson->id)
                ->where('personnel_id', $permit->requested_by)
                ->where('work_permit_id', $permit->id)
                ->exists();

            if (!$acknowledged) {
                $errors[] = "Mandatory lesson '{$lesson->title}' has not been acknowledged";
            }
        }

        return $errors;
    }

    // ================================================================
    // FEATURE #10 — AUTOMATED EXPIRY
    // ================================================================

    /**
     * Auto-suspend permits that have passed their planned end time.
     * Called by a scheduled command (e.g., every 5 minutes).
     */
    public function expireOverduePermits(): int
    {
        $expired = WorkPermit::whereIn('status', ['active', 'approved'])
            ->where('planned_end', '<', now())
            ->get();

        foreach ($expired as $permit) {
            $permit->update(['status' => 'expired']);
            AuditTrail::log('work_permit', $permit, 'auto_expired', 'System');

            // Notify requester
            Notification::dispatch(
                'permit_expired',
                'Permit Expired',
                "Work permit #{$permit->permit_number} has automatically expired (shift ended).",
                null,
                $permit->requested_by,
                ['permit_id' => $permit->id]
            );
        }

        return $expired->count();
    }

    // ================================================================
    // FEATURE #1 — DIGITAL JSA (Auto-generation)
    // ================================================================

    /**
     * Auto-generate a JSA record for a permit from template.
     */
    public function generateJsa(WorkPermit $permit): ?JsaRecord
    {
        $permitType = $permit->permitType;
        $workArea   = $permit->workArea;

        $template = JsaTemplate::findForPermit(
            $permitType->code ?? '',
            $workArea->zone_type ?? null
        );

        if (!$template) {
            return null;
        }

        return JsaRecord::create([
            'work_permit_id'  => $permit->id,
            'jsa_template_id' => $template->id,
            'steps'           => $template->steps,
            'prepared_by'     => $permit->requester->name ?? 'System',
            'status'          => 'draft',
        ]);
    }

    // ================================================================
    // HELPER — Notify next approver in workflow
    // ================================================================

    private function notifyNextApprover(WorkPermit $permit): void
    {
        $nextApproval = $permit->approvals()
            ->where('stage_order', $permit->current_approval_stage)
            ->first();

        if ($nextApproval && $nextApproval->approver_id) {
            Notification::dispatch(
                'approval_required',
                'Approval Required',
                "Work permit #{$permit->permit_number} requires your approval (Stage: {$nextApproval->stage_name})",
                null,
                $nextApproval->approver_id,
                ['permit_id' => $permit->id, 'stage' => $nextApproval->stage_name]
            );
        }
    }
}
