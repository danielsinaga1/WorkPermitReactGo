<?php

namespace Database\Seeders;

use App\Models\Pustaka;
use Illuminate\Database\Seeder;

class PustakaSeeder extends Seeder
{
    public function run(): void
    {
        $pustakas = [
            [
                'title' => 'Panduan Pengembangan UMKM Kreatif',
                'content' => 'Buku panduan lengkap untuk mengembangkan usaha mikro, kecil, dan menengah di sektor ekonomi kreatif.',
                'date' => '2024-01-15',
                'thumbnail' => 'pustaka/pustaka-1.jpg',
                'pdf_url' => 'pustaka/panduan-umkm-kreatif.pdf',
                'category' => 'Panduan',
                'is_published' => true,
            ],
            [
                'title' => 'Laporan Tahunan Ekonomi Kreatif 2023',
                'content' => 'Laporan komprehensif mengenai perkembangan ekonomi kreatif Indonesia sepanjang tahun 2023.',
                'date' => '2024-02-01',
                'thumbnail' => 'pustaka/pustaka-2.jpg',
                'pdf_url' => 'pustaka/laporan-tahunan-2023.pdf',
                'category' => 'Laporan',
                'is_published' => true,
            ],
            [
                'title' => 'Strategi Pemasaran Digital untuk Pelaku Kreatif',
                'content' => 'Modul pelatihan strategi pemasaran digital yang efektif untuk pelaku ekonomi kreatif.',
                'date' => '2024-02-20',
                'thumbnail' => 'pustaka/pustaka-3.jpg',
                'pdf_url' => 'pustaka/modul-pemasaran-digital.pdf',
                'category' => 'Modul',
                'is_published' => true,
            ],
            [
                'title' => 'Hak Kekayaan Intelektual untuk Industri Kreatif',
                'content' => 'Panduan perlindungan hak kekayaan intelektual bagi pelaku industri kreatif.',
                'date' => '2024-03-10',
                'thumbnail' => 'pustaka/pustaka-4.jpg',
                'pdf_url' => 'pustaka/panduan-hki.pdf',
                'category' => 'Panduan',
                'is_published' => true,
            ],
            [
                'title' => 'Kajian Subsektor Ekonomi Kreatif',
                'content' => 'Kajian mendalam mengenai 17 subsektor ekonomi kreatif Indonesia.',
                'date' => '2024-03-25',
                'thumbnail' => 'pustaka/pustaka-5.jpg',
                'pdf_url' => 'pustaka/kajian-subsektor.pdf',
                'category' => 'Kajian',
                'is_published' => true,
            ],
        ];

        foreach ($pustakas as $pustaka) {
            Pustaka::create($pustaka);
        }
    }
}
