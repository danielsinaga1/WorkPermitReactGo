<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FasilitasSlot extends Model
{
    protected $fillable = [
        'fasilitas_id',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'status',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function fasilitas()
    {
        return $this->belongsTo(Fasilitas::class);
    }

    public function booking()
    {
        return $this->hasOne(Booking::class, 'slot_id');
    }

    public function scopeTersedia($query)
    {
        return $query->where('status', 'tersedia');
    }

    public function scopeByTanggal($query, $tanggal)
    {
        return $query->where('tanggal', $tanggal);
    }

    public function scopeByDateRange($query, $start, $end)
    {
        return $query->whereBetween('tanggal', [$start, $end]);
    }
}
