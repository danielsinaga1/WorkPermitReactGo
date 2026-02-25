<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class YouthOpportunity extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'judul',
        'slug',
        'deskripsi',
        'jenis',
        'penyelenggara',
        'lokasi',
        'batas_pendaftaran',
        'link_pendaftaran',
        'kontak',
        'thumbnail',
        'persyaratan',
        'gaji_min',
        'gaji_max',
        'is_published',
    ];

    protected $casts = [
        'persyaratan' => 'array',
        'batas_pendaftaran' => 'date',
        'gaji_min' => 'decimal:2',
        'gaji_max' => 'decimal:2',
        'is_published' => 'boolean',
    ];

    // ========================
    // SCOPES
    // ========================

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByJenis($query, $jenis)
    {
        return $query->where('jenis', $jenis);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%")
              ->orWhere('deskripsi', 'like', "%{$search}%")
              ->orWhere('penyelenggara', 'like', "%{$search}%");
        });
    }

    public function scopeActive($query)
    {
        return $query->published()
            ->where(function ($q) {
                $q->whereNull('batas_pendaftaran')
                  ->orWhere('batas_pendaftaran', '>=', now()->toDateString());
            });
    }
}
