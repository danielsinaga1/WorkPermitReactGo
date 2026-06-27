<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApprovalDelegation extends Model
{
    protected $fillable = [
        'delegator_id', 'delegatee_id', 'start_date',
        'end_date', 'reason', 'is_active',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function delegator()
    {
        return $this->belongsTo(Personnel::class, 'delegator_id');
    }

    public function delegatee()
    {
        return $this->belongsTo(Personnel::class, 'delegatee_id');
    }

    public static function findActiveDelegate(int $delegatorId): ?Personnel
    {
        $now = now();
        $delegation = self::where('delegator_id', $delegatorId)
            ->where('is_active', true)
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->latest()
            ->first();

        return $delegation?->delegatee;
    }
}
