<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Berita extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'beritas';

    protected $fillable = [
        'title',
        'content',
        'date',
        'thumbnail',
        'images',
        'descriptions',
        'is_published',
        'author_id'
    ];

    protected $casts = [
        'date' => 'date',
        'images' => 'array',
        'descriptions' => 'array',
        'is_published' => 'boolean',
    ];

    /**
     * Get the author of the berita.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scope a query to only include published beritas.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to search beritas.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%");
        });
    }
}
