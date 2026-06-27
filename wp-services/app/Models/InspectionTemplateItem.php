<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionTemplateItem extends Model
{
    protected $fillable = [
        'inspection_template_id', 'item_order', 'item_text',
        'item_type', 'is_critical', 'guidance',
    ];

    protected $casts = [
        'is_critical' => 'boolean',
    ];

    public function template()
    {
        return $this->belongsTo(InspectionTemplate::class, 'inspection_template_id');
    }
}
