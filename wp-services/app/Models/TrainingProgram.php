<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingProgram extends Model
{
    protected $fillable = [
        'code', 'name', 'description', 'category',
        'is_mandatory', 'validity_months', 'duration_hours',
        'target_roles', 'prerequisite_trainings', 'is_active',
    ];

    protected $casts = [
        'target_roles' => 'array',
        'prerequisite_trainings' => 'array',
        'is_mandatory' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function sessions()
    {
        return $this->hasMany(TrainingSession::class);
    }

    public function matrices()
    {
        return $this->hasMany(TrainingMatrix::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
