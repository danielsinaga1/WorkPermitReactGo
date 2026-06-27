<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncidentRootCause extends Model
{
    protected $fillable = [
        'incident_id', 'rca_method', 'analysis_data',
        'direct_cause', 'contributing_factors', 'root_cause',
        'systemic_issues', 'analyzed_by', 'analyzed_at', 'status',
    ];

    protected $casts = [
        'analysis_data' => 'array',
        'analyzed_at'   => 'datetime',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class);
    }
}
