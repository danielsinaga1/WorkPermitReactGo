<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KatalogProduk extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nama_produk',
        'slug',
        'deskripsi',
        'harga_mulai',
        'harga_sampai',
        'kategori',
        'subsektor_id',
        'pemilik_id',
        'nama_usaha',
        'thumbnail',
        'images',
        'kontak',
        'whatsapp',
        'alamat',
        'latitude',
        'longitude',
        'is_verified',
        'is_active',
    ];

    protected $casts = [
        'images' => 'array',
        'harga_mulai' => 'float',
        'harga_sampai' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function subsektor()
    {
        return $this->belongsTo(Subsektor::class);
    }

    public function pemilik()
    {
        return $this->belongsTo(User::class, 'pemilik_id');
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeByKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }

    public function scopeBySubsektor($query, $subsektorId)
    {
        return $query->where('subsektor_id', $subsektorId);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama_produk', 'like', "%{$search}%")
              ->orWhere('nama_usaha', 'like', "%{$search}%")
              ->orWhere('deskripsi', 'like', "%{$search}%");
        });
    }
}
