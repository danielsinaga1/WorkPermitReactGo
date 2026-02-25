<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilPimpinan extends Model
{
    use HasFactory;

    protected $table = 'profil_pimpinans';

    protected $fillable = [
        'name',
        'position',
        'photo',
        'biography',
        'order'
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
