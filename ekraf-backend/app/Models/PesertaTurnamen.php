<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PesertaTurnamen extends Model
{
    protected $fillable = [
        'turnamen_id',
        'user_id',
        'nama_peserta',
        'nama_tim',
        'no_telp',
        'email',
        'status',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function turnamen()
    {
        return $this->belongsTo(Turnamen::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
