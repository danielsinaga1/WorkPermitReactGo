<?php

namespace App\Services;

use App\Models\EmergencySosAlert;
use App\Models\WorkPermit;
use App\Models\Notification;
use App\Models\AuditTrail;

class EmergencyService
{
    /**
     * Trigger an SOS alert — sends immediate notification to ERT.
     * Crucial for Blue Form (Confined Space) scenarios.
     */
    public function triggerSos(array $data): EmergencySosAlert
    {
        $alert = EmergencySosAlert::create([
            'work_permit_id'    => $data['work_permit_id'] ?? null,
            'triggered_by_id'   => $data['triggered_by_id'] ?? null,
            'triggered_by_name' => $data['triggered_by_name'],
            'triggered_at'      => now(),
            'gps_latitude'      => $data['gps_latitude'] ?? null,
            'gps_longitude'     => $data['gps_longitude'] ?? null,
            'alert_type'        => $data['alert_type'] ?? 'sos',
            'description'       => $data['description'] ?? null,
            'status'            => 'triggered',
        ]);

        // Broadcast to all HSE / ERT personnel (in real app, push to all ERT)
        Notification::dispatch(
            'sos_alert',
            'EMERGENCY SOS ALERT',
            "SOS triggered by {$data['triggered_by_name']}"
                . ($data['gps_latitude'] ? " at GPS ({$data['gps_latitude']}, {$data['gps_longitude']})" : ''),
            null,
            null,
            [
                'alert_id'  => $alert->id,
                'permit_id' => $data['work_permit_id'] ?? null,
                'lat'       => $data['gps_latitude'] ?? null,
                'lng'       => $data['gps_longitude'] ?? null,
                'type'      => $data['alert_type'] ?? 'sos',
            ],
            'push' // high-priority channel
        );

        if ($alert->work_permit_id) {
            AuditTrail::log(
                'work_permit',
                WorkPermit::find($alert->work_permit_id),
                'sos_triggered',
                $data['triggered_by_name']
            );
        }

        return $alert;
    }

    /**
     * Acknowledge an SOS alert (ERT is responding).
     */
    public function acknowledge(EmergencySosAlert $alert, string $acknowledgedBy): EmergencySosAlert
    {
        $alert->update([
            'status'          => 'acknowledged',
            'acknowledged_by' => $acknowledgedBy,
            'acknowledged_at' => now(),
        ]);

        return $alert->fresh();
    }

    /**
     * Resolve an SOS alert.
     */
    public function resolve(EmergencySosAlert $alert, string $resolvedBy, ?string $notes = null): EmergencySosAlert
    {
        $responseMinutes = null;
        if ($alert->triggered_at) {
            $responseMinutes = (int) $alert->triggered_at->diffInMinutes(now());
        }

        $alert->update([
            'status'                => 'resolved',
            'resolved_by'           => $resolvedBy,
            'resolved_at'           => now(),
            'resolution_notes'      => $notes,
            'response_time_minutes' => $responseMinutes,
        ]);

        return $alert->fresh();
    }
}
