<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BSharpObservation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'observation_number',
        'observed_at',
        'work_area_id',
        'observer_id', 'observer_name',
        'observed_subject_name',
        'title', 'description',
        'behavior_category', 'behavior_tags',
        'recommended_action',
        'status',
        'followup_pic_name', 'followup_pic_id',
        'followup_plan', 'followup_target_date',
        'followup_completed_at',
        'photos',
    ];

    protected $casts = [
        'observed_at'           => 'datetime',
        'behavior_tags'         => 'array',
        'photos'                => 'array',
        'followup_target_date'  => 'date',
        'followup_completed_at' => 'datetime',
    ];

    public function workArea()
    {
        return $this->belongsTo(WorkArea::class);
    }

    public function observer()
    {
        return $this->belongsTo(Personnel::class, 'observer_id');
    }

    public function followupPic()
    {
        return $this->belongsTo(Personnel::class, 'followup_pic_id');
    }

    public function scopeSafe($query)
    {
        return $query->where('behavior_category', 'safe');
    }

    public function scopeAtRisk($query)
    {
        return $query->where('behavior_category', 'at_risk');
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', ['open', 'follow_up']);
    }

    public static function generateNumber(): string
    {
        $date = now()->format('Y');
        $count = static::whereYear('created_at', now()->year)->count() + 1;
        return "BS-{$date}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
