<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingMatrix extends Model
{
    protected $table = 'training_matrices';

    protected $fillable = [
        'role_or_position', 'training_program_id',
        'is_required', 'refresh_months',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function program()
    {
        return $this->belongsTo(TrainingProgram::class, 'training_program_id');
    }
}
