<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClosureChecklist extends Model
{
    protected $fillable = [
        'work_permit_id', 'completed_by_name', 'completed_by_id',
        'completed_at', 'all_items_checked', 'remarks',
    ];

    protected $casts = [
        'completed_at'      => 'datetime',
        'all_items_checked' => 'boolean',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function completedBy()
    {
        return $this->belongsTo(Personnel::class, 'completed_by_id');
    }

    public function items()
    {
        return $this->hasMany(ClosureChecklistItem::class);
    }
}
