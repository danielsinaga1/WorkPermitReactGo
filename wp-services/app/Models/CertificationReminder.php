<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CertificationReminder extends Model
{
    protected $fillable = [
        'source_type', 'source_id', 'personnel_id',
        'expiry_date', 'days_before', 'notify_at',
        'is_sent', 'sent_at', 'channel',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'notify_at' => 'datetime',
        'sent_at' => 'datetime',
        'is_sent' => 'boolean',
    ];

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }

    public function scopeDue($query)
    {
        return $query->where('is_sent', false)
            ->where('notify_at', '<=', now());
    }
}
