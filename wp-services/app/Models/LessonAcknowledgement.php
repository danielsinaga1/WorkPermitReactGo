<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonAcknowledgement extends Model
{
    protected $table = 'lesson_acknowledgements';

    protected $fillable = [
        'lesson_id', 'personnel_id', 'work_permit_id', 'acknowledged_at',
    ];

    protected $casts = [
        'acknowledged_at' => 'datetime',
    ];

    public function lesson()
    {
        return $this->belongsTo(LessonLearned::class, 'lesson_id');
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }
}
