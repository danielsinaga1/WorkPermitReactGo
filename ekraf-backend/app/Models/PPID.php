<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PPID extends Model
{
    use HasFactory;

    protected $table = 'ppids';

    const SECTION_TENTANG = 'tentang';
    const SECTION_PROFIL = 'profil';
    const SECTION_TUGAS_FUNGSI = 'tugas_fungsi';
    const SECTION_STRUKTUR_ORGANISASI = 'struktur_organisasi';
    const SECTION_VISI_MISI = 'visi_misi';
    const SECTION_REGULASI = 'regulasi';
    const SECTION_FORMULIR = 'formulir';
    const SECTION_JAM_PELAYANAN = 'jam_pelayanan';

    protected $fillable = [
        'section',
        'title',
        'content',
        'file_url'
    ];

    public static function getSections()
    {
        return [
            self::SECTION_TENTANG,
            self::SECTION_PROFIL,
            self::SECTION_TUGAS_FUNGSI,
            self::SECTION_STRUKTUR_ORGANISASI,
            self::SECTION_VISI_MISI,
            self::SECTION_REGULASI,
            self::SECTION_FORMULIR,
            self::SECTION_JAM_PELAYANAN,
        ];
    }

    public function scopeBySection($query, $section)
    {
        return $query->where('section', $section);
    }
}
