<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailNotification extends Model
{
    protected $fillable = [
        'recipient_email', 'recipient_name', 'subject', 'body',
        'template', 'template_data', 'status', 'error_message', 'sent_at',
    ];

    protected $casts = [
        'template_data' => 'array',
        'sent_at'       => 'datetime',
    ];

    public function scopeQueued($query)
    {
        return $query->where('status', 'queued');
    }
}
