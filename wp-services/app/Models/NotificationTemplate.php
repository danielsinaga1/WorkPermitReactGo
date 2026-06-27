<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{
    protected $fillable = [
        'code', 'name', 'event', 'channels',
        'subject_template', 'body_template', 'variables', 'is_active',
    ];

    protected $casts = [
        'channels' => 'array',
        'variables' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public static function forEvent(string $event): ?self
    {
        return self::active()->where('event', $event)->first();
    }
}
