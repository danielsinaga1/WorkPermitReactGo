<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Atlet extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nama',
        'slug',
        'nik',
        'tanggal_lahir',
        'jenis_kelamin',
        'cabang_olahraga',
        'klub',
        'foto',
        'alamat',
        'no_telp',
        'prestasi',
        'status',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'prestasi' => 'array',
    ];

    // ========================
    // SCOPES
    // ========================

    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeByCabang($query, $cabang)
    {
        return $query->where('cabang_olahraga', $cabang);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
              ->orWhere('cabang_olahraga', 'like', "%{$search}%")
              ->orWhere('klub', 'like', "%{$search}%");
        });
    }
}
