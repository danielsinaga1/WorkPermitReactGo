<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractorCompany extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'registration_number', 'contact_person',
        'phone', 'email', 'address',
        'hse_certificate_expiry', 'hse_certificate_path',
        'safety_score', 'total_violations', 'total_incidents',
        'compliance_status', 'is_active',
    ];

    protected $casts = [
        'hse_certificate_expiry' => 'date',
        'safety_score'           => 'decimal:2',
        'is_active'              => 'boolean',
    ];

    public function scopeCompliant($query)
    {
        return $query->where('compliance_status', 'compliant');
    }

    public function scopeNonCompliant($query)
    {
        return $query->whereIn('compliance_status', ['non_compliant', 'blacklisted']);
    }

    /**
     * Check if HSE certificate is still valid.
     */
    public function hasValidCertificate(): bool
    {
        return $this->hse_certificate_expiry && $this->hse_certificate_expiry->isFuture();
    }
}
