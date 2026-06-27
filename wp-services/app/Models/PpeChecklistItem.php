<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PpeChecklistItem extends Model
{
    protected $fillable = [
        'ppe_checklist_id', 'ppe_item', 'is_required',
        'is_available', 'is_condition_ok', 'remarks',
    ];

    protected $casts = [
        'is_required'     => 'boolean',
        'is_available'    => 'boolean',
        'is_condition_ok' => 'boolean',
    ];

    public function checklist()
    {
        return $this->belongsTo(PpeChecklist::class, 'ppe_checklist_id');
    }
}
