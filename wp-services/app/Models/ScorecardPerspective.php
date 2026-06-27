<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScorecardPerspective extends Model
{
    protected $fillable = [
        'code', 'name', 'description',
        'weight', 'display_order', 'is_active',
    ];

    protected $casts = [
        'weight'    => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function kpis()
    {
        return $this->hasMany(ScorecardKpi::class)->orderBy('display_order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
