<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Haki extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'pelaku_ekraf_id',
        'nama_produk',
        'slug',
        'jenis_haki',
        'nomor_permohonan',
        'nomor_sertifikat',
        'tanggal_permohonan',
        'tanggal_terbit',
        'file_sertifikat',
        'file_permohonan',
        'deskripsi',
        'status',
        'catatan',
    ];

    protected $casts = [
        'tanggal_permohonan' => 'date',
        'tanggal_terbit' => 'date',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pelakuEkraf()
    {
        return $this->belongsTo(PelakuEkraf::class);
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama_produk', 'like', "%{$search}%")
              ->orWhere('nomor_permohonan', 'like', "%{$search}%")
              ->orWhere('nomor_sertifikat', 'like', "%{$search}%");
        });
    }

    public function scopeByJenis($query, $jenis)
    {
        return $query->where('jenis_haki', $jenis);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
