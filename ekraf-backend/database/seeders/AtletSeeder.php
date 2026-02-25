<?php

namespace Database\Seeders;

use App\Models\Atlet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AtletSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'nama'             => 'Ahmad Fauzan',
                'slug'             => 'ahmad-fauzan',
                'nik'              => '6474010101950001',
                'tanggal_lahir'    => Carbon::create(1995, 1, 1),
                'jenis_kelamin'    => 'L',
                'cabang_olahraga'  => 'Sepak Bola',
                'klub'             => 'PS Bontang FC',
                'foto'             => null,
                'alamat'           => 'Jl. Letjen S. Parman No. 10, Bontang Selatan',
                'no_telp'          => '08115560201',
                'prestasi'         => ['Juara 1 Liga Kaltim 2024', 'Top Scorer Piala Walikota 2023'],
                'status'           => 'aktif',
            ],
            [
                'nama'             => 'Siti Nurhaliza',
                'slug'             => 'siti-nurhaliza',
                'nik'              => '6474026503980002',
                'tanggal_lahir'    => Carbon::create(1998, 3, 25),
                'jenis_kelamin'    => 'P',
                'cabang_olahraga'  => 'Bulutangkis',
                'klub'             => 'PB Bontang Jaya',
                'foto'             => null,
                'alamat'           => 'Jl. Brigjend Katamso, Bontang Utara',
                'no_telp'          => '08115560202',
                'prestasi'         => ['Medali Emas PORPROV Kaltim 2024', 'Juara 2 Kejurda Bulutangkis 2023'],
                'status'           => 'aktif',
            ],
            [
                'nama'             => 'Reza Mahendra',
                'slug'             => 'reza-mahendra',
                'nik'              => '6474011207970003',
                'tanggal_lahir'    => Carbon::create(1997, 7, 12),
                'jenis_kelamin'    => 'L',
                'cabang_olahraga'  => 'Renang',
                'klub'             => 'Bontang Aquatic Club',
                'foto'             => null,
                'alamat'           => 'Kel. Tanjung Laut, Bontang Selatan',
                'no_telp'          => '08115560203',
                'prestasi'         => ['Rekor 100m Gaya Bebas Kaltim 2025', 'Peserta PON XXI Aceh-Sumut 2024'],
                'status'           => 'aktif',
            ],
            [
                'nama'             => 'Dewi Anggraini',
                'slug'             => 'dewi-anggraini',
                'nik'              => '6474024408000004',
                'tanggal_lahir'    => Carbon::create(2000, 8, 4),
                'jenis_kelamin'    => 'P',
                'cabang_olahraga'  => 'Atletik',
                'klub'             => 'Atletik Bontang',
                'foto'             => null,
                'alamat'           => 'Jl. Ir. H. Juanda, Bontang Lestari',
                'no_telp'          => '08115560204',
                'prestasi'         => ['Juara 3 Lari 1500m PORPROV 2024'],
                'status'           => 'aktif',
            ],
            [
                'nama'             => 'Mario Valentino',
                'slug'             => 'mario-valentino',
                'nik'              => '6474010505920005',
                'tanggal_lahir'    => Carbon::create(1992, 5, 5),
                'jenis_kelamin'    => 'L',
                'cabang_olahraga'  => 'Tinju',
                'klub'             => 'Sasana Tinju Bontang',
                'foto'             => null,
                'alamat'           => 'Kel. Berbas Tengah, Bontang Selatan',
                'no_telp'          => '08115560205',
                'prestasi'         => ['Juara 1 Kelas Welter Kejurnas 2022', 'Medali Perak PON XX Papua 2021'],
                'status'           => 'pensiun',
            ],
            [
                'nama'             => 'Putri Ramadhani',
                'slug'             => 'putri-ramadhani',
                'nik'              => '6474022201010006',
                'tanggal_lahir'    => Carbon::create(2001, 1, 22),
                'jenis_kelamin'    => 'P',
                'cabang_olahraga'  => 'Karate',
                'klub'             => 'Dojo Bontang Karate',
                'foto'             => null,
                'alamat'           => 'Jl. Awang Long No. 15, Bontang Utara',
                'no_telp'          => '08115560206',
                'prestasi'         => ['Juara 1 Kata Perorangan Kejurda 2025', 'Peserta SEA Games 2025'],
                'status'           => 'aktif',
            ],
        ];

        foreach ($items as $item) {
            Atlet::create($item);
        }
    }
}
