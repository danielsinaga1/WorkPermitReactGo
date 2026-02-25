<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RagamEkraf extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ragam_ekrafs';

    protected $fillable = [
        'title',
        'content',
        'date',
        'thumbnail',
        'images',
        'descriptions',
        'subsektor_id',
        'is_published'
    ];

    protected $casts = [
        'date' => 'date',
        'images' => 'array',
        'descriptions' => 'array',
        'is_published' => 'boolean',
    ];

    /**
     * Get the subsektor that owns the ragam ekraf.
     */
    public function subsektor()
    {
        return $this->belongsTo(Subsektor::class, 'subsektor_id');
    }

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
