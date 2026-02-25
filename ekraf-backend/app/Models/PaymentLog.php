<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentLog extends Model
{
    protected $fillable = [
        'payable_type',
        'payable_id',
        'user_id',
        'amount',
        'method',
        'reference',
        'status',
        'gateway_response',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'gateway_response' => 'array',
        'paid_at' => 'datetime',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    /**
     * Get the parent payable model (Booking or TiketWisata)
     */
    public function payable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeSuccess($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByDateRange($query, $start, $end)
    {
        return $query->whereBetween('paid_at', [$start, $end]);
    }
}
