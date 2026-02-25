<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FasilitasBlackout extends Model
{
    protected $fillable = [
        'fasilitas_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'alasan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function fasilitas()
    {
        return $this->belongsTo(Fasilitas::class);
    }
}
