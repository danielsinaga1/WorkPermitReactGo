<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LessonLearned extends Model
{
    use SoftDeletes;

    protected $table = 'lessons_learned';

    protected $fillable = [
        'incident_id', 'title', 'summary', 'root_cause_summary',
        'preventive_measures', 'applicable_permit_types',
        'applicable_work_areas', 'severity_level',
        'is_mandatory_reading', 'is_active', 'created_by',
    ];

    protected $casts = [
        'applicable_permit_types' => 'array',
        'applicable_work_areas'   => 'array',
        'is_mandatory_reading'    => 'boolean',
        'is_active'               => 'boolean',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class);
    }

    public function acknowledgements()
    {
        return $this->hasMany(LessonAcknowledgement::class, 'lesson_id');
    }

    /**
     * Get mandatory lessons for a given permit type code (e.g. 'HOT_WORK').
     */
    public static function getMandatoryForPermitType(string $permitTypeCode)
    {
        return static::where('is_active', true)
            ->where('is_mandatory_reading', true)
            ->where(function ($q) use ($permitTypeCode) {
                $q->whereJsonContains('applicable_permit_types', $permitTypeCode)
                  ->orWhereNull('applicable_permit_types');
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
