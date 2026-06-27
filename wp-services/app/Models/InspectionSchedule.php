<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionSchedule extends Model
{
    protected $fillable = [
        'inspection_template_id', 'title',
        'work_area_id', 'equipment_id', 'assigned_to',
        'scheduled_date', 'scheduled_time',
        'status', 'frequency', 'next_occurrence',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'next_occurrence' => 'date',
    ];

    public function template()
    {
        return $this->belongsTo(InspectionTemplate::class, 'inspection_template_id');
    }

    public function workArea()
    {
        return $this->belongsTo(WorkArea::class);
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function assignee()
    {
        return $this->belongsTo(Personnel::class, 'assigned_to');
    }

    public function result()
    {
        return $this->hasOne(InspectionResult::class);
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'scheduled')
            ->where('scheduled_date', '<', now()->toDateString());
    }
}
