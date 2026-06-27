<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'category', 'document_number', 'version', 'description',
        'file_path', 'file_type', 'file_size',
        'effective_date', 'expiry_date',
        'allowed_roles',
        'uploaded_by_name', 'uploaded_by_id',
        'download_count', 'is_active',
    ];

    protected $casts = [
        'allowed_roles'   => 'array',
        'effective_date'  => 'date',
        'expiry_date'     => 'date',
        'is_active'       => 'boolean',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAccessibleBy($query, ?string $role)
    {
        if (!$role) {
            return $query->whereNull('allowed_roles');
        }
        return $query->where(function ($q) use ($role) {
            $q->whereNull('allowed_roles')
              ->orWhereJsonContains('allowed_roles', $role);
        });
    }
}
