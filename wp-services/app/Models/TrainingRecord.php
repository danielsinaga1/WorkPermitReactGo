<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingRecord extends Model
{
    protected $fillable = [
        'training_session_id', 'personnel_id', 'completion_date',
        'expiry_date', 'score', 'result', 'certificate_path',
        'certificate_number', 'remarks',
    ];

    protected $casts = [
        'completion_date' => 'date',
        'expiry_date' => 'date',
        'score' => 'decimal:2',
    ];

    public function session()
    {
        return $this->belongsTo(TrainingSession::class, 'training_session_id');
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }

    public function scopeExpiringSoon($query, int $days = 30)
    {
        return $query->where('result', 'pass')
            ->whereBetween('expiry_date', [now(), now()->addDays($days)]);
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now());
    }
}
