<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ESignature extends Model
{
    protected $table = 'e_signatures';

    protected $fillable = [
        'signable_type', 'signable_id',
        'signer_id', 'signer_name', 'signer_role',
        'signature_image_path', 'signature_hash',
        'signed_at', 'ip_address', 'device_info',
        'gps_latitude', 'gps_longitude',
    ];

    protected $casts = [
        'signed_at'     => 'datetime',
        'gps_latitude'  => 'decimal:7',
        'gps_longitude' => 'decimal:7',
    ];

    public function signable()
    {
        return $this->morphTo();
    }

    public function signer()
    {
        return $this->belongsTo(Personnel::class, 'signer_id');
    }

    /**
     * Verify signature integrity with stored hash.
     */
    public function verifyIntegrity(string $imageData): bool
    {
        return hash('sha256', $imageData) === $this->signature_hash;
    }
}
