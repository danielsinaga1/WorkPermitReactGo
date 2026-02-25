<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RealisasiAnggaran extends Model
{
    use HasFactory;

    protected $table = 'realisasi_anggarans';

    protected $fillable = [
        'tahun',
        'program',
        'anggaran',
        'realisasi',
        'persentase'
    ];

    protected $casts = [
        'tahun' => 'integer',
        'anggaran' => 'decimal:2',
        'realisasi' => 'decimal:2',
        'persentase' => 'decimal:2',
    ];

    public function scopeByTahun($query, $tahun)
    {
        return $query->where('tahun', $tahun);
    }
}
