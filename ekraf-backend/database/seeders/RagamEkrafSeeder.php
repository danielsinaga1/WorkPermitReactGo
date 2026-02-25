<?php

namespace Database\Seeders;

use App\Models\RagamEkraf;
use App\Models\Subsektor;
use Illuminate\Database\Seeder;

class RagamEkrafSeeder extends Seeder
{
    public function run(): void
    {
        $subsektors = Subsektor::all();

        if ($subsektors->isEmpty()) {
            return;
        }

        $ragamEkrafs = [
            [
                'subsektor_id' => $subsektors->where('name', 'Kuliner')->first()?->id,
                'title' => 'Warung Kopi Tradisional yang Go Digital',
                'content' => 'Kisah sukses warung kopi tradisional yang bertransformasi digital dan berhasil menembus pasar ekspor.',
                'date' => '2024-01-20',
                'thumbnail' => 'ragam-ekraf/ragam-1.jpg',
                'is_published' => true,
            ],
            [
                'subsektor_id' => $subsektors->where('name', 'Fesyen')->first()?->id,
                'title' => 'Batik Modern untuk Generasi Milenial',
                'content' => 'Inovasi batik dengan desain modern yang diminati oleh generasi muda.',
                'date' => '2024-02-05',
                'thumbnail' => 'ragam-ekraf/ragam-2.jpg',
                'is_published' => true,
            ],
            [
                'subsektor_id' => $subsektors->where('name', 'Kriya')->first()?->id,
                'title' => 'Kerajinan Rotan Kalimantan Mendunia',
                'content' => 'Produk kerajinan rotan dari Kalimantan yang berhasil menembus pasar Eropa dan Amerika.',
                'date' => '2024-02-15',
                'thumbnail' => 'ragam-ekraf/ragam-3.jpg',
                'is_published' => true,
            ],
            [
                'subsektor_id' => $subsektors->where('name', 'Film, Animasi & Video')->first()?->id,
                'title' => 'Animator Indonesia di Hollywood',
                'content' => 'Perjalanan karir animator Indonesia yang berhasil bekerja di studio animasi ternama Hollywood.',
                'date' => '2024-03-01',
                'thumbnail' => 'ragam-ekraf/ragam-4.jpg',
                'is_published' => true,
            ],
            [
                'subsektor_id' => $subsektors->where('name', 'Musik')->first()?->id,
                'title' => 'Genre Musik Dangdut di Kancah Internasional',
                'content' => 'Perkembangan musik dangdut yang mulai dikenal di berbagai negara.',
                'date' => '2024-03-15',
                'thumbnail' => 'ragam-ekraf/ragam-5.jpg',
                'is_published' => true,
            ],
        ];

        foreach ($ragamEkrafs as $ragamEkraf) {
            RagamEkraf::create($ragamEkraf);
        }
    }
}
