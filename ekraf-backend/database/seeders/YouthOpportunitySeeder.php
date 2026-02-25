<?php

namespace Database\Seeders;

use App\Models\YouthOpportunity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class YouthOpportunitySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'judul'              => 'Beasiswa Pemuda Kreatif Bontang 2026',
                'slug'               => 'beasiswa-pemuda-kreatif-bontang-2026',
                'deskripsi'          => 'Program beasiswa bagi pemuda Kota Bontang yang memiliki bakat di bidang ekonomi kreatif. Mencakup biaya pendidikan dan pelatihan intensif selama 12 bulan.',
                'jenis'              => 'beasiswa',
                'penyelenggara'      => 'Dispoparekraf Kota Bontang',
                'lokasi'             => 'Kota Bontang',
                'batas_pendaftaran'  => Carbon::now()->addDays(45),
                'link_pendaftaran'   => 'https://bontang.go.id/beasiswa-kreatif',
                'kontak'             => '08115550101',
                'thumbnail'          => null,
                'persyaratan'        => ['Usia 17-30 tahun', 'Berdomisili di Kota Bontang', 'Memiliki portofolio karya kreatif', 'Surat rekomendasi RT/RW'],
                'gaji_min'           => null,
                'gaji_max'           => null,
                'is_published'       => true,
            ],
            [
                'judul'              => 'Magang di Dinas Pariwisata Kota Bontang',
                'slug'               => 'magang-dinas-pariwisata-bontang',
                'deskripsi'          => 'Kesempatan magang selama 3 bulan bagi mahasiswa/i semester akhir untuk belajar langsung tentang manajemen pariwisata dan event kota.',
                'jenis'              => 'magang',
                'penyelenggara'      => 'Dinas Pariwisata Kota Bontang',
                'lokasi'             => 'Kantor Dinas Pariwisata, Jl. Bessai Berinta',
                'batas_pendaftaran'  => Carbon::now()->addDays(30),
                'link_pendaftaran'   => 'https://bontang.go.id/magang-dispar',
                'kontak'             => '08115550102',
                'thumbnail'          => null,
                'persyaratan'        => ['Mahasiswa semester 6-8', 'IPK minimal 3.0', 'Menguasai Ms. Office', 'Bersedia magang full-time'],
                'gaji_min'           => 1500000,
                'gaji_max'           => 2000000,
                'is_published'       => true,
            ],
            [
                'judul'              => 'Lowongan Content Creator — EKRAF Bontang',
                'slug'               => 'lowongan-content-creator-ekraf-bontang',
                'deskripsi'          => 'Dibutuhkan content creator kreatif untuk mengelola media sosial dan konten digital promosi ekonomi kreatif Kota Bontang.',
                'jenis'              => 'lowongan_kerja',
                'penyelenggara'      => 'Dispoparekraf Kota Bontang',
                'lokasi'             => 'Kota Bontang (WFO & WFH)',
                'batas_pendaftaran'  => Carbon::now()->addDays(20),
                'link_pendaftaran'   => null,
                'kontak'             => '08115550103',
                'thumbnail'          => null,
                'persyaratan'        => ['Usia maksimal 35 tahun', 'Pengalaman min. 1 tahun di bidang content creation', 'Menguasai Adobe Suite atau Canva', 'Familiar dengan Instagram, TikTok, YouTube'],
                'gaji_min'           => 3000000,
                'gaji_max'           => 5000000,
                'is_published'       => true,
            ],
            [
                'judul'              => 'Beasiswa S2 Manajemen Pariwisata',
                'slug'               => 'beasiswa-s2-manajemen-pariwisata',
                'deskripsi'          => 'Beasiswa penuh program magister Manajemen Pariwisata kerja sama Pemkot Bontang dengan Universitas Mulawarman.',
                'jenis'              => 'beasiswa',
                'penyelenggara'      => 'Pemkot Bontang & Unmul',
                'lokasi'             => 'Universitas Mulawarman, Samarinda',
                'batas_pendaftaran'  => Carbon::now()->addDays(60),
                'link_pendaftaran'   => 'https://unmul.ac.id/beasiswa-bontang',
                'kontak'             => '08115550104',
                'thumbnail'          => null,
                'persyaratan'        => ['Lulusan S1 semua jurusan', 'IPK min. 3.25', 'Berdomisili di Kota Bontang min. 2 tahun', 'Usia maksimal 35 tahun', 'Ikatan dinas 2 tahun'],
                'gaji_min'           => null,
                'gaji_max'           => null,
                'is_published'       => true,
            ],
            [
                'judul'              => 'Magang Digital Marketing — Bontang Creative Hub',
                'slug'               => 'magang-digital-marketing-bontang-creative-hub',
                'deskripsi'          => 'Program magang 6 bulan di Bontang Creative Hub untuk belajar strategi digital marketing, SEO, dan social media ads.',
                'jenis'              => 'magang',
                'penyelenggara'      => 'Bontang Creative Hub',
                'lokasi'             => 'Bontang Creative Hub, Jl. MT Haryono',
                'batas_pendaftaran'  => Carbon::now()->addDays(15),
                'link_pendaftaran'   => 'https://bontangcreativehub.id/magang',
                'kontak'             => '08115550105',
                'thumbnail'          => null,
                'persyaratan'        => ['Mahasiswa/fresh graduate', 'Memiliki laptop pribadi', 'Familiar Google Ads & Meta Ads', 'Mampu bekerja dalam tim'],
                'gaji_min'           => 1000000,
                'gaji_max'           => 1500000,
                'is_published'       => true,
            ],
        ];

        foreach ($items as $item) {
            YouthOpportunity::create($item);
        }
    }
}
