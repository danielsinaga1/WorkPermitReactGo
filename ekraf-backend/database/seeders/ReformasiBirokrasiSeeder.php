<?php

namespace Database\Seeders;

use App\Models\ReformasiBirokrasi;
use Illuminate\Database\Seeder;

class ReformasiBirokrasiSeeder extends Seeder
{
    public function run(): void
    {
        $reformasiBirokrasis = [
            [
                'title' => 'Manajemen Perubahan',
                'content' => 'Komitmen terhadap perubahan melalui peningkatan kualitas sumber daya manusia dan budaya kerja yang berorientasi pada pelayanan.',
                'category' => 'area_perubahan',
            ],
            [
                'title' => 'Penataan Peraturan Perundang-undangan',
                'content' => 'Harmonisasi dan sinkronisasi peraturan perundang-undangan di bidang pariwisata dan ekonomi kreatif.',
                'category' => 'area_perubahan',
            ],
            [
                'title' => 'Penataan dan Penguatan Organisasi',
                'content' => 'Restrukturisasi organisasi yang efektif, efisien, dan berorientasi pada peningkatan kinerja.',
                'category' => 'area_perubahan',
            ],
            [
                'title' => 'Penataan Tatalaksana',
                'content' => 'Pengembangan sistem, proses, dan prosedur kerja yang jelas, efektif, efisien, dan terukur.',
                'category' => 'area_perubahan',
            ],
            [
                'title' => 'Penataan Sistem Manajemen SDM',
                'content' => 'Penguatan manajemen SDM ASN yang transparan, kompetitif, dan berbasis merit.',
                'category' => 'area_perubahan',
            ],
            [
                'title' => 'Penguatan Akuntabilitas',
                'content' => 'Peningkatan akuntabilitas kinerja instansi pemerintah yang berorientasi pada hasil.',
                'category' => 'area_perubahan',
            ],
            [
                'title' => 'Penguatan Pengawasan',
                'content' => 'Penerapan sistem pengendalian internal yang efektif untuk pencegahan korupsi.',
                'category' => 'area_perubahan',
            ],
            [
                'title' => 'Peningkatan Kualitas Pelayanan Publik',
                'content' => 'Peningkatan kualitas dan inovasi pelayanan publik yang cepat, murah, mudah, dan berkepastian.',
                'category' => 'area_perubahan',
            ],
            [
                'title' => 'Road Map Reformasi Birokrasi 2020-2024',
                'content' => 'Dokumen perencanaan reformasi birokrasi Kementerian Pariwisata dan Ekonomi Kreatif periode 2020-2024.',
                'category' => 'dokumen',
            ],
            [
                'title' => 'Laporan Evaluasi Reformasi Birokrasi 2023',
                'content' => 'Hasil evaluasi pelaksanaan reformasi birokrasi tahun 2023.',
                'category' => 'laporan',
            ],
        ];

        foreach ($reformasiBirokrasis as $reformasiBirokrasi) {
            ReformasiBirokrasi::create($reformasiBirokrasi);
        }
    }
}
