<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DestinasiWisata extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'alamat',
        'latitude',
        'longitude',
        'kategori',
        'thumbnail',
        'images',
        'virtual_tour_url',
        'jam_buka',
        'jam_tutup',
        'hari_operasional',
        'harga_tiket',
        'harga_tiket_asing',
        'fasilitas_wisata',
        'kontak',
        'website',
        'is_ticketed',
        'is_active',
        'total_pengunjung',
    ];

    protected $casts = [
        'images' => 'array',
        'hari_operasional' => 'array',
        'fasilitas_wisata' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
        'harga_tiket' => 'float',
        'harga_tiket_asing' => 'float',
        'is_ticketed' => 'boolean',
        'is_active' => 'boolean',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function tikets()
    {
        return $this->hasMany(TiketWisata::class, 'destinasi_id');
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
              ->orWhere('alamat', 'like', "%{$search}%")
              ->orWhere('deskripsi', 'like', "%{$search}%");
        });
    }

    public function scopeTicketed($query)
    {
        return $query->where('is_ticketed', true);
    }
}
