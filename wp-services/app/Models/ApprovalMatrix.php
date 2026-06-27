<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApprovalMatrix extends Model
{
    protected $fillable = [
        'name', 'permit_type_id', 'risk_level', 'approval_mode',
        'is_active', 'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function stages()
    {
        return $this->hasMany(ApprovalMatrixStage::class)->orderBy('stage_order');
    }

    public function permitType()
    {
        return $this->belongsTo(PermitType::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public static function findMatching(int $permitTypeId, ?string $riskLevel = null): ?self
    {
        return self::active()
            ->where('permit_type_id', $permitTypeId)
            ->when($riskLevel, fn($q) => $q->where('risk_level', $riskLevel))
            ->with('stages')
            ->first()
            ?? self::active()
                ->where('permit_type_id', $permitTypeId)
                ->whereNull('risk_level')
                ->with('stages')
                ->first();
    }
}
