<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrgLaporan extends Model
{
    protected $fillable = [
        'kegiatan_id',
        'file_laporan',
        'deskripsi',
        'foto_kegiatan',
        'jumlah_peserta',
        'hasil_kegiatan',
        'kendala',
        'status',
        'reviewed_by',
        'reviewed_at',
        'catatan_review',
    ];

    protected $casts = [
        'foto_kegiatan' => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function kegiatan()
    {
        return $this->belongsTo(OrgKegiatan::class, 'kegiatan_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
