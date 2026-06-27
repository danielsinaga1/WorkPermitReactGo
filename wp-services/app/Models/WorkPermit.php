<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkPermit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'permit_number', 'permit_type_id', 'work_area_id', 'requested_by',
        'title', 'work_description', 'planned_start', 'planned_end',
        'actual_start', 'actual_end', 'priority', 'status',
        'current_approval_stage', 'safety_precautions', 'ppe_requirements',
        'gas_test_results', 'isolation_details', 'special_conditions',
        'is_night_work', 'night_work_justification',
        'rejection_reason', 'suspension_reason',
        'revoked_by', 'revoked_at', 'revoke_reason',
        'closure_remarks', 'closed_by_name', 'closed_at', 'has_clash',
    ];

    protected $casts = [
        'planned_start'      => 'datetime',
        'planned_end'        => 'datetime',
        'actual_start'       => 'datetime',
        'actual_end'         => 'datetime',
        'closed_at'          => 'datetime',
        'revoked_at'         => 'datetime',
        'safety_precautions' => 'array',
        'ppe_requirements'   => 'array',
        'gas_test_results'   => 'array',
        'isolation_details'  => 'array',
        'has_clash'          => 'boolean',
        'is_night_work'      => 'boolean',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function permitType()
    {
        return $this->belongsTo(PermitType::class);
    }

    public function workArea()
    {
        return $this->belongsTo(WorkArea::class);
    }

    public function requester()
    {
        return $this->belongsTo(Personnel::class, 'requested_by');
    }

    public function approvals()
    {
        return $this->hasMany(PermitApproval::class)->orderBy('stage_order');
    }

    public function currentApproval()
    {
        return $this->hasOne(PermitApproval::class)
                    ->where('stage_order', $this->current_approval_stage);
    }

    public function riskAssessments()
    {
        return $this->hasMany(PermitRiskAssessment::class);
    }

    public function personnel()
    {
        return $this->belongsToMany(Personnel::class, 'permit_personnel')
                    ->withPivot('role_in_permit', 'qualification_verified', 'verification_notes')
                    ->withTimestamps();
    }

    public function equipment()
    {
        return $this->belongsToMany(Equipment::class, 'permit_equipment')
                    ->withPivot('certification_verified', 'verification_notes')
                    ->withTimestamps();
    }

    public function attachments()
    {
        return $this->hasMany(PermitAttachment::class);
    }

    public function extensions()
    {
        return $this->hasMany(PermitExtension::class);
    }

    public function clashesAsA()
    {
        return $this->hasMany(ClashDetection::class, 'permit_a_id');
    }

    public function clashesAsB()
    {
        return $this->hasMany(ClashDetection::class, 'permit_b_id');
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

    public function lotoProcedures()
    {
        return $this->hasMany(LotoProcedure::class);
    }

    public function gasTestLogs()
    {
        return $this->hasMany(GasTestLog::class)->orderBy('tested_at', 'desc');
    }

    public function sosAlerts()
    {
        return $this->hasMany(EmergencySosAlert::class);
    }

    public function geofenceLogs()
    {
        return $this->hasMany(GeofenceLog::class);
    }

    public function jsaRecord()
    {
        return $this->hasOne(JsaRecord::class);
    }

    public function photos()
    {
        return $this->hasMany(PermitPhoto::class);
    }

    public function eSignatures()
    {
        return $this->morphMany(ESignature::class, 'signable');
    }

    public function ppeChecklists()
    {
        return $this->hasMany(PpeChecklist::class);
    }

    public function latestPpeChecklist()
    {
        return $this->hasOne(PpeChecklist::class)->latestOfMany();
    }

    public function transfers()
    {
        return $this->hasMany(PermitTransfer::class);
    }

    public function closureChecklist()
    {
        return $this->hasOne(ClosureChecklist::class);
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['approved', 'active']);
    }

    public function scopeOverlapping($query, $areaId, $start, $end, $excludeId = null)
    {
        return $query->where('work_area_id', $areaId)
                     ->whereNotIn('status', ['cancelled', 'rejected', 'closed', 'completed'])
                     ->where(function ($q) use ($start, $end) {
                         $q->where(function ($inner) use ($start, $end) {
                             $inner->where('planned_start', '<', $end)
                                   ->where('planned_end', '>', $start);
                         });
                     })
                     ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId));
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    // ========================
    // HELPERS
    // ========================

    public static function generatePermitNumber(string $typeCode): string
    {
        $date = now()->format('Ymd');
        $count = static::whereDate('created_at', now()->toDateString())->count() + 1;
        return "PTW-{$typeCode}-{$date}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    public function getAllClashes()
    {
        return ClashDetection::where(function ($q) {
            $q->where('permit_a_id', $this->id)
              ->orWhere('permit_b_id', $this->id);
        })->get();
    }

    public function isExpired(): bool
    {
        return $this->planned_end->isPast() && !in_array($this->status, ['completed', 'closed', 'cancelled']);
    }

    public function getRiskLevel(): string
    {
        $maxScore = $this->riskAssessments()->max('risk_score') ?? 0;
        if ($maxScore >= 20) return 'extreme';
        if ($maxScore >= 12) return 'high';
        if ($maxScore >= 6) return 'medium';
        return 'low';
    }
}
