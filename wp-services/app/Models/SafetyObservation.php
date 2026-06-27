<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SafetyObservation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'observation_number', 'type', 'category',
        'work_area_id', 'work_permit_id',
        'reported_by_name', 'reported_by_id',
        'observed_at', 'description',
        'exact_location', 'gps_latitude', 'gps_longitude',
        'severity', 'status',
        'requires_immediate_action', 'immediate_action_taken',
        'is_mobile_report',
    ];

    protected $casts = [
        'observed_at'               => 'datetime',
        'gps_latitude'              => 'float',
        'gps_longitude'             => 'float',
        'requires_immediate_action' => 'boolean',
        'is_mobile_report'          => 'boolean',
    ];

    public function workArea()
    {
        return $this->belongsTo(WorkArea::class);
    }

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function reporter()
    {
        return $this->belongsTo(Personnel::class, 'reported_by_id');
    }

    public function photos()
    {
        return $this->hasMany(ObservationPhoto::class);
    }

    public function correctiveActions()
    {
        return $this->morphMany(CorrectiveAction::class, 'actionable');
    }

    public function scopeOpen($query)
    {
        return $query->whereNotIn('status', ['closed', 'verified']);
    }

    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }

    public static function generateNumber(): string
    {
        $date = now()->format('Ymd');
        $count = static::whereDate('created_at', now()->toDateString())->count() + 1;
        return "OBS-{$date}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
