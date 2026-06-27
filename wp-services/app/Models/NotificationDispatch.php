<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationDispatch extends Model
{
    protected $fillable = [
        'event', 'channel', 'recipient', 'recipient_user_id',
        'subject', 'body', 'status', 'attempts',
        'error_message', 'sent_at', 'delivered_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'queued');
    }
}
