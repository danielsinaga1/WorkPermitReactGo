<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengaduan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kode_pengaduan',
        'user_id',
        'nama_pelapor',
        'email_pelapor',
        'no_telp_pelapor',
        'kategori',
        'judul',
        'deskripsi',
        'lokasi',
        'foto_lampiran',
        'status',
        'tanggapan',
        'ditanggapi_oleh',
        'ditanggapi_at',
    ];

    protected $casts = [
        'foto_lampiran' => 'array',
        'ditanggapi_at' => 'datetime',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function penanggap()
    {
        return $this->belongsTo(User::class, 'ditanggapi_oleh');
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%")
              ->orWhere('kode_pengaduan', 'like', "%{$search}%")
              ->orWhere('nama_pelapor', 'like', "%{$search}%");
        });
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }

    // ========================
    // HELPERS
    // ========================

    public static function generateKode()
    {
        $prefix = 'ADU-' . date('Ym') . '-';
        $last = static::where('kode_pengaduan', 'like', $prefix . '%')
            ->orderBy('kode_pengaduan', 'desc')
            ->first();

        if ($last) {
            $lastNumber = (int) substr($last->kode_pengaduan, -4);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
