<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmergencySosAlert extends Model
{
    protected $fillable = [
        'work_permit_id', 'triggered_by_id', 'triggered_by_name',
        'triggered_at', 'gps_latitude', 'gps_longitude',
        'alert_type', 'description', 'status',
        'acknowledged_by', 'acknowledged_at',
        'resolved_by', 'resolved_at', 'resolution_notes',
        'response_time_minutes',
    ];

    protected $casts = [
        'triggered_at'    => 'datetime',
        'acknowledged_at' => 'datetime',
        'resolved_at'     => 'datetime',
        'gps_latitude'    => 'decimal:7',
        'gps_longitude'   => 'decimal:7',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function triggeredBy()
    {
        return $this->belongsTo(Personnel::class, 'triggered_by_id');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['triggered', 'acknowledged', 'responding']);
    }
}
