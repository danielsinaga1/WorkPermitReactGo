<?php

namespace Database\Seeders;

use App\Models\Pelatihan;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PelatihanSeeder extends Seeder
{
    public function run(): void
    {
        $pelatihans = [
            [
                'judul'                => 'Digital Marketing untuk UMKM',
                'slug'                 => 'digital-marketing-untuk-umkm',
                'deskripsi'            => 'Pelatihan komprehensif tentang strategi pemasaran digital, social media marketing, Google Ads, dan SEO untuk pelaku UMKM Bontang.',
                'tanggal_mulai'        => Carbon::now()->addDays(14)->setHour(9),
                'tanggal_selesai'      => Carbon::now()->addDays(14)->setHour(16),
                'lokasi'               => 'Aula Kantor Dispoparekraf Bontang',
                'kuota'                => 30,
                'pendaftar_count'      => 18,
                'thumbnail'            => null,
                'images'               => null,
                'narasumber'           => 'Ahmad Fauzi, S.Kom., M.M. - Digital Marketing Expert',
                'kategori'             => 'digital_marketing',
                'kontak_pendaftaran'   => '08115554001',
                'link_pendaftaran'     => 'https://forms.gle/pelatihan-digimark',
                'is_published'         => true,
            ],
            [
                'judul'                => 'Workshop Desain Kemasan Produk',
                'slug'                 => 'workshop-desain-kemasan-produk',
                'deskripsi'            => 'Workshop praktis mendesain kemasan produk UMKM yang menarik menggunakan Canva dan Adobe Illustrator.',
                'tanggal_mulai'        => Carbon::now()->addDays(21)->setHour(9),
                'tanggal_selesai'      => Carbon::now()->addDays(21)->setHour(15),
                'lokasi'               => 'Co-Working Space Bontang Creative Hub',
                'kuota'                => 25,
                'pendaftar_count'      => 25,
                'thumbnail'            => null,
                'images'               => null,
                'narasumber'           => 'Rina Susanti, S.Ds. - Desainer Grafis',
                'kategori'             => 'desain',
                'kontak_pendaftaran'   => '08115554002',
                'link_pendaftaran'     => 'https://forms.gle/workshop-kemasan',
                'is_published'         => true,
            ],
            [
                'judul'                => 'Pelatihan Manajemen Keuangan UMKM',
                'slug'                 => 'pelatihan-manajemen-keuangan-umkm',
                'deskripsi'            => 'Pengelolaan keuangan sederhana untuk pelaku usaha: pembukuan, laporan keuangan, dan perencanaan pajak UMKM.',
                'tanggal_mulai'        => Carbon::now()->addDays(30)->setHour(8),
                'tanggal_selesai'      => Carbon::now()->addDays(30)->setHour(16),
                'lokasi'               => 'Gedung Serbaguna Taman Rindang',
                'kuota'                => 40,
                'pendaftar_count'      => 12,
                'thumbnail'            => null,
                'images'               => null,
                'narasumber'           => 'Drs. Budi Hartono, Ak., M.Ak. - Akuntan Publik',
                'kategori'             => 'manajemen',
                'kontak_pendaftaran'   => '08115554003',
                'link_pendaftaran'     => null,
                'is_published'         => true,
            ],
            [
                'judul'                => 'Kelas Fotografi Produk untuk E-Commerce',
                'slug'                 => 'kelas-fotografi-produk-e-commerce',
                'deskripsi'            => 'Belajar teknik fotografi produk menggunakan smartphone untuk keperluan marketplace dan e-commerce.',
                'tanggal_mulai'        => Carbon::now()->subDays(7)->setHour(10),
                'tanggal_selesai'      => Carbon::now()->subDays(7)->setHour(15),
                'lokasi'               => 'Studio Foto Bontang',
                'kuota'                => 20,
                'pendaftar_count'      => 20,
                'thumbnail'            => null,
                'images'               => ['pelatihan-foto-1.jpg', 'pelatihan-foto-2.jpg'],
                'narasumber'           => 'Dimas Prasetyo - Fotografer Profesional',
                'kategori'             => 'desain',
                'kontak_pendaftaran'   => '08115554004',
                'link_pendaftaran'     => null,
                'is_published'         => true,
            ],
            [
                'judul'                => 'Pendaftaran HAKI untuk Pelaku UMKM',
                'slug'                 => 'pendaftaran-haki-untuk-umkm',
                'deskripsi'            => 'Sosialisasi dan pendampingan pendaftaran Hak Kekayaan Intelektual (merek, paten, desain industri) untuk produk UMKM.',
                'tanggal_mulai'        => Carbon::now()->addDays(45)->setHour(9),
                'tanggal_selesai'      => Carbon::now()->addDays(45)->setHour(14),
                'lokasi'               => 'Kantor Kemenkumham Kota Bontang',
                'kuota'                => 50,
                'pendaftar_count'      => 8,
                'thumbnail'            => null,
                'images'               => null,
                'narasumber'           => 'Tim Kemenkumham Kaltim',
                'kategori'             => 'haki',
                'kontak_pendaftaran'   => '08115554005',
                'link_pendaftaran'     => 'https://forms.gle/haki-umkm',
                'is_published'         => true,
            ],
            [
                'judul'                => 'Pelatihan Kuliner: Pengolahan Ikan Lokal',
                'slug'                 => 'pelatihan-kuliner-pengolahan-ikan',
                'deskripsi'            => 'Teknik pengolahan ikan lokal Bontang menjadi produk olahan bernilai tinggi: abon, nugget, kerupuk, dan sambal ikan.',
                'tanggal_mulai'        => Carbon::now()->subDays(14)->setHour(8),
                'tanggal_selesai'      => Carbon::now()->subDays(14)->setHour(15),
                'lokasi'               => 'Balai Pelatihan Kota Bontang',
                'kuota'                => 30,
                'pendaftar_count'      => 28,
                'thumbnail'            => null,
                'images'               => ['pelatihan-kuliner-1.jpg'],
                'narasumber'           => 'Chef Hendra - Ahli Pengolahan Hasil Laut',
                'kategori'             => 'kuliner',
                'kontak_pendaftaran'   => '08115554006',
                'link_pendaftaran'     => null,
                'is_published'         => true,
            ],
        ];

        foreach ($pelatihans as $p) {
            Pelatihan::create($p);
        }
    }
}
