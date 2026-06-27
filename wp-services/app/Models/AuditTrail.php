<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditTrail extends Model
{
    protected $fillable = [
        'module', 'auditable_type', 'auditable_id',
        'action', 'performed_by', 'performed_by_id',
        'old_values', 'new_values',
        'ip_address', 'user_agent', 'remarks',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function auditable()
    {
        return $this->morphTo();
    }

    public function performer()
    {
        return $this->belongsTo(Personnel::class, 'performed_by_id');
    }

    public function scopeByModule($query, $module)
    {
        return $query->where('module', $module);
    }

    public static function log(string $module, Model $model, string $action, string $performedBy, ?int $performerId = null, ?array $oldValues = null, ?array $newValues = null): self
    {
        return static::create([
            'module'          => $module,
            'auditable_type'  => get_class($model),
            'auditable_id'    => $model->getKey(),
            'action'          => $action,
            'performed_by'    => $performedBy,
            'performed_by_id' => $performerId,
            'old_values'      => $oldValues,
            'new_values'      => $newValues,
            'ip_address'      => request()?->ip(),
            'user_agent'      => request()?->userAgent(),
        ]);
    }
}
