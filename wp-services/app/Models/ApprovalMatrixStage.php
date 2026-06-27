<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApprovalMatrixStage extends Model
{
    protected $fillable = [
        'approval_matrix_id', 'stage_order', 'stage_name', 'stage_type',
        'approver_role', 'default_approver_id', 'sla_hours',
        'can_delegate', 'escalation_enabled', 'escalation_after_hours',
        'escalation_role', 'conditions',
    ];

    protected $casts = [
        'conditions' => 'array',
        'can_delegate' => 'boolean',
        'escalation_enabled' => 'boolean',
    ];

    public function matrix()
    {
        return $this->belongsTo(ApprovalMatrix::class, 'approval_matrix_id');
    }

    public function defaultApprover()
    {
        return $this->belongsTo(Personnel::class, 'default_approver_id');
    }
}
