<?php

namespace Database\Seeders;

use App\Models\EventFestival;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EventFestivalSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'nama'            => 'Festival Ekonomi Kreatif Bontang 2026',
                'slug'            => 'festival-ekraf-bontang-2026',
                'deskripsi'       => 'Festival tahunan ekonomi kreatif Kota Bontang yang menampilkan pameran produk UMKM, pertunjukan seni, kuliner khas, dan workshop interaktif.',
                'tanggal_mulai'   => Carbon::now()->addDays(60)->setHour(8),
                'tanggal_selesai' => Carbon::now()->addDays(62)->setHour(21),
                'lokasi'          => 'Gedung Serbaguna Taman Rindang & Area Taman Kota',
                'thumbnail'       => null,
                'images'          => ['fest-ekraf-1.jpg', 'fest-ekraf-2.jpg'],
                'kategori'        => 'festival_budaya',
                'penyelenggara'   => 'Dispoparekraf Kota Bontang',
                'kontak'          => '08115555001',
                'website'         => 'https://festaekraf.bontang.go.id',
                'harga_tiket'     => 0,
                'is_published'    => true,
            ],
            [
                'nama'            => 'Pameran Produk Unggulan Bontang',
                'slug'            => 'pameran-produk-unggulan-bontang',
                'deskripsi'       => 'Pameran produk unggulan UMKM Bontang dari berbagai subsektor ekonomi kreatif. Tersedia booth gratis bagi pelaku UMKM terdaftar.',
                'tanggal_mulai'   => Carbon::now()->addDays(30)->setHour(9),
                'tanggal_selesai' => Carbon::now()->addDays(32)->setHour(20),
                'lokasi'          => 'Mall Bontang City Center',
                'thumbnail'       => null,
                'images'          => ['pameran-1.jpg'],
                'kategori'        => 'pameran',
                'penyelenggara'   => 'Dinas Koperasi & UMKM Bontang',
                'kontak'          => '08115555002',
                'website'         => null,
                'harga_tiket'     => 0,
                'is_published'    => true,
            ],
            [
                'nama'            => 'Lomba Desain Logo Bontang Creative',
                'slug'            => 'lomba-desain-logo-bontang-creative',
                'deskripsi'       => 'Kompetisi terbuka untuk mendesain logo brand "Bontang Creative" yang akan digunakan sebagai identitas produk kreatif kota.',
                'tanggal_mulai'   => Carbon::now()->addDays(20)->setHour(0),
                'tanggal_selesai' => Carbon::now()->addDays(50)->setHour(23)->setMinute(59),
                'lokasi'          => 'Online',
                'thumbnail'       => null,
                'images'          => null,
                'kategori'        => 'kompetisi',
                'penyelenggara'   => 'Dispoparekraf Kota Bontang',
                'kontak'          => '08115555003',
                'website'         => 'https://bontangcreative.id/lomba',
                'harga_tiket'     => 0,
                'is_published'    => true,
            ],
            [
                'nama'            => 'Konser Musik Pesisir',
                'slug'            => 'konser-musik-pesisir',
                'deskripsi'       => 'Pertunjukan musik live di tepi pantai Bontang menampilkan musisi lokal dan band indie Kalimantan Timur.',
                'tanggal_mulai'   => Carbon::now()->addDays(45)->setHour(18),
                'tanggal_selesai' => Carbon::now()->addDays(45)->setHour(23),
                'lokasi'          => 'Pantai Marina Bontang',
                'thumbnail'       => null,
                'images'          => ['konser-1.jpg', 'konser-2.jpg'],
                'kategori'        => 'konser',
                'penyelenggara'   => 'Komunitas Musik Bontang',
                'kontak'          => '08115555004',
                'website'         => null,
                'harga_tiket'     => 50000,
                'is_published'    => true,
            ],
            [
                'nama'            => 'Bazaar Kuliner Nusantara Bontang',
                'slug'            => 'bazaar-kuliner-nusantara-bontang',
                'deskripsi'       => 'Bazaar kuliner dengan 50+ tenant dari berbagai daerah di Indonesia. Tersedia live cooking demo dan lomba masak.',
                'tanggal_mulai'   => Carbon::now()->addDays(25)->setHour(10),
                'tanggal_selesai' => Carbon::now()->addDays(27)->setHour(22),
                'lokasi'          => 'Pusat Kuliner Bontang',
                'thumbnail'       => null,
                'images'          => null,
                'kategori'        => 'bazaar',
                'penyelenggara'   => 'Asosiasi Kuliner Bontang',
                'kontak'          => '08115555005',
                'website'         => null,
                'harga_tiket'     => 10000,
                'is_published'    => true,
            ],
            [
                'nama'            => 'Seminar Peluang Ekspor Produk Ekraf',
                'slug'            => 'seminar-peluang-ekspor-produk-ekraf',
                'deskripsi'       => 'Seminar nasional tentang peluang ekspor produk ekonomi kreatif dari Kalimantan Timur ke pasar ASEAN dan global.',
                'tanggal_mulai'   => Carbon::now()->subDays(3)->setHour(9),
                'tanggal_selesai' => Carbon::now()->subDays(3)->setHour(16),
                'lokasi'          => 'Hotel Grand Bontang',
                'thumbnail'       => null,
                'images'          => ['seminar-ekspor-1.jpg'],
                'kategori'        => 'seminar',
                'penyelenggara'   => 'Kemenparekraf RI & Dispoparekraf Bontang',
                'kontak'          => '08115555006',
                'website'         => null,
                'harga_tiket'     => 0,
                'is_published'    => true,
            ],
        ];

        foreach ($events as $event) {
            EventFestival::create($event);
        }
    }
}
