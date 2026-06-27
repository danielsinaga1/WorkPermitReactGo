<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LotoProcedure extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'procedure_number', 'title', 'description',
        'work_area_id', 'work_permit_id',
        'machine_equipment', 'energy_sources',
        'isolation_steps', 'restoration_steps',
        'prepared_by', 'reviewed_by', 'approved_by',
        'status', 'effective_date', 'review_date', 'document_path',
    ];

    protected $casts = [
        'energy_sources'    => 'array',
        'isolation_steps'   => 'array',
        'restoration_steps' => 'array',
        'effective_date'    => 'date',
        'review_date'       => 'date',
    ];

    public function workArea()
    {
        return $this->belongsTo(WorkArea::class);
    }

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function points()
    {
        return $this->hasMany(LotoPoint::class)->orderBy('sequence_order');
    }

    public function locks()
    {
        return $this->hasMany(LotoLock::class);
    }

    public function activeLocks()
    {
        return $this->hasMany(LotoLock::class)->where('status', 'locked');
    }

    public function verifications()
    {
        return $this->hasMany(LotoVerification::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function isFullyLocked(): bool
    {
        $pointCount = $this->points()->count();
        $lockedCount = $this->locks()->where('status', 'locked')->count();
        return $pointCount > 0 && $pointCount === $lockedCount;
    }

    public static function generateNumber(): string
    {
        $date = now()->format('Ymd');
        $count = static::whereDate('created_at', now()->toDateString())->count() + 1;
        return "LOTO-{$date}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
