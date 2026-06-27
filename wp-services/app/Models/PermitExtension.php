<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitExtension extends Model
{
    protected $fillable = [
        'work_permit_id', 'original_end', 'extended_end',
        'reason', 'status', 'requested_by', 'approved_by', 'decided_at',
    ];

    protected $casts = [
        'original_end' => 'datetime',
        'extended_end' => 'datetime',
        'decided_at'   => 'datetime',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }
}
