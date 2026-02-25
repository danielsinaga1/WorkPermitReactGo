<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProdukHukum extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'produk_hukums';

    const CATEGORY_UNDANG_UNDANG = 'undang_undang';
    const CATEGORY_PERATURAN_PEMERINTAH = 'peraturan_pemerintah';
    const CATEGORY_PERATURAN_PRESIDEN = 'peraturan_presiden';
    const CATEGORY_PERATURAN_MENTERI = 'peraturan_menteri';
    const CATEGORY_NASKAH_KERJA_SAMA = 'naskah_kerja_sama';
    const CATEGORY_RANCANGAN_PRODUK_HUKUM = 'rancangan_produk_hukum';
    const CATEGORY_PRODUK_HUKUM_LAINNYA = 'produk_hukum_lainnya';

    protected $fillable = [
        'title',
        'author',
        'date',
        'hits',
        'file_url',
        'category',
        'is_published'
    ];

    protected $casts = [
        'date' => 'date',
        'hits' => 'integer',
        'is_published' => 'boolean',
    ];

    public static function getCategories()
    {
        return [
            self::CATEGORY_UNDANG_UNDANG,
            self::CATEGORY_PERATURAN_PEMERINTAH,
            self::CATEGORY_PERATURAN_PRESIDEN,
            self::CATEGORY_PERATURAN_MENTERI,
            self::CATEGORY_NASKAH_KERJA_SAMA,
            self::CATEGORY_RANCANGAN_PRODUK_HUKUM,
            self::CATEGORY_PRODUK_HUKUM_LAINNYA,
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('author', 'like', "%{$search}%");
        });
    }

    /**
     * Increment hit count
     */
    public function incrementHits()
    {
        $this->increment('hits');
    }
}
