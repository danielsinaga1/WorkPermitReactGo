<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Personnel extends Model
{
    use SoftDeletes;

    protected $table = 'personnel';

    protected $fillable = [
        'employee_id', 'name', 'email', 'phone',
        'company', 'department', 'position',
        'photo', 'qr_code', 'nfc_tag_id', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function qualifications()
    {
        return $this->hasMany(PersonnelQualification::class);
    }

    public function validQualifications()
    {
        return $this->hasMany(PersonnelQualification::class)
                    ->where('status', 'valid')
                    ->where('expiry_date', '>=', now());
    }

    public function workPermits()
    {
        return $this->belongsToMany(WorkPermit::class, 'permit_personnel')
                    ->withPivot('role_in_permit', 'qualification_verified', 'verification_notes')
                    ->withTimestamps();
    }

    public function requestedPermits()
    {
        return $this->hasMany(WorkPermit::class, 'requested_by');
    }

    public function lotoLocks()
    {
        return $this->hasMany(LotoLock::class, 'locked_by_id');
    }

    // ========================
    // SCOPES
    // ========================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCompany($query, $company)
    {
        return $query->where('company', $company);
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('employee_id', 'like', "%{$term}%")
              ->orWhere('company', 'like', "%{$term}%");
        });
    }

    // ========================
    // HELPERS
    // ========================

    public function hasValidQualification(string $qualificationType): bool
    {
        return $this->qualifications()
                    ->where('qualification_type', $qualificationType)
                    ->where('status', 'valid')
                    ->where('expiry_date', '>=', now())
                    ->exists();
    }

    public function getExpiringQualifications(int $daysAhead = 30)
    {
        return $this->qualifications()
                    ->where('status', 'valid')
                    ->whereBetween('expiry_date', [now(), now()->addDays($daysAhead)])
                    ->get();
    }
}
