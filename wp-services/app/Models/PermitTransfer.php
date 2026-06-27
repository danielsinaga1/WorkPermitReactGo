<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitTransfer extends Model
{
    protected $fillable = [
        'work_permit_id', 'from_personnel_id', 'to_personnel_id',
        'from_role', 'to_role', 'reason', 'status',
        'requested_by', 'approved_by', 'approved_at', 'approval_remarks',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function fromPersonnel()
    {
        return $this->belongsTo(Personnel::class, 'from_personnel_id');
    }

    public function toPersonnel()
    {
        return $this->belongsTo(Personnel::class, 'to_personnel_id');
    }
}
