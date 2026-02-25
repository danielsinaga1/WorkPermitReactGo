<?php

namespace Database\Seeders;

use App\Models\Subsektor;
use Illuminate\Database\Seeder;

class SubsektorSeeder extends Seeder
{
    public function run(): void
    {
        $subsektors = [
            ['name' => 'Aplikasi', 'image' => 'aplikasi.png', 'description' => 'Pengembangan aplikasi dan game'],
            ['name' => 'Penerbitan', 'image' => 'penerbitan.png', 'description' => 'Industri penerbitan buku dan media cetak'],
            ['name' => 'Arsitektur', 'image' => 'arsitektur.png', 'description' => 'Desain arsitektur dan perencanaan kota'],
            ['name' => 'Desain Interior', 'image' => 'desain-interior.png', 'description' => 'Desain interior dan dekorasi ruangan'],
            ['name' => 'Musik', 'image' => 'musik.png', 'description' => 'Industri musik dan pertunjukan'],
            ['name' => 'Seni Pertunjukan', 'image' => 'seni-pertunjukan.png', 'description' => 'Teater, tari, dan seni pertunjukan lainnya'],
            ['name' => 'Desain Produk', 'image' => 'desain-produk.png', 'description' => 'Desain produk dan industri kreatif'],
            ['name' => 'Fesyen', 'image' => 'fesyen.png', 'description' => 'Industri fashion dan pakaian'],
            ['name' => 'Film, Animasi & Video', 'image' => 'film-animasi-video.png', 'description' => 'Produksi film, animasi, dan video'],
            ['name' => 'Fotografi', 'image' => 'fotografi.png', 'description' => 'Industri fotografi profesional'],
            ['name' => 'Desain Komunikasi Visual', 'image' => 'desain-komunikasi-visual.png', 'description' => 'Desain grafis dan komunikasi visual'],
            ['name' => 'Kriya', 'image' => 'kriya.png', 'description' => 'Kerajinan tangan dan produk kriya'],
            ['name' => 'Kuliner', 'image' => 'kuliner.png', 'description' => 'Industri kuliner dan makanan'],
            ['name' => 'Periklanan', 'image' => 'periklanan.png', 'description' => 'Industri periklanan dan marketing'],
            ['name' => 'Seni Rupa', 'image' => 'seni-rupa.png', 'description' => 'Seni lukis, patung, dan seni rupa lainnya'],
            ['name' => 'Televisi & Radio', 'image' => 'televisi-radio.png', 'description' => 'Industri penyiaran televisi dan radio'],
            ['name' => 'Permainan Interaktif', 'image' => 'permainan-interaktif.png', 'description' => 'Pengembangan game dan permainan interaktif'],
        ];

        foreach ($subsektors as $subsektor) {
            Subsektor::create($subsektor);
        }
    }
}
