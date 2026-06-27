<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use SoftDeletes;

    protected $table = 'equipment';

    protected $fillable = [
        'equipment_id', 'name', 'type', 'brand', 'model',
        'serial_number', 'owner_company', 'qr_code', 'nfc_tag_id',
        'last_inspection_date', 'next_inspection_date',
        'condition', 'is_active',
    ];

    protected $casts = [
        'last_inspection_date' => 'date',
        'next_inspection_date' => 'date',
        'is_active'            => 'boolean',
    ];

    public function certifications()
    {
        return $this->hasMany(EquipmentCertification::class);
    }

    public function validCertifications()
    {
        return $this->hasMany(EquipmentCertification::class)
                    ->where('status', 'valid')
                    ->where('expiry_date', '>=', now());
    }

    public function workPermits()
    {
        return $this->belongsToMany(WorkPermit::class, 'permit_equipment')
                    ->withPivot('certification_verified', 'verification_notes')
                    ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeNeedInspection($query)
    {
        return $query->where('next_inspection_date', '<=', now());
    }

    public function hasValidCertification(string $certType): bool
    {
        return $this->certifications()
                    ->where('certification_type', $certType)
                    ->where('status', 'valid')
                    ->where('expiry_date', '>=', now())
                    ->exists();
    }
}
