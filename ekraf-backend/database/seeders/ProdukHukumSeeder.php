<?php

namespace Database\Seeders;

use App\Models\ProdukHukum;
use Illuminate\Database\Seeder;

class ProdukHukumSeeder extends Seeder
{
    public function run(): void
    {
        $produkHukums = [
            // Undang-Undang
            [
                'title' => 'Undang-Undang Nomor 24 Tahun 2019 tentang Ekonomi Kreatif',
                'author' => 'Presiden Republik Indonesia',
                'date' => '2019-10-24',
                'hits' => 1500,
                'file_url' => 'produk-hukum/uu-24-2019.pdf',
                'category' => 'undang_undang',
                'is_published' => true,
            ],
            [
                'title' => 'Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta',
                'author' => 'Presiden Republik Indonesia',
                'date' => '2014-10-16',
                'hits' => 2300,
                'file_url' => 'produk-hukum/uu-28-2014.pdf',
                'category' => 'undang_undang',
                'is_published' => true,
            ],
            // Peraturan Pemerintah
            [
                'title' => 'Peraturan Pemerintah Nomor 7 Tahun 2021 tentang Kemudahan, Pelindungan, dan Pemberdayaan Koperasi dan UMKM',
                'author' => 'Presiden Republik Indonesia',
                'date' => '2021-02-02',
                'hits' => 890,
                'file_url' => 'produk-hukum/pp-7-2021.pdf',
                'category' => 'peraturan_pemerintah',
                'is_published' => true,
            ],
            // Peraturan Presiden
            [
                'title' => 'Peraturan Presiden Nomor 142 Tahun 2018 tentang Rencana Induk Pengembangan Ekonomi Kreatif Nasional',
                'author' => 'Presiden Republik Indonesia',
                'date' => '2018-12-31',
                'hits' => 1200,
                'file_url' => 'produk-hukum/perpres-142-2018.pdf',
                'category' => 'peraturan_presiden',
                'is_published' => true,
            ],
            // Peraturan Menteri
            [
                'title' => 'Peraturan Menteri Pariwisata dan Ekonomi Kreatif Nomor 1 Tahun 2024',
                'author' => 'Menteri Pariwisata dan Ekonomi Kreatif',
                'date' => '2024-01-15',
                'hits' => 450,
                'file_url' => 'produk-hukum/permen-1-2024.pdf',
                'category' => 'peraturan_menteri',
                'is_published' => true,
            ],
            // Naskah Kerja Sama
            [
                'title' => 'MoU Kerja Sama Indonesia-Korea dalam Bidang Ekonomi Kreatif',
                'author' => 'Kementerian Pariwisata dan Ekonomi Kreatif',
                'date' => '2023-11-20',
                'hits' => 320,
                'file_url' => 'produk-hukum/mou-korea-2023.pdf',
                'category' => 'naskah_kerja_sama',
                'is_published' => true,
            ],
            // Rancangan Produk Hukum
            [
                'title' => 'Rancangan Peraturan Menteri tentang Standar Kompetensi Tenaga Kerja Kreatif',
                'author' => 'Kementerian Pariwisata dan Ekonomi Kreatif',
                'date' => '2024-03-01',
                'hits' => 180,
                'file_url' => 'produk-hukum/rapermen-skkni-2024.pdf',
                'category' => 'rancangan_produk_hukum',
                'is_published' => true,
            ],
            // Produk Hukum Lainnya
            [
                'title' => 'Keputusan Menteri tentang Penetapan Kawasan Ekonomi Kreatif',
                'author' => 'Menteri Pariwisata dan Ekonomi Kreatif',
                'date' => '2024-02-15',
                'hits' => 280,
                'file_url' => 'produk-hukum/kepmen-kawasan-ekraf.pdf',
                'category' => 'produk_hukum_lainnya',
                'is_published' => true,
            ],
        ];

        foreach ($produkHukums as $produkHukum) {
            ProdukHukum::create($produkHukum);
        }
    }
}
