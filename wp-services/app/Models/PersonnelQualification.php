<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonnelQualification extends Model
{
    protected $fillable = [
        'personnel_id', 'qualification_type', 'certificate_number',
        'issuing_body', 'issued_date', 'expiry_date',
        'document_path', 'status',
    ];

    protected $casts = [
        'issued_date' => 'date',
        'expiry_date' => 'date',
    ];

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }

    public function scopeValid($query)
    {
        return $query->where('status', 'valid')->where('expiry_date', '>=', now());
    }

    public function scopeExpiringSoon($query, $days = 30)
    {
        return $query->where('status', 'valid')
                     ->whereBetween('expiry_date', [now(), now()->addDays($days)]);
    }

    public function isExpired(): bool
    {
        return $this->expiry_date->isPast();
    }
}
