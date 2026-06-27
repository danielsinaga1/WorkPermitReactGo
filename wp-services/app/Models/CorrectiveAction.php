<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CorrectiveAction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'action_number', 'actionable_type', 'actionable_id',
        'description', 'priority',
        'assigned_to_name', 'assigned_to_id',
        'assigned_by_name', 'due_date', 'completed_date',
        'status', 'completion_notes', 'evidence_path',
        'verified_by_name', 'verified_at',
    ];

    protected $casts = [
        'due_date'       => 'date',
        'completed_date' => 'date',
        'verified_at'    => 'datetime',
    ];

    public function actionable()
    {
        return $this->morphTo();
    }

    public function assignee()
    {
        return $this->belongsTo(Personnel::class, 'assigned_to_id');
    }

    public function scopeOpen($query)
    {
        return $query->whereNotIn('status', ['completed', 'verified', 'cancelled']);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                     ->whereNotIn('status', ['completed', 'verified', 'cancelled']);
    }

    public static function generateNumber(): string
    {
        $date = now()->format('Ymd');
        $count = static::whereDate('created_at', now()->toDateString())->count() + 1;
        return "CA-{$date}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
