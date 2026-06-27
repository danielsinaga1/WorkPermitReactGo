<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitRiskAssessment extends Model
{
    protected $fillable = [
        'work_permit_id', 'hazard_description', 'hazard_category',
        'likelihood', 'severity', 'risk_level',
        'control_measures', 'residual_risk',
        'assessed_by', 'assessed_at',
    ];

    protected $casts = [
        'assessed_at' => 'datetime',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function getRiskScoreAttribute(): int
    {
        return $this->likelihood * $this->severity;
    }

    public static function calculateRiskLevel(int $likelihood, int $severity): string
    {
        $score = $likelihood * $severity;
        if ($score >= 20) return 'extreme';
        if ($score >= 12) return 'high';
        if ($score >= 6) return 'medium';
        return 'low';
    }
}
