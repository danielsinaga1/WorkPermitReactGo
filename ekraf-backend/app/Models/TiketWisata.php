<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TiketWisata extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kode_tiket',
        'user_id',
        'destinasi_id',
        'tanggal_kunjungan',
        'jumlah_tiket',
        'harga_satuan',
        'total_harga',
        'status',
        'payment_method',
        'payment_ref',
        'qr_code',
        'used_at',
    ];

    protected $casts = [
        'tanggal_kunjungan' => 'date',
        'harga_satuan' => 'float',
        'total_harga' => 'float',
        'used_at' => 'datetime',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function destinasi()
    {
        return $this->belongsTo(DestinasiWisata::class, 'destinasi_id');
    }

    public function paymentLogs()
    {
        return $this->morphMany(PaymentLog::class, 'payable');
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['dibayar', 'menunggu_bayar']);
    }

    // ========================
    // HELPERS
    // ========================

    public static function generateKodeTiket(): string
    {
        $date = date('Ymd');
        $lastTiket = self::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastTiket ? ((int) substr($lastTiket->kode_tiket, -3)) + 1 : 1;

        return 'TK-' . $date . '-' . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }
}
