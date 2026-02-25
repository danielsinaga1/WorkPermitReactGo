<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organisasi extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nama',
        'singkatan',
        'slug',
        'no_sk',
        'file_sk',
        'tanggal_berdiri',
        'bidang_fokus',
        'alamat_sekretariat',
        'logo',
        'deskripsi',
        'email',
        'no_telp',
        'website',
        'sosial_media',
        'status',
        'admin_id',
        'verified_by',
        'verified_at',
        'catatan_verifikasi',
    ];

    protected $casts = [
        'tanggal_berdiri' => 'date',
        'sosial_media' => 'array',
        'verified_at' => 'datetime',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function pengurus()
    {
        return $this->hasMany(OrgPengurus::class);
    }

    public function kegiatans()
    {
        return $this->hasMany(OrgKegiatan::class);
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
        return $query->where('status', 'pending_verifikasi');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
              ->orWhere('singkatan', 'like', "%{$search}%")
              ->orWhere('bidang_fokus', 'like', "%{$search}%");
        });
    }

    public function scopeByBidang($query, $bidang)
    {
        return $query->where('bidang_fokus', $bidang);
    }

    // ========================
    // HELPERS
    // ========================

    /**
     * Check if OKP is verified/active
     */
    public function isActive(): bool
    {
        return $this->status === 'terverifikasi';
    }

    /**
     * Count kegiatan in current month
     */
    public function kegiatanBulanIni(): int
    {
        return $this->kegiatans()
            ->whereMonth('tanggal_mulai', Carbon::now()->month)
            ->whereYear('tanggal_mulai', Carbon::now()->year)
            ->count();
    }
}
