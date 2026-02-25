<?php

namespace Database\Seeders;

use App\Models\Pengumuman;
use Illuminate\Database\Seeder;

class PengumumanSeeder extends Seeder
{
    public function run(): void
    {
        $pengumumans = [
            [
                'title' => 'Pendaftaran Program Inkubasi UMKM 2024',
                'content' => 'Pendaftaran program inkubasi UMKM kreatif tahun 2024 telah dibuka. Segera daftarkan usaha Anda untuk mendapatkan pendampingan dari para mentor profesional.',
                'date' => '2024-01-10',
                'thumbnail' => 'pengumuman/pengumuman-1.jpg',
                'is_published' => true,
            ],
            [
                'title' => 'Jadwal Libur Nasional dan Cuti Bersama 2024',
                'content' => 'Berikut adalah jadwal libur nasional dan cuti bersama tahun 2024 untuk seluruh pegawai Kementerian.',
                'date' => '2024-01-05',
                'thumbnail' => 'pengumuman/pengumuman-2.jpg',
                'is_published' => true,
            ],
            [
                'title' => 'Lowongan CPNS Kementerian Ekraf 2024',
                'content' => 'Kementerian Ekonomi Kreatif membuka lowongan CPNS untuk berbagai posisi. Pendaftaran dilakukan melalui portal SSCASN.',
                'date' => '2024-02-01',
                'thumbnail' => 'pengumuman/pengumuman-3.jpg',
                'is_published' => true,
            ],
            [
                'title' => 'Seleksi Terbuka Jabatan Pimpinan Tinggi',
                'content' => 'Dibuka seleksi terbuka untuk mengisi jabatan pimpinan tinggi pratama di lingkungan Kementerian Ekonomi Kreatif.',
                'date' => '2024-02-15',
                'thumbnail' => 'pengumuman/pengumuman-4.jpg',
                'is_published' => true,
            ],
            [
                'title' => 'Pemutakhiran Data Pelaku Ekonomi Kreatif',
                'content' => 'Seluruh pelaku ekonomi kreatif diminta untuk memperbarui data pada sistem informasi terintegrasi.',
                'date' => '2024-03-01',
                'thumbnail' => 'pengumuman/pengumuman-5.jpg',
                'is_published' => true,
            ],
        ];

        foreach ($pengumumans as $pengumuman) {
            Pengumuman::create($pengumuman);
        }
    }
}
