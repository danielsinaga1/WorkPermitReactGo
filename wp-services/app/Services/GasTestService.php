<?php

namespace App\Services;

use App\Models\GasTestLog;
use App\Models\WorkPermit;
use App\Models\AuditTrail;
use App\Models\Notification;

class GasTestService
{
    /**
     * Record a gas test reading for a confined space permit.
     *
     * Business Rules:
     *   - Only allowed on CONFINED_SPACE / BLUE permits
     *   - Auto-evaluates safety based on O2, LEL, H2S, CO thresholds
     *   - If unsafe, the permit cannot be activated
     *   - Triggers notification if readings are dangerous
     */
    public function recordTest(WorkPermit $permit, array $data): array
    {
        $permitType = $permit->permitType;
        if (!$permitType || !in_array($permitType->code, ['CONFINED_SPACE', 'BLUE'])) {
            return ['errors' => ['Gas testing is only applicable to Confined Space (Blue Form) permits']];
        }

        $o2  = (float) $data['o2_level'];
        $lel = (float) $data['lel_level'];
        $h2s = (float) $data['h2s_level'];
        $co  = (float) $data['co_level'];

        $isSafe     = GasTestLog::evaluateSafety($o2, $lel, $h2s, $co);
        $violations = GasTestLog::getViolations($o2, $lel, $h2s, $co);

        $log = GasTestLog::create([
            'work_permit_id'   => $permit->id,
            'tested_by_id'     => $data['tested_by_id'] ?? null,
            'tested_by_name'   => $data['tested_by_name'],
            'tested_at'        => $data['tested_at'] ?? now(),
            'o2_level'         => $o2,
            'lel_level'        => $lel,
            'h2s_level'        => $h2s,
            'co_level'         => $co,
            'equipment_serial' => $data['equipment_serial'] ?? null,
            'is_safe'          => $isSafe,
            'remarks'          => $data['remarks'] ?? null,
            'gps_latitude'     => $data['gps_latitude'] ?? null,
            'gps_longitude'    => $data['gps_longitude'] ?? null,
        ]);

        AuditTrail::log('work_permit', $permit, 'gas_test_recorded', $data['tested_by_name']);

        // Alert if unsafe readings detected
        if (!$isSafe) {
            Notification::dispatch(
                'gas_test_unsafe',
                'UNSAFE Gas Test Reading',
                "Permit #{$permit->permit_number}: " . implode('; ', $violations),
                null,
                $permit->requested_by,
                ['permit_id' => $permit->id, 'violations' => $violations]
            );
        }

        return [
            'success'    => true,
            'gas_test'   => $log,
            'is_safe'    => $isSafe,
            'violations' => $violations,
        ];
    }
}
