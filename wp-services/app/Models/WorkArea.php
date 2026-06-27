<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkArea extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'code', 'description', 'zone_type',
        'latitude', 'longitude', 'radius_meters',
        'plant_unit', 'is_active',
    ];

    protected $casts = [
        'latitude'      => 'float',
        'longitude'     => 'float',
        'radius_meters' => 'float',
        'is_active'     => 'boolean',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function workPermits()
    {
        return $this->hasMany(WorkPermit::class);
    }

    public function toolboxMeetings()
    {
        return $this->hasMany(ToolboxMeeting::class);
    }

    public function safetyObservations()
    {
        return $this->hasMany(SafetyObservation::class);
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByZone($query, $zoneType)
    {
        return $query->where('zone_type', $zoneType);
    }
}
