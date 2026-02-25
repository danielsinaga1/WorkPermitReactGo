<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Turnamen extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'cabang_olahraga',
        'tanggal_mulai',
        'tanggal_selesai',
        'lokasi',
        'kuota_peserta',
        'peserta_count',
        'penyelenggara',
        'kontak',
        'thumbnail',
        'images',
        'batas_pendaftaran',
        'link_pendaftaran',
        'is_published',
        'status',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'batas_pendaftaran' => 'date',
        'images' => 'array',
        'is_published' => 'boolean',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function peserta()
    {
        return $this->hasMany(PesertaTurnamen::class);
    }

    // ========================
    // SCOPES
    // ========================

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByCabang($query, $cabang)
    {
        return $query->where('cabang_olahraga', $cabang);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
              ->orWhere('deskripsi', 'like', "%{$search}%")
              ->orWhere('cabang_olahraga', 'like', "%{$search}%");
        });
    }

    public function scopeUpcoming($query)
    {
        return $query->where('tanggal_mulai', '>=', now()->toDateString());
    }
}
