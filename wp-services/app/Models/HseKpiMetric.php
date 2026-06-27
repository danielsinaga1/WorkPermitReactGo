<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HseKpiMetric extends Model
{
    protected $fillable = [
        'metric_code', 'metric_name', 'description', 'formula',
        'unit', 'target_value', 'target_period',
        'lower_is_better', 'is_active',
    ];

    protected $casts = [
        'target_value' => 'decimal:4',
        'lower_is_better' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function records()
    {
        return $this->hasMany(HseKpiRecord::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
