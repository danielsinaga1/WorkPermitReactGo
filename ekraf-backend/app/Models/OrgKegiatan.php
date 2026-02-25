<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrgKegiatan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organisasi_id',
        'judul',
        'deskripsi',
        'tanggal_mulai',
        'tanggal_selesai',
        'lokasi',
        'jenis',
        'peserta_target',
        'thumbnail',
        'images',
        'status',
        'is_published',
    ];

    protected $casts = [
        'tanggal_mulai' => 'datetime',
        'tanggal_selesai' => 'datetime',
        'images' => 'array',
        'is_published' => 'boolean',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function organisasi()
    {
        return $this->belongsTo(Organisasi::class);
    }

    public function laporan()
    {
        return $this->hasOne(OrgLaporan::class, 'kegiatan_id');
    }

    // ========================
    // SCOPES
    // ========================

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('tanggal_mulai', '>=', Carbon::now());
    }

    public function scopeByOrganisasi($query, $organisasiId)
    {
        return $query->where('organisasi_id', $organisasiId);
    }

    public function scopeByJenis($query, $jenis)
    {
        return $query->where('jenis', $jenis);
    }

    public function scopeBulanIni($query)
    {
        return $query->whereMonth('tanggal_mulai', Carbon::now()->month)
                     ->whereYear('tanggal_mulai', Carbon::now()->year);
    }
}
