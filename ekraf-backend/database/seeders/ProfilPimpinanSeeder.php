<?php

namespace Database\Seeders;

use App\Models\ProfilPimpinan;
use Illuminate\Database\Seeder;

class ProfilPimpinanSeeder extends Seeder
{
    public function run(): void
    {
        $profilPimpinans = [
            [
                'name' => 'Dr. H. Sandiaga Salahuddin Uno, B.B.A., M.B.A.',
                'position' => 'Menteri Pariwisata dan Ekonomi Kreatif',
                'photo' => 'pimpinan/menteri.jpg',
                'biography' => 'Sandiaga Uno adalah Menteri Pariwisata dan Ekonomi Kreatif Republik Indonesia. Beliau memiliki latar belakang sebagai pengusaha sukses dan pernah menjabat sebagai Wakil Gubernur DKI Jakarta.',
                'order' => 1,
            ],
            [
                'name' => 'Angela Tanoesoedibjo',
                'position' => 'Wakil Menteri Pariwisata dan Ekonomi Kreatif',
                'photo' => 'pimpinan/wamenpar.jpg',
                'biography' => 'Angela Tanoesoedibjo adalah Wakil Menteri Pariwisata dan Ekonomi Kreatif. Sebelumnya beliau aktif di dunia media dan bisnis keluarga.',
                'order' => 2,
            ],
            [
                'name' => 'Prof. Dr. Ir. Mochammad Ahkmadi, M.Sc.',
                'position' => 'Sekretaris Kementerian',
                'photo' => 'pimpinan/sekmen.jpg',
                'biography' => 'Sekretaris Kementerian Pariwisata dan Ekonomi Kreatif yang bertanggung jawab atas koordinasi administrasi kementerian.',
                'order' => 3,
            ],
            [
                'name' => 'Dr. Rizky Handayani, M.Si.',
                'position' => 'Deputi Bidang Ekonomi Digital dan Produk Kreatif',
                'photo' => 'pimpinan/deputi-1.jpg',
                'biography' => 'Deputi yang membidangi pengembangan ekonomi digital dan produk-produk kreatif Indonesia.',
                'order' => 4,
            ],
            [
                'name' => 'Dr. Budi Santoso, M.M.',
                'position' => 'Deputi Bidang Sumber Daya dan Kelembagaan',
                'photo' => 'pimpinan/deputi-2.jpg',
                'biography' => 'Deputi yang bertanggung jawab atas pengembangan sumber daya manusia dan kelembagaan ekonomi kreatif.',
                'order' => 5,
            ],
        ];

        foreach ($profilPimpinans as $profilPimpinan) {
            ProfilPimpinan::create($profilPimpinan);
        }
    }
}
