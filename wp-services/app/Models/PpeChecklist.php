<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PpeChecklist extends Model
{
    protected $fillable = [
        'work_permit_id', 'checked_by_name', 'checked_by_id',
        'checked_at', 'is_compliant', 'remarks',
    ];

    protected $casts = [
        'checked_at'   => 'datetime',
        'is_compliant' => 'boolean',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function checkedBy()
    {
        return $this->belongsTo(Personnel::class, 'checked_by_id');
    }

    public function items()
    {
        return $this->hasMany(PpeChecklistItem::class);
    }
}
