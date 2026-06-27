<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LotoLock extends Model
{
    protected $fillable = [
        'loto_procedure_id', 'loto_point_id', 'work_permit_id',
        'lock_number', 'tag_number',
        'locked_by_id', 'locked_by_name', 'locked_at',
        'unlocked_at', 'unlocked_by_name', 'unlocked_by_id',
        'status', 'force_remove_reason', 'force_remove_authorized_by',
    ];

    protected $casts = [
        'locked_at'   => 'datetime',
        'unlocked_at' => 'datetime',
    ];

    public function procedure()
    {
        return $this->belongsTo(LotoProcedure::class, 'loto_procedure_id');
    }

    public function point()
    {
        return $this->belongsTo(LotoPoint::class, 'loto_point_id');
    }

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function lockedBy()
    {
        return $this->belongsTo(Personnel::class, 'locked_by_id');
    }

    public function unlockedBy()
    {
        return $this->belongsTo(Personnel::class, 'unlocked_by_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'locked');
    }
}
