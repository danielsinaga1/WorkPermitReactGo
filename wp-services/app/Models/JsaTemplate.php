<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JsaTemplate extends Model
{
    protected $fillable = [
        'name', 'applicable_permit_type', 'applicable_zone_type',
        'steps', 'is_active',
    ];

    protected $casts = [
        'steps'     => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Find matching template for permit type code and zone type.
     */
    public static function findForPermit(string $permitTypeCode, ?string $zoneType = null)
    {
        return static::where('is_active', true)
            ->where(function ($q) use ($permitTypeCode) {
                $q->where('applicable_permit_type', $permitTypeCode)
                  ->orWhereNull('applicable_permit_type');
            })
            ->where(function ($q) use ($zoneType) {
                $q->where('applicable_zone_type', $zoneType)
                  ->orWhereNull('applicable_zone_type');
            })
            ->orderByRaw("CASE WHEN applicable_permit_type IS NOT NULL AND applicable_zone_type IS NOT NULL THEN 0
                               WHEN applicable_permit_type IS NOT NULL THEN 1
                               WHEN applicable_zone_type IS NOT NULL THEN 2
                               ELSE 3 END")
            ->first();
    }
}
