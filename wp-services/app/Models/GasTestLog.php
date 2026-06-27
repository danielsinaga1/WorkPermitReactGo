<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GasTestLog extends Model
{
    protected $fillable = [
        'work_permit_id', 'tested_by_id', 'tested_by_name', 'tested_at',
        'o2_level', 'lel_level', 'h2s_level', 'co_level',
        'equipment_serial', 'is_safe', 'remarks',
        'gps_latitude', 'gps_longitude',
    ];

    protected $casts = [
        'tested_at'    => 'datetime',
        'o2_level'     => 'decimal:2',
        'lel_level'    => 'decimal:2',
        'h2s_level'    => 'decimal:2',
        'co_level'     => 'decimal:2',
        'is_safe'      => 'boolean',
        'gps_latitude' => 'decimal:7',
        'gps_longitude'=> 'decimal:7',
    ];

    // Safety thresholds per gas
    const SAFE_O2_MIN  = 19.5;
    const SAFE_O2_MAX  = 23.5;
    const SAFE_LEL_MAX = 10.0;
    const SAFE_H2S_MAX = 10.0;
    const SAFE_CO_MAX  = 25.0;

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function tester()
    {
        return $this->belongsTo(Personnel::class, 'tested_by_id');
    }

    /**
     * Evaluate if all gas readings are within safe limits.
     */
    public static function evaluateSafety(float $o2, float $lel, float $h2s, float $co): bool
    {
        return $o2 >= self::SAFE_O2_MIN
            && $o2 <= self::SAFE_O2_MAX
            && $lel <= self::SAFE_LEL_MAX
            && $h2s <= self::SAFE_H2S_MAX
            && $co  <= self::SAFE_CO_MAX;
    }

    /**
     * Return per-gas violation details.
     */
    public static function getViolations(float $o2, float $lel, float $h2s, float $co): array
    {
        $violations = [];
        if ($o2 < self::SAFE_O2_MIN)   $violations[] = "O2 too low ({$o2}%, min " . self::SAFE_O2_MIN . "%)";
        if ($o2 > self::SAFE_O2_MAX)   $violations[] = "O2 too high ({$o2}%, max " . self::SAFE_O2_MAX . "%)";
        if ($lel > self::SAFE_LEL_MAX) $violations[] = "LEL too high ({$lel}%, max " . self::SAFE_LEL_MAX . "%)";
        if ($h2s > self::SAFE_H2S_MAX) $violations[] = "H2S too high ({$h2s} ppm, max " . self::SAFE_H2S_MAX . " ppm)";
        if ($co > self::SAFE_CO_MAX)   $violations[] = "CO too high ({$co} ppm, max " . self::SAFE_CO_MAX . " ppm)";
        return $violations;
    }
}
