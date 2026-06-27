<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionResult extends Model
{
    protected $fillable = [
        'inspection_schedule_id', 'inspector_id',
        'inspected_at', 'overall_result', 'total_items',
        'passed_items', 'failed_items', 'summary',
        'signature_path',
    ];

    protected $casts = [
        'inspected_at' => 'datetime',
    ];

    public function schedule()
    {
        return $this->belongsTo(InspectionSchedule::class, 'inspection_schedule_id');
    }

    public function inspector()
    {
        return $this->belongsTo(Personnel::class, 'inspector_id');
    }

    public function findings()
    {
        return $this->hasMany(InspectionFinding::class);
    }
}
