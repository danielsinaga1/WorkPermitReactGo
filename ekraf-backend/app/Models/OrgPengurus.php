<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrgPengurus extends Model
{
    protected $table = 'org_pengurus';

    protected $fillable = [
        'organisasi_id',
        'user_id',
        'nama',
        'jabatan',
        'no_telp',
        'email',
        'foto',
        'periode_mulai',
        'periode_selesai',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function organisasi()
    {
        return $this->belongsTo(Organisasi::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
