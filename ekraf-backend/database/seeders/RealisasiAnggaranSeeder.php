<?php

namespace Database\Seeders;

use App\Models\RealisasiAnggaran;
use Illuminate\Database\Seeder;

class RealisasiAnggaranSeeder extends Seeder
{
    public function run(): void
    {
        $realisasiAnggarans = [
            // 2024
            [
                'tahun' => 2024,
                'program' => 'Program Pengembangan Ekonomi Kreatif',
                'anggaran' => 500000000000,
                'realisasi' => 125000000000,
                'persentase' => 25.00,
            ],
            [
                'tahun' => 2024,
                'program' => 'Program Pengembangan Destinasi Wisata',
                'anggaran' => 750000000000,
                'realisasi' => 187500000000,
                'persentase' => 25.00,
            ],
            [
                'tahun' => 2024,
                'program' => 'Program Pemasaran Pariwisata',
                'anggaran' => 300000000000,
                'realisasi' => 75000000000,
                'persentase' => 25.00,
            ],
            [
                'tahun' => 2024,
                'program' => 'Program Dukungan Manajemen',
                'anggaran' => 200000000000,
                'realisasi' => 50000000000,
                'persentase' => 25.00,
            ],
            // 2023
            [
                'tahun' => 2023,
                'program' => 'Program Pengembangan Ekonomi Kreatif',
                'anggaran' => 450000000000,
                'realisasi' => 427500000000,
                'persentase' => 95.00,
            ],
            [
                'tahun' => 2023,
                'program' => 'Program Pengembangan Destinasi Wisata',
                'anggaran' => 680000000000,
                'realisasi' => 646000000000,
                'persentase' => 95.00,
            ],
            [
                'tahun' => 2023,
                'program' => 'Program Pemasaran Pariwisata',
                'anggaran' => 280000000000,
                'realisasi' => 266000000000,
                'persentase' => 95.00,
            ],
            [
                'tahun' => 2023,
                'program' => 'Program Dukungan Manajemen',
                'anggaran' => 180000000000,
                'realisasi' => 171000000000,
                'persentase' => 95.00,
            ],
            // 2022
            [
                'tahun' => 2022,
                'program' => 'Program Pengembangan Ekonomi Kreatif',
                'anggaran' => 400000000000,
                'realisasi' => 376000000000,
                'persentase' => 94.00,
            ],
            [
                'tahun' => 2022,
                'program' => 'Program Pengembangan Destinasi Wisata',
                'anggaran' => 600000000000,
                'realisasi' => 564000000000,
                'persentase' => 94.00,
            ],
        ];

        foreach ($realisasiAnggarans as $realisasiAnggaran) {
            RealisasiAnggaran::create($realisasiAnggaran);
        }
    }
}
