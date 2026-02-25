<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PelakuEkraf extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'nama',
        'slug',
        'nik',
        'nama_usaha',
        'subsektor_id',
        'deskripsi_usaha',
        'alamat',
        'kelurahan',
        'kecamatan',
        'latitude',
        'longitude',
        'no_telp',
        'email',
        'website',
        'sosial_media',
        'foto',
        'logo_usaha',
        'tahun_mulai',
        'jumlah_karyawan',
        'skala_usaha',
        'omzet_tahunan',
        'status',
        'verified_by',
        'verified_at',
        'catatan_verifikasi',
    ];

    protected $casts = [
        'sosial_media' => 'array',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'omzet_tahunan' => 'decimal:2',
        'verified_at' => 'datetime',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subsektor()
    {
        return $this->belongsTo(Subsektor::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function hakis()
    {
        return $this->hasMany(Haki::class, 'pelaku_ekraf_id');
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeTerverifikasi($query)
    {
        return $query->where('status', 'terverifikasi');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
              ->orWhere('nama_usaha', 'like', "%{$search}%")
              ->orWhere('deskripsi_usaha', 'like', "%{$search}%");
        });
    }
}
