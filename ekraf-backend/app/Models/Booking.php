<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kode_booking',
        'user_id',
        'fasilitas_id',
        'slot_id',
        'tarif_id',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'tujuan_kegiatan',
        'jumlah_peserta',
        'total_biaya',
        'status',
        'bukti_bayar',
        'payment_method',
        'payment_ref',
        'verified_by',
        'verified_at',
        'catatan_admin',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'total_biaya' => 'float',
        'verified_at' => 'datetime',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fasilitas()
    {
        return $this->belongsTo(Fasilitas::class);
    }

    public function slot()
    {
        return $this->belongsTo(FasilitasSlot::class, 'slot_id');
    }

    public function tarif()
    {
        return $this->belongsTo(FasilitasTarif::class, 'tarif_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function paymentLogs()
    {
        return $this->morphMany(PaymentLog::class, 'payable');
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByFasilitas($query, $fasilitasId)
    {
        return $query->where('fasilitas_id', $fasilitasId);
    }

    public function scopePending($query)
    {
        return $query->whereIn('status', ['menunggu_bayar', 'bukti_dikirim']);
    }

    // ========================
    // HELPERS
    // ========================

    /**
     * Generate unique booking code
     */
    public static function generateKodeBooking(): string
    {
        $date = date('Ymd');
        $lastBooking = self::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastBooking ? ((int) substr($lastBooking->kode_booking, -3)) + 1 : 1;

        return 'BK-' . $date . '-' . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }
}
