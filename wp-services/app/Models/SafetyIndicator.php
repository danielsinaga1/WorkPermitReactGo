<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SafetyIndicator extends Model
{
    protected $fillable = [
        'indicator_code', 'name', 'type', 'category',
        'description', 'unit', 'target_value',
        'threshold_warning', 'threshold_critical',
        'calculation_formula', 'data_sources', 'is_active',
    ];

    protected $casts = [
        'target_value'       => 'float',
        'threshold_warning'  => 'float',
        'threshold_critical' => 'float',
        'data_sources'       => 'array',
        'is_active'          => 'boolean',
    ];

    public function scopeLeading($query)
    {
        return $query->where('type', 'leading');
    }

    public function scopeLagging($query)
    {
        return $query->where('type', 'lagging');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
