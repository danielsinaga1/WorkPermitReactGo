<?php

namespace Database\Seeders;

use App\Models\TenagaKerja;
use Illuminate\Database\Seeder;

class TenagaKerjaSeeder extends Seeder
{
    public function run(): void
    {
        $tenagaKerjas = [
            [
                'title' => 'Statistik Tenaga Kerja Ekonomi Kreatif Q1 2024',
                'content' => 'Data statistik tenaga kerja di sektor ekonomi kreatif Indonesia kuartal pertama 2024.',
                'date' => '2024-04-01',
                'thumbnail' => 'tenaga-kerja/tk-1.jpg',
                'pdf_url' => 'tenaga-kerja/statistik-tk-q1-2024.pdf',
                'is_published' => true,
            ],
            [
                'title' => 'Tren Kebutuhan Tenaga Kerja Kreatif 2024',
                'content' => 'Analisis tren kebutuhan tenaga kerja di berbagai subsektor ekonomi kreatif.',
                'date' => '2024-04-15',
                'thumbnail' => 'tenaga-kerja/tk-2.jpg',
                'pdf_url' => 'tenaga-kerja/tren-kebutuhan-tk.pdf',
                'is_published' => true,
            ],
            [
                'title' => 'Program Pelatihan Tenaga Kerja Kreatif',
                'content' => 'Informasi mengenai berbagai program pelatihan untuk meningkatkan kompetensi tenaga kerja kreatif.',
                'date' => '2024-05-01',
                'thumbnail' => 'tenaga-kerja/tk-3.jpg',
                'pdf_url' => 'tenaga-kerja/program-pelatihan.pdf',
                'is_published' => true,
            ],
            [
                'title' => 'Sertifikasi Profesi Ekonomi Kreatif',
                'content' => 'Panduan sertifikasi profesi untuk berbagai bidang di sektor ekonomi kreatif.',
                'date' => '2024-05-20',
                'thumbnail' => 'tenaga-kerja/tk-4.jpg',
                'pdf_url' => 'tenaga-kerja/sertifikasi-profesi.pdf',
                'is_published' => true,
            ],
            [
                'title' => 'Prospek Karir di Industri Kreatif',
                'content' => 'Panduan karir dan prospek pekerjaan di berbagai subsektor industri kreatif.',
                'date' => '2024-06-01',
                'thumbnail' => 'tenaga-kerja/tk-5.jpg',
                'pdf_url' => null,
                'is_published' => true,
            ],
        ];

        foreach ($tenagaKerjas as $tenagaKerja) {
            TenagaKerja::create($tenagaKerja);
        }
    }
}
