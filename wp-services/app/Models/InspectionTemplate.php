<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionTemplate extends Model
{
    protected $fillable = [
        'code', 'name', 'description',
        'category', 'frequency', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(InspectionTemplateItem::class)->orderBy('item_order');
    }

    public function schedules()
    {
        return $this->hasMany(InspectionSchedule::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
