<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeofenceLog extends Model
{
    protected $fillable = [
        'work_permit_id', 'personnel_id', 'personnel_name',
        'latitude', 'longitude', 'distance_from_center',
        'is_within_geofence', 'event_type',
    ];

    protected $casts = [
        'latitude'             => 'decimal:7',
        'longitude'            => 'decimal:7',
        'distance_from_center' => 'decimal:2',
        'is_within_geofence'   => 'boolean',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }

    /**
     * Calculate haversine distance between two GPS coordinates (in meters).
     */
    public static function haversineDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000; // meters
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) ** 2
           + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
