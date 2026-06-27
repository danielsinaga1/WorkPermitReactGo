<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClashDetection extends Model
{
    protected $fillable = [
        'permit_a_id', 'permit_b_id', 'clash_type',
        'description', 'severity', 'resolution_status',
        'resolution_notes', 'resolved_by', 'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function permitA()
    {
        return $this->belongsTo(WorkPermit::class, 'permit_a_id');
    }

    public function permitB()
    {
        return $this->belongsTo(WorkPermit::class, 'permit_b_id');
    }

    public function scopeUnresolved($query)
    {
        return $query->where('resolution_status', 'unresolved');
    }

    /**
     * Deteksi clash otomatis untuk sebuah izin kerja.
     */
    public static function detectClashes(WorkPermit $permit): array
    {
        $clashes = [];

        // 1. Location + Time Clash — izin lain di area berdekatan pada waktu yang tumpang tindih
        $overlapping = WorkPermit::where('id', '!=', $permit->id)
            ->whereNotIn('status', ['cancelled', 'rejected', 'closed', 'completed', 'draft'])
            ->where(function ($q) use ($permit) {
                $q->where('planned_start', '<', $permit->planned_end)
                  ->where('planned_end', '>', $permit->planned_start);
            })
            ->with('workArea')
            ->get();

        foreach ($overlapping as $other) {
            // Cek jarak area kerja
            if ($permit->work_area_id === $other->work_area_id) {
                $clashes[] = [
                    'permit_b_id' => $other->id,
                    'clash_type'  => 'location',
                    'severity'    => 'critical',
                    'description' => "Konflik lokasi: Izin #{$other->permit_number} di area yang sama ({$other->workArea->name}) pada waktu yang bertumpang tindih.",
                ];
            } elseif ($permit->workArea && $other->workArea) {
                $distance = self::calculateDistance(
                    $permit->workArea->latitude, $permit->workArea->longitude,
                    $other->workArea->latitude, $other->workArea->longitude
                );
                $safeRadius = max($permit->workArea->radius_meters, $other->workArea->radius_meters);

                if ($distance !== null && $distance <= $safeRadius) {
                    $clashes[] = [
                        'permit_b_id' => $other->id,
                        'clash_type'  => 'location',
                        'severity'    => 'warning',
                        'description' => "Peringatan kedekatan: Izin #{$other->permit_number} berjarak " . round($distance) . "m (radius aman: {$safeRadius}m).",
                    ];
                }
            }

            // 2. Resource clash — peralatan yang sama digunakan
            $sharedEquipment = $permit->equipment()->pluck('equipment.id')
                ->intersect($other->equipment()->pluck('equipment.id'));
            if ($sharedEquipment->isNotEmpty()) {
                $clashes[] = [
                    'permit_b_id' => $other->id,
                    'clash_type'  => 'resource',
                    'severity'    => 'critical',
                    'description' => "Konflik sumber daya: " . $sharedEquipment->count() . " peralatan digunakan bersamaan dengan Izin #{$other->permit_number}.",
                ];
            }
        }

        return $clashes;
    }

    /**
     * Haversine distance (meters).
     */
    private static function calculateDistance(?float $lat1, ?float $lon1, ?float $lat2, ?float $lon2): ?float
    {
        if (!$lat1 || !$lon1 || !$lat2 || !$lon2) return null;

        $R = 6371000; // radius bumi (meter)
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) ** 2
           + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $R * $c;
    }
}
