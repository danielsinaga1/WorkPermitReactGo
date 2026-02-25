<?php

namespace Database\Seeders;

use App\Models\OrgKegiatan;
use App\Models\Organisasi;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrgKegiatanSeeder extends Seeder
{
    public function run(): void
    {
        $organisasis = Organisasi::where('status', 'terverifikasi')->get();

        if ($organisasis->isEmpty()) {
            return;
        }

        $kegiatans = [
            [
                'judul'           => 'Pelatihan Kewirausahaan Pemuda',
                'deskripsi'       => 'Program pelatihan kewirausahaan bagi pemuda Bontang untuk mengembangkan usaha kreatif dan UMKM.',
                'tanggal_mulai'   => Carbon::now()->addDays(10)->setHour(8)->setMinute(0),
                'tanggal_selesai' => Carbon::now()->addDays(10)->setHour(16)->setMinute(0),
                'lokasi'          => 'Gedung Serbaguna Taman Rindang',
                'jenis'           => 'pelatihan',
                'peserta_target'  => 50,
                'thumbnail'       => null,
                'images'          => null,
                'status'          => 'disetujui',
                'is_published'    => true,
            ],
            [
                'judul'           => 'Bakti Sosial Bersih Pantai',
                'deskripsi'       => 'Kegiatan gotong royong membersihkan pesisir pantai Bontang bersama masyarakat.',
                'tanggal_mulai'   => Carbon::now()->addDays(15)->setHour(7)->setMinute(0),
                'tanggal_selesai' => Carbon::now()->addDays(15)->setHour(12)->setMinute(0),
                'lokasi'          => 'Pantai Marina Bontang',
                'jenis'           => 'bakti_sosial',
                'peserta_target'  => 100,
                'thumbnail'       => null,
                'images'          => null,
                'status'          => 'diajukan',
                'is_published'    => false,
            ],
            [
                'judul'           => 'Turnamen Voli antar Kelurahan',
                'deskripsi'       => 'Kompetisi bola voli antar kelurahan se-Kota Bontang dalam rangka memperingati Hari Sumpah Pemuda.',
                'tanggal_mulai'   => Carbon::now()->addDays(20)->setHour(8)->setMinute(0),
                'tanggal_selesai' => Carbon::now()->addDays(22)->setHour(17)->setMinute(0),
                'lokasi'          => 'GOR Bontang Lestari',
                'jenis'           => 'olahraga',
                'peserta_target'  => 200,
                'thumbnail'       => null,
                'images'          => null,
                'status'          => 'disetujui',
                'is_published'    => true,
            ],
            [
                'judul'           => 'Workshop Desain Grafis untuk UMKM',
                'deskripsi'       => 'Pelatihan desain grafis menggunakan Canva dan tools gratis untuk pelaku UMKM.',
                'tanggal_mulai'   => Carbon::now()->subDays(5)->setHour(9)->setMinute(0),
                'tanggal_selesai' => Carbon::now()->subDays(5)->setHour(15)->setMinute(0),
                'lokasi'          => 'Aula Kantor Dispora',
                'jenis'           => 'pelatihan',
                'peserta_target'  => 30,
                'thumbnail'       => null,
                'images'          => ['workshop-desain-1.jpg', 'workshop-desain-2.jpg'],
                'status'          => 'selesai',
                'is_published'    => true,
            ],
            [
                'judul'           => 'Rapat Koordinasi Pengurus Triwulan I',
                'deskripsi'       => 'Rapat koordinasi pengurus untuk evaluasi program kerja triwulan pertama tahun 2026.',
                'tanggal_mulai'   => Carbon::now()->subDays(15)->setHour(14)->setMinute(0),
                'tanggal_selesai' => Carbon::now()->subDays(15)->setHour(17)->setMinute(0),
                'lokasi'          => 'Sekretariat KTBB',
                'jenis'           => 'rapat',
                'peserta_target'  => 15,
                'thumbnail'       => null,
                'images'          => null,
                'status'          => 'selesai',
                'is_published'    => false,
            ],
            [
                'judul'           => 'Festival Seni Budaya Bontang',
                'deskripsi'       => 'Pameran dan pertunjukan seni budaya lokal Kalimantan Timur oleh pemuda kreatif Bontang.',
                'tanggal_mulai'   => Carbon::now()->addDays(30)->setHour(9)->setMinute(0),
                'tanggal_selesai' => Carbon::now()->addDays(32)->setHour(21)->setMinute(0),
                'lokasi'          => 'Gedung Serbaguna Taman Rindang',
                'jenis'           => 'kesenian',
                'peserta_target'  => 300,
                'thumbnail'       => null,
                'images'          => null,
                'status'          => 'draft',
                'is_published'    => false,
            ],
        ];

        $orgIdx = 0;
        foreach ($kegiatans as $kegiatan) {
            $kegiatan['organisasi_id'] = $organisasis[$orgIdx % count($organisasis)]->id;
            OrgKegiatan::create($kegiatan);
            $orgIdx++;
        }
    }
}
