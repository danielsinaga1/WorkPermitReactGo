<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HseKpiRecord extends Model
{
    protected $fillable = [
        'hse_kpi_metric_id', 'period_start', 'period_end',
        'value', 'target_value', 'breakdown',
        'remarks', 'calculated_by', 'calculated_at',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'value' => 'decimal:6',
        'target_value' => 'decimal:6',
        'breakdown' => 'array',
        'calculated_at' => 'datetime',
    ];

    public function metric()
    {
        return $this->belongsTo(HseKpiMetric::class, 'hse_kpi_metric_id');
    }
}
