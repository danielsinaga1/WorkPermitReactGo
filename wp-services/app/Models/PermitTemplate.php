<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitTemplate extends Model
{
    protected $fillable = [
        'code', 'name', 'description', 'permit_type_id',
        'default_work_area_id', 'default_safety_precautions',
        'default_ppe_requirements', 'default_hazards',
        'default_duration_hours', 'default_personnel_roles',
        'default_equipment_types', 'is_active',
        'usage_count', 'created_by',
    ];

    protected $casts = [
        'default_safety_precautions' => 'array',
        'default_ppe_requirements' => 'array',
        'default_hazards' => 'array',
        'default_personnel_roles' => 'array',
        'default_equipment_types' => 'array',
        'is_active' => 'boolean',
    ];

    public function permitType()
    {
        return $this->belongsTo(PermitType::class);
    }

    public function workArea()
    {
        return $this->belongsTo(WorkArea::class, 'default_work_area_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }
}
