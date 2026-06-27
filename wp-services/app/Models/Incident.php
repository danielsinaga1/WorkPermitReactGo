<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Incident extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'incident_number', 'type', 'severity', 'severity_class',
        'work_area_id', 'work_permit_id',
        'reported_by_name', 'reported_by_id',
        'incident_date', 'reported_date',
        'exact_location', 'description',
        'immediate_actions_taken',
        'injured_person_name', 'injured_person_company',
        'injury_type', 'body_part_affected', 'lost_days',
        'environmental_impact', 'property_damage_cost',
        'status', 'investigation_lead', 'investigation_summary',
        'lessons_learned', 'pdf_report_path',
        'closed_at', 'closed_by',
    ];

    protected $casts = [
        'incident_date'        => 'datetime',
        'reported_date'        => 'datetime',
        'closed_at'            => 'datetime',
        'environmental_impact' => 'array',
        'property_damage_cost' => 'float',
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

    public function witnesses()
    {
        return $this->hasMany(IncidentWitness::class);
    }

    public function rootCauses()
    {
        return $this->hasMany(IncidentRootCause::class);
    }

    public function attachments()
    {
        return $this->hasMany(IncidentAttachment::class);
    }

    public function correctiveActions()
    {
        return $this->morphMany(CorrectiveAction::class, 'actionable');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOpen($query)
    {
        return $query->whereNotIn('status', ['closed']);
    }

    public static function generateNumber(): string
    {
        $date = now()->format('Ymd');
        $count = static::whereDate('created_at', now()->toDateString())->count() + 1;
        return "INC-{$date}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
