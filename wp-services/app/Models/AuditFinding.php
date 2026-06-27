<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditFinding extends Model
{
    protected $fillable = [
        'audit_plan_id', 'finding_number',
        'severity', 'clause_reference',
        'title', 'description', 'evidence',
        'responsible_pic_name', 'responsible_pic_id',
        'target_close_date',
        'status', 'corrective_action',
        'closed_at', 'photos',
    ];

    protected $casts = [
        'target_close_date' => 'date',
        'closed_at'         => 'datetime',
        'photos'            => 'array',
    ];

    public function auditPlan()
    {
        return $this->belongsTo(AuditPlan::class);
    }

    public function responsiblePic()
    {
        return $this->belongsTo(Personnel::class, 'responsible_pic_id');
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['open', 'in_progress']);
    }

    public function scopeOverdue($query)
    {
        return $query->whereIn('status', ['open', 'in_progress'])
            ->where('target_close_date', '<', now()->toDateString());
    }
}
