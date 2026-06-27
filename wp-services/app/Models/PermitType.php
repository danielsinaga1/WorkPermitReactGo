<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitType extends Model
{
    protected $fillable = [
        'code', 'name', 'description',
        'required_qualifications', 'required_equipment_certs',
        'risk_checklist_template', 'workflow_stages',
        'max_duration_hours', 'color_code', 'icon', 'is_active',
    ];

    protected $casts = [
        'required_qualifications'  => 'array',
        'required_equipment_certs' => 'array',
        'risk_checklist_template'  => 'array',
        'workflow_stages'          => 'array',
        'is_active'                => 'boolean',
    ];

    public function workPermits()
    {
        return $this->hasMany(WorkPermit::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
