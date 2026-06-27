<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionFinding extends Model
{
    protected $fillable = [
        'inspection_result_id', 'inspection_template_item_id',
        'item_text', 'status', 'severity', 'remarks',
        'photo_path', 'corrective_action_id',
    ];

    public function result()
    {
        return $this->belongsTo(InspectionResult::class, 'inspection_result_id');
    }

    public function correctiveAction()
    {
        return $this->belongsTo(CorrectiveAction::class);
    }
}
