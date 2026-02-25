<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FasilitasTarif extends Model
{
    protected $fillable = [
        'fasilitas_id',
        'nama_tarif',
        'harga',
        'satuan',
        'keterangan',
        'is_active',
    ];

    protected $casts = [
        'harga' => 'float',
        'is_active' => 'boolean',
    ];

    public function fasilitas()
    {
        return $this->belongsTo(Fasilitas::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
