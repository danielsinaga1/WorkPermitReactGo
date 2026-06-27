<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SafetyManhoursLog extends Model
{
    protected $fillable = [
        'log_date', 'site', 'contractor',
        'total_personnel', 'total_hours',
        'incident_free', 'notes',
    ];

    protected $casts = [
        'log_date' => 'date',
        'total_hours' => 'decimal:2',
        'incident_free' => 'boolean',
    ];
}
