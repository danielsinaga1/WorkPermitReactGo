<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingSession extends Model
{
    protected $fillable = [
        'training_program_id', 'session_code', 'scheduled_start',
        'scheduled_end', 'venue', 'trainer_name', 'trainer_company',
        'max_participants', 'status', 'notes',
    ];

    protected $casts = [
        'scheduled_start' => 'datetime',
        'scheduled_end' => 'datetime',
    ];

    public function program()
    {
        return $this->belongsTo(TrainingProgram::class, 'training_program_id');
    }

    public function records()
    {
        return $this->hasMany(TrainingRecord::class);
    }
}
