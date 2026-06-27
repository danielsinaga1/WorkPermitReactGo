<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ToolboxMeeting extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'meeting_number', 'title', 'topic',
        'work_area_id', 'work_permit_id',
        'conducted_by', 'conductor_id',
        'meeting_date', 'duration_minutes',
        'weather_condition', 'briefing_template',
        'key_points', 'hazards_discussed',
        'additional_notes', 'pdf_report_path', 'status',
    ];

    protected $casts = [
        'meeting_date'      => 'datetime',
        'briefing_template' => 'array',
        'key_points'        => 'array',
        'hazards_discussed' => 'array',
    ];

    public function workArea()
    {
        return $this->belongsTo(WorkArea::class);
    }

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function conductor()
    {
        return $this->belongsTo(Personnel::class, 'conductor_id');
    }

    public function attendees()
    {
        return $this->hasMany(ToolboxAttendee::class);
    }

    public function presentAttendees()
    {
        return $this->hasMany(ToolboxAttendee::class)->where('is_present', true);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public static function generateNumber(): string
    {
        $date = now()->format('Ymd');
        $count = static::whereDate('created_at', now()->toDateString())->count() + 1;
        return "TBM-{$date}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
