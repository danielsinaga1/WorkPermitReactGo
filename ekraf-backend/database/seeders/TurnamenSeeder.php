<?php

namespace Database\Seeders;

use App\Models\Turnamen;
use App\Models\PesertaTurnamen;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TurnamenSeeder extends Seeder
{
    public function run(): void
    {
        $turnamen = [
            [
                'nama'                => 'Piala Walikota Bontang Cup 2026',
                'slug'                => 'piala-walikota-bontang-cup-2026',
                'deskripsi'           => 'Turnamen sepak bola antar klub se-Kota Bontang memperebutkan Piala Walikota. Diikuti 16 klub terbaik dari seluruh kecamatan.',
                'cabang_olahraga'     => 'Sepak Bola',
                'tanggal_mulai'       => Carbon::now()->addDays(40),
                'tanggal_selesai'     => Carbon::now()->addDays(55),
                'lokasi'              => 'Stadion Segiri Mini Bontang',
                'kuota_peserta'       => 16,
                'peserta_count'       => 12,
                'penyelenggara'       => 'KONI Kota Bontang',
                'kontak'              => '08115580401',
                'thumbnail'           => null,
                'images'              => null,
                'batas_pendaftaran'   => Carbon::now()->addDays(30),
                'link_pendaftaran'    => 'https://koni.bontang.go.id/piala-walikota',
                'is_published'        => true,
                'status'              => 'pendaftaran',
            ],
            [
                'nama'                => 'Kejuaraan Bulutangkis Terbuka Bontang 2026',
                'slug'                => 'kejuaraan-bulutangkis-terbuka-bontang-2026',
                'deskripsi'           => 'Kejuaraan bulutangkis terbuka untuk kategori tunggal putra, tunggal putri, ganda putra, ganda putri, dan ganda campuran.',
                'cabang_olahraga'     => 'Bulutangkis',
                'tanggal_mulai'       => Carbon::now()->addDays(20),
                'tanggal_selesai'     => Carbon::now()->addDays(23),
                'lokasi'              => 'GOR Tri Dharma Bontang',
                'kuota_peserta'       => 64,
                'peserta_count'       => 48,
                'penyelenggara'       => 'PBSI Cabang Bontang',
                'kontak'              => '08115580402',
                'thumbnail'           => null,
                'images'              => null,
                'batas_pendaftaran'   => Carbon::now()->addDays(10),
                'link_pendaftaran'    => null,
                'is_published'        => true,
                'status'              => 'pendaftaran',
            ],
            [
                'nama'                => 'Lomba Renang Piala Bontang Aquatic 2026',
                'slug'                => 'lomba-renang-piala-bontang-aquatic-2026',
                'deskripsi'           => 'Lomba renang antar pelajar se-Kalimantan Timur. Kategori: 50m, 100m, 200m gaya bebas dan gaya kupu-kupu.',
                'cabang_olahraga'     => 'Renang',
                'tanggal_mulai'       => Carbon::now()->addDays(50),
                'tanggal_selesai'     => Carbon::now()->addDays(51),
                'lokasi'              => 'Kolam Renang Tirta Bontang',
                'kuota_peserta'       => 100,
                'peserta_count'       => 35,
                'penyelenggara'       => 'Bontang Aquatic Club',
                'kontak'              => '08115580403',
                'thumbnail'           => null,
                'images'              => null,
                'batas_pendaftaran'   => Carbon::now()->addDays(40),
                'link_pendaftaran'    => 'https://bontangaquatic.id/lomba-renang',
                'is_published'        => true,
                'status'              => 'pendaftaran',
            ],
            [
                'nama'                => 'Turnamen Karate Nusantara Open 2026',
                'slug'                => 'turnamen-karate-nusantara-open-2026',
                'deskripsi'           => 'Turnamen karate terbuka nasional di Kota Bontang. Kategori kata dan kumite untuk semua tingkatan sabuk.',
                'cabang_olahraga'     => 'Karate',
                'tanggal_mulai'       => Carbon::now()->subDays(10),
                'tanggal_selesai'     => Carbon::now()->subDays(8),
                'lokasi'              => 'GOR Tri Dharma Bontang',
                'kuota_peserta'       => 120,
                'peserta_count'       => 98,
                'penyelenggara'       => 'FORKI Kota Bontang',
                'kontak'              => '08115580404',
                'thumbnail'           => null,
                'images'              => null,
                'batas_pendaftaran'   => Carbon::now()->subDays(20),
                'link_pendaftaran'    => null,
                'is_published'        => true,
                'status'              => 'selesai',
            ],
            [
                'nama'                => 'Fun Run Bontang Marathon 10K',
                'slug'                => 'fun-run-bontang-marathon-10k',
                'deskripsi'           => 'Event lari 10 kilometer untuk masyarakat umum dalam rangka HUT Kota Bontang. Peserta mendapat medali, kaos, dan snack pack.',
                'cabang_olahraga'     => 'Atletik',
                'tanggal_mulai'       => Carbon::now()->addDays(70),
                'tanggal_selesai'     => Carbon::now()->addDays(70),
                'lokasi'              => 'Start/Finish: Taman Kota Bontang',
                'kuota_peserta'       => 500,
                'peserta_count'       => 123,
                'penyelenggara'       => 'Dispoparekraf & Komunitas Runners Bontang',
                'kontak'              => '08115580405',
                'thumbnail'           => null,
                'images'              => null,
                'batas_pendaftaran'   => Carbon::now()->addDays(60),
                'link_pendaftaran'    => 'https://bontangmarathon.id',
                'is_published'        => true,
                'status'              => 'pendaftaran',
            ],
        ];

        foreach ($turnamen as $t) {
            Turnamen::create($t);
        }
    }
}
