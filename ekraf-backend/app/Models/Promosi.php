<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promosi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'promosis';

    protected $fillable = [
        'title',
        'content',
        'date',
        'thumbnail',
        'images',
        'descriptions',
        'is_published'
    ];

    protected $casts = [
        'date' => 'date',
        'images' => 'array',
        'descriptions' => 'array',
        'is_published' => 'boolean',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%");
        });
    }
}
