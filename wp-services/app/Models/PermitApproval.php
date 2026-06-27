<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitApproval extends Model
{
    protected $fillable = [
        'work_permit_id', 'stage_order', 'stage_name', 'stage_type',
        'approver_role', 'approver_id', 'approver_name',
        'decision', 'remarks', 'conditions',
        'signature_path', 'decided_at', 'deadline_at',
    ];

    protected $casts = [
        'conditions' => 'array',
        'decided_at' => 'datetime',
        'deadline_at' => 'datetime',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function approver()
    {
        return $this->belongsTo(Personnel::class, 'approver_id');
    }

    public function scopePending($query)
    {
        return $query->where('decision', 'pending');
    }
}
