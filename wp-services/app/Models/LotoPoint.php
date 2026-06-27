<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LotoPoint extends Model
{
    protected $fillable = [
        'loto_procedure_id', 'sequence_order', 'point_name',
        'energy_type', 'location_description',
        'isolation_device', 'isolation_method',
        'verification_method', 'qr_code', 'nfc_tag_id',
        'photo_path', 'requires_double_isolation',
    ];

    protected $casts = [
        'requires_double_isolation' => 'boolean',
    ];

    public function procedure()
    {
        return $this->belongsTo(LotoProcedure::class, 'loto_procedure_id');
    }

    public function locks()
    {
        return $this->hasMany(LotoLock::class);
    }

    public function activeLock()
    {
        return $this->hasOne(LotoLock::class)->where('status', 'locked');
    }

    public function verifications()
    {
        return $this->hasMany(LotoVerification::class);
    }

    public function isLocked(): bool
    {
        return $this->locks()->where('status', 'locked')->exists();
    }
}
