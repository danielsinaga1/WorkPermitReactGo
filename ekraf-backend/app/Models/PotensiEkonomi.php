<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PotensiEkonomi extends Model
{
    use HasFactory;

    protected $table = 'potensi_ekonomis';

    protected $fillable = [
        'title',
        'value',
        'unit',
        'year',
        'category',
        'description'
    ];

    protected $casts = [
        'year' => 'integer',
    ];

    public function scopeByYear($query, $year)
    {
        return $query->where('year', $year);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
