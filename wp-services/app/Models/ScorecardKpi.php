<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScorecardKpi extends Model
{
    protected $fillable = [
        'scorecard_perspective_id', 'hse_kpi_metric_id',
        'label', 'weight', 'display_order',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
    ];

    public function perspective()
    {
        return $this->belongsTo(ScorecardPerspective::class, 'scorecard_perspective_id');
    }

    public function metric()
    {
        return $this->belongsTo(HseKpiMetric::class, 'hse_kpi_metric_id');
    }
}
