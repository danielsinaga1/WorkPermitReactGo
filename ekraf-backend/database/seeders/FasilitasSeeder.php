<?php

namespace Database\Seeders;

use App\Models\Fasilitas;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FasilitasSeeder extends Seeder
{
    public function run(): void
    {
        $pengelola = User::where('role', 'pengelola')->first();

        $fasilitas = [
            [
                'nama'             => 'Gedung Serbaguna Taman Rindang',
                'slug'             => 'gedung-serbaguna-taman-rindang',
                'jenis'            => 'gedung',
                'deskripsi'        => 'Gedung serbaguna milik Pemerintah Kota Bontang yang dapat digunakan untuk acara budaya, seminar, pameran, dan kegiatan kemasyarakatan.',
                'alamat'           => 'Jl. Jend. Sudirman No. 12, Bontang Utara, Kota Bontang',
                'latitude'         => 0.1235,
                'longitude'        => 117.4890,
                'kapasitas'        => 500,
                'thumbnail'        => null,
                'images'           => ['gedung-1a.jpg', 'gedung-1b.jpg'],
                'fasilitas_detail' => ['AC', 'Sound System', 'Proyektor', 'Panggung', 'Toilet', 'Parkir Luas'],
                'pengelola_id'     => $pengelola?->id,
                'is_active'        => true,
            ],
            [
                'nama'             => 'Stadion Bontang',
                'slug'             => 'stadion-bontang',
                'jenis'            => 'stadion',
                'deskripsi'        => 'Stadion utama Kota Bontang untuk pertandingan olahraga, festival, dan event besar kota.',
                'alamat'           => 'Jl. Awang Long No. 5, Bontang Selatan, Kota Bontang',
                'latitude'         => 0.1180,
                'longitude'        => 117.4720,
                'kapasitas'        => 10000,
                'thumbnail'        => null,
                'images'           => ['stadion-1a.jpg', 'stadion-1b.jpg'],
                'fasilitas_detail' => ['Tribun', 'Lampu Sorot', 'Lapangan Rumput', 'Ruang Ganti', 'Toilet', 'Parkir'],
                'pengelola_id'     => $pengelola?->id,
                'is_active'        => true,
            ],
            [
                'nama'             => 'Lapangan Futsal Bintang Sport',
                'slug'             => 'lapangan-futsal-bintang-sport',
                'jenis'            => 'lapangan',
                'deskripsi'        => 'Lapangan futsal berstandar dengan rumput sintetis yang nyaman untuk pertandingan dan latihan.',
                'alamat'           => 'Jl. KH. Ahmad Dahlan No. 22, Bontang Baru',
                'latitude'         => 0.1290,
                'longitude'        => 117.5010,
                'kapasitas'        => 100,
                'thumbnail'        => null,
                'images'           => ['futsal-1a.jpg'],
                'fasilitas_detail' => ['Rumput Sintetis', 'Lampu', 'Toilet', 'Kantin'],
                'pengelola_id'     => $pengelola?->id,
                'is_active'        => true,
            ],
            [
                'nama'             => 'Kolam Renang Tirta Mandiri',
                'slug'             => 'kolam-renang-tirta-mandiri',
                'jenis'            => 'kolam_renang',
                'deskripsi'        => 'Kolam renang umum dengan fasilitas lengkap, cocok untuk rekreasi keluarga dan latihan berenang.',
                'alamat'           => 'Jl. Moh. Roem No. 8, Bontang Utara',
                'latitude'         => 0.1310,
                'longitude'        => 117.4950,
                'kapasitas'        => 200,
                'thumbnail'        => null,
                'images'           => ['kolam-1a.jpg'],
                'fasilitas_detail' => ['Kolam Dewasa', 'Kolam Anak', 'Toilet', 'Ruang Ganti', 'Gazebo'],
                'pengelola_id'     => $pengelola?->id,
                'is_active'        => true,
            ],
            [
                'nama'             => 'GOR Bontang Lestari',
                'slug'             => 'gor-bontang-lestari',
                'jenis'            => 'gor',
                'deskripsi'        => 'Gelanggang Olahraga untuk badminton, basket, voli, dan berbagai cabang olahraga indoor.',
                'alamat'           => 'Jl. Ir. Sutami No. 15, Bontang Selatan',
                'latitude'         => 0.1150,
                'longitude'        => 117.4780,
                'kapasitas'        => 1500,
                'thumbnail'        => null,
                'images'           => ['gor-1a.jpg', 'gor-1b.jpg'],
                'fasilitas_detail' => ['Lapangan Indoor', 'Tribun', 'AC', 'Toilet', 'Ruang Ganti', 'Kantin'],
                'pengelola_id'     => $pengelola?->id,
                'is_active'        => true,
            ],
            [
                'nama'             => 'Aula Kantor Dispora',
                'slug'             => 'aula-kantor-dispora',
                'jenis'            => 'gedung',
                'deskripsi'        => 'Aula milik Dinas Pemuda, Olahraga, Pariwisata dan Ekonomi Kreatif Kota Bontang untuk rapat dan seminar.',
                'alamat'           => 'Jl. Bessai Berinta No. 1, Bontang Utara',
                'latitude'         => 0.1265,
                'longitude'        => 117.4860,
                'kapasitas'        => 150,
                'thumbnail'        => null,
                'images'           => ['aula-1a.jpg'],
                'fasilitas_detail' => ['AC', 'Proyektor', 'Sound System', 'WiFi', 'Toilet'],
                'pengelola_id'     => $pengelola?->id,
                'is_active'        => true,
            ],
        ];

        foreach ($fasilitas as $f) {
            Fasilitas::create($f);
        }
    }
}
