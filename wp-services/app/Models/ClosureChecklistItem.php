<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClosureChecklistItem extends Model
{
    protected $fillable = [
        'closure_checklist_id', 'item_description', 'is_checked',
        'checked_by', 'checked_at', 'remarks',
    ];

    protected $casts = [
        'is_checked' => 'boolean',
        'checked_at' => 'datetime',
    ];

    public function checklist()
    {
        return $this->belongsTo(ClosureChecklist::class, 'closure_checklist_id');
    }
}
