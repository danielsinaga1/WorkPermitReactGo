<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'personnel_id', 'type', 'title', 'body',
        'data', 'channel', 'is_read', 'read_at',
    ];

    protected $casts = [
        'data'    => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Create and dispatch a notification.
     */
    public static function dispatch(
        string $type,
        string $title,
        string $body,
        ?int $userId = null,
        ?int $personnelId = null,
        array $data = [],
        string $channel = 'in_app'
    ): self {
        return static::create([
            'user_id'      => $userId,
            'personnel_id' => $personnelId,
            'type'         => $type,
            'title'        => $title,
            'body'         => $body,
            'data'         => $data,
            'channel'      => $channel,
        ]);
    }
}
