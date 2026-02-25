<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Fasilitas extends Model
{
    use SoftDeletes;

    protected $table = 'fasilitas';

    protected $fillable = [
        'nama',
        'slug',
        'jenis',
        'deskripsi',
        'alamat',
        'latitude',
        'longitude',
        'kapasitas',
        'thumbnail',
        'images',
        'fasilitas_detail',
        'pengelola_id',
        'is_active',
    ];

    protected $casts = [
        'images' => 'array',
        'fasilitas_detail' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
        'is_active' => 'boolean',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function pengelola()
    {
        return $this->belongsTo(User::class, 'pengelola_id');
    }

    public function tarifs()
    {
        return $this->hasMany(FasilitasTarif::class);
    }

    public function slots()
    {
        return $this->hasMany(FasilitasSlot::class);
    }

    public function blackouts()
    {
        return $this->hasMany(FasilitasBlackout::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByJenis($query, $jenis)
    {
        return $query->where('jenis', $jenis);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
              ->orWhere('alamat', 'like', "%{$search}%")
              ->orWhere('deskripsi', 'like', "%{$search}%");
        });
    }
}
