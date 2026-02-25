<?php

namespace Database\Seeders;

use App\Models\PPID;
use Illuminate\Database\Seeder;

class PPIDSeeder extends Seeder
{
    public function run(): void
    {
        $ppids = [
            // Tentang PPID
            [
                'section' => 'tentang',
                'title' => 'Tentang PPID',
                'content' => 'Pejabat Pengelola Informasi dan Dokumentasi (PPID) adalah pejabat yang bertanggung jawab di bidang penyimpanan, pendokumentasian, penyediaan, dan/atau pelayanan informasi di badan publik.',
                'file_url' => null,
            ],
            // Profil PPID
            [
                'section' => 'profil',
                'title' => 'Profil PPID Kementerian Ekonomi Kreatif',
                'content' => 'PPID Kementerian Pariwisata dan Ekonomi Kreatif dibentuk untuk memberikan pelayanan informasi publik yang transparan dan akuntabel kepada masyarakat.',
                'file_url' => null,
            ],
            // Tugas dan Fungsi
            [
                'section' => 'tugas_fungsi',
                'title' => 'Tugas dan Fungsi PPID',
                'content' => 'PPID memiliki tugas mengkoordinasikan penyimpanan dan pendokumentasian seluruh informasi publik, menyediakan dan memberikan pelayanan informasi kepada pemohon informasi publik.',
                'file_url' => null,
            ],
            // Struktur Organisasi
            [
                'section' => 'struktur_organisasi',
                'title' => 'Struktur Organisasi PPID',
                'content' => 'Struktur organisasi PPID Kementerian Pariwisata dan Ekonomi Kreatif terdiri dari PPID Utama, PPID Pelaksana, dan Tim Pertimbangan.',
                'file_url' => 'ppid/struktur-organisasi.pdf',
            ],
            // Visi Misi
            [
                'section' => 'visi_misi',
                'title' => 'Visi dan Misi PPID',
                'content' => 'Visi: Mewujudkan keterbukaan informasi publik yang berkualitas. Misi: Memberikan pelayanan informasi publik yang cepat, tepat, dan mudah dijangkau.',
                'file_url' => null,
            ],
            // Regulasi
            [
                'section' => 'regulasi',
                'title' => 'Regulasi PPID',
                'content' => 'Dasar hukum PPID meliputi UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik dan berbagai peraturan pelaksanaannya.',
                'file_url' => 'ppid/regulasi-ppid.pdf',
            ],
            // Formulir
            [
                'section' => 'formulir',
                'title' => 'Formulir Permohonan Informasi',
                'content' => 'Formulir permohonan informasi publik dapat diunduh dan diisi untuk mengajukan permintaan informasi kepada PPID.',
                'file_url' => 'ppid/formulir-permohonan.pdf',
            ],
            // Jam Pelayanan
            [
                'section' => 'jam_pelayanan',
                'title' => 'Jam Pelayanan PPID',
                'content' => 'Senin - Kamis: 08.00 - 16.00 WIB\nJumat: 08.00 - 16.30 WIB\nIstirahat: 12.00 - 13.00 WIB',
                'file_url' => null,
            ],
        ];

        foreach ($ppids as $ppid) {
            PPID::create($ppid);
        }
    }
}
