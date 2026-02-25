<?php

namespace Database\Seeders;

use App\Models\Pelatih;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PelatihSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'nama'             => 'H. Syamsul Bahri, S.Pd.',
                'slug'             => 'h-syamsul-bahri',
                'nik'              => '6474011501750001',
                'tanggal_lahir'    => Carbon::create(1975, 1, 15),
                'jenis_kelamin'    => 'L',
                'cabang_olahraga'  => 'Sepak Bola',
                'lisensi'          => 'Lisensi C AFC',
                'foto'             => null,
                'alamat'           => 'Jl. Letjen S. Parman No. 45, Bontang Selatan',
                'no_telp'          => '08115570301',
                'pengalaman'       => ['Pelatih Kepala PS Bontang FC (2020-sekarang)', 'Asisten Pelatih Borneo FC U-17 (2018-2020)', 'Pelatih SSB Bontang Putra (2015-2018)'],
                'status'           => 'aktif',
            ],
            [
                'nama'             => 'Ir. Lina Marlina',
                'slug'             => 'ir-lina-marlina',
                'nik'              => '6474024012800002',
                'tanggal_lahir'    => Carbon::create(1980, 12, 10),
                'jenis_kelamin'    => 'P',
                'cabang_olahraga'  => 'Bulutangkis',
                'lisensi'          => 'Lisensi PBSI Level 2',
                'foto'             => null,
                'alamat'           => 'Perumahan Bontang Lestari Blok C-12',
                'no_telp'          => '08115570302',
                'pengalaman'       => ['Pelatih PB Bontang Jaya (2019-sekarang)', 'Mantan atlet nasional bulutangkis (2000-2012)', 'Pelatih tim Kaltim PORPROV 2022, 2024'],
                'status'           => 'aktif',
            ],
            [
                'nama'             => 'Andi Pratama, S.Or.',
                'slug'             => 'andi-pratama',
                'nik'              => '6474010806850003',
                'tanggal_lahir'    => Carbon::create(1985, 6, 8),
                'jenis_kelamin'    => 'L',
                'cabang_olahraga'  => 'Renang',
                'lisensi'          => 'Lisensi Pelatih PRSI Nasional',
                'foto'             => null,
                'alamat'           => 'Jl. MT Haryono No. 28, Bontang Utara',
                'no_telp'          => '08115570303',
                'pengalaman'       => ['Pelatih Bontang Aquatic Club (2017-sekarang)', 'Tim pelatih renang Kaltim di PON XX Papua 2021', 'Mantan atlet renang Kaltim (2003-2015)'],
                'status'           => 'aktif',
            ],
            [
                'nama'             => 'Dr. Bambang Sutrisno',
                'slug'             => 'dr-bambang-sutrisno',
                'nik'              => '6474012303700004',
                'tanggal_lahir'    => Carbon::create(1970, 3, 23),
                'jenis_kelamin'    => 'L',
                'cabang_olahraga'  => 'Atletik',
                'lisensi'          => 'Lisensi PASI Level 3',
                'foto'             => null,
                'alamat'           => 'Jl. Ir. H. Juanda No. 50, Bontang Selatan',
                'no_telp'          => '08115570304',
                'pengalaman'       => ['Pelatih Atletik Kota Bontang (2010-sekarang)', 'Dosen Pendidikan Jasmani Universitas Bontang', 'Pelatih tim atletik Kaltim PORPROV 2024'],
                'status'           => 'aktif',
            ],
            [
                'nama'             => 'Sensei Takeshi Yamamoto',
                'slug'             => 'sensei-takeshi-yamamoto',
                'nik'              => '6474011009780005',
                'tanggal_lahir'    => Carbon::create(1978, 9, 10),
                'jenis_kelamin'    => 'L',
                'cabang_olahraga'  => 'Karate',
                'lisensi'          => 'Dan 5 JKF / Lisensi FORKI Nasional',
                'foto'             => null,
                'alamat'           => 'Jl. Awang Long No. 15, Bontang Utara',
                'no_telp'          => '08115570305',
                'pengalaman'       => ['Kepala Pelatih Dojo Bontang Karate (2012-sekarang)', 'Pelatih tim nasional karate junior 2016-2018', 'Mantan atlet karate nasional Jepang'],
                'status'           => 'aktif',
            ],
        ];

        foreach ($items as $item) {
            Pelatih::create($item);
        }
    }
}
