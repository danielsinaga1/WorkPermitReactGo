<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subsektor extends Model
{
    use HasFactory;

    protected $table = 'subsektors';

    protected $fillable = [
        'name',
        'image',
        'description'
    ];

    /**
     * Append virtual 'nama' attribute so both name and nama are available.
     */
    protected $appends = ['nama'];

    public function getNamaAttribute(): ?string
    {
        return $this->attributes['name'] ?? null;
    }

    /**
     * Get the ragam ekrafs for the subsektor.
     */
    public function ragamEkrafs()
    {
        return $this->hasMany(RagamEkraf::class, 'subsektor_id');
    }

    /**
     * Get the pelaku ekrafs for the subsektor.
     */
    public function pelakuEkrafs()
    {
        return $this->hasMany(PelakuEkraf::class, 'subsektor_id');
    }
}
