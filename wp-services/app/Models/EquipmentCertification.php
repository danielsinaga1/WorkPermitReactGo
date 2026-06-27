<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentCertification extends Model
{
    protected $fillable = [
        'equipment_id', 'certification_type', 'certificate_number',
        'issuing_body', 'issued_date', 'expiry_date',
        'document_path', 'status',
    ];

    protected $casts = [
        'issued_date' => 'date',
        'expiry_date' => 'date',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function scopeValid($query)
    {
        return $query->where('status', 'valid')->where('expiry_date', '>=', now());
    }
}
