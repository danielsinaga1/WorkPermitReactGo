<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AuditPlan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'audit_number', 'title', 'audit_type', 'scope',
        'work_area_id',
        'planned_start', 'planned_end',
        'lead_auditor_name', 'lead_auditor_id',
        'auditee_list', 'checklist',
        'status',
        'total_findings', 'total_critical', 'total_major', 'total_minor',
        'compliance_score',
        'summary', 'report_path', 'closed_at',
    ];

    protected $casts = [
        'planned_start'    => 'date',
        'planned_end'      => 'date',
        'closed_at'        => 'datetime',
        'auditee_list'     => 'array',
        'checklist'        => 'array',
        'compliance_score' => 'decimal:2',
    ];

    public function workArea()
    {
        return $this->belongsTo(WorkArea::class);
    }

    public function leadAuditor()
    {
        return $this->belongsTo(Personnel::class, 'lead_auditor_id');
    }

    public function findings()
    {
        return $this->hasMany(AuditFinding::class);
    }

    public function scopeOpen($query)
    {
        return $query->whereNotIn('status', ['closed', 'cancelled']);
    }

    public static function generateNumber(): string
    {
        $year = now()->format('Y');
        $count = static::whereYear('created_at', now()->year)->count() + 1;
        return "AUD-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    public function recalculateMetrics(): void
    {
        $findings = $this->findings()->get();
        $this->total_findings = $findings->count();
        $this->total_critical = $findings->where('severity', 'critical')->count();
        $this->total_major    = $findings->where('severity', 'major')->count();
        $this->total_minor    = $findings->where('severity', 'minor')->count();

        // Compliance score: 100 - weighted findings (critical=10, major=5, minor=2, observation=0.5)
        $deduction = ($this->total_critical * 10)
            + ($this->total_major * 5)
            + ($this->total_minor * 2)
            + ($findings->where('severity', 'observation')->count() * 0.5);
        $this->compliance_score = max(0, 100 - $deduction);
        $this->save();
    }
}
