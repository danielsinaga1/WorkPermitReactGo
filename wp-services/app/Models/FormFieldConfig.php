<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormFieldConfig extends Model
{
    protected $fillable = [
        'permit_type_id', 'section', 'field_name', 'field_label',
        'field_type', 'options', 'is_mandatory', 'is_active',
        'sort_order', 'instruction', 'tooltip',
    ];

    protected $casts = [
        'options'      => 'array',
        'is_mandatory' => 'boolean',
        'is_active'    => 'boolean',
    ];

    public function permitType()
    {
        return $this->belongsTo(PermitType::class);
    }

    public function scopeForSection($query, $section)
    {
        return $query->where('section', $section)->where('is_active', true)->orderBy('sort_order');
    }
}
