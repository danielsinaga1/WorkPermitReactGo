<?php

namespace Database\Seeders;

use App\Models\Promosi;
use Illuminate\Database\Seeder;

class PromosiSeeder extends Seeder
{
    public function run(): void
    {
        $promosis = [
            [
                'title' => 'Festival Film Indonesia 2024',
                'content' => 'Festival Film Indonesia kembali digelar dengan menampilkan karya-karya terbaik sineas Indonesia. Hadiri dan saksikan premiere film-film unggulan.',
                'date' => '2024-03-15',
                'thumbnail' => 'promosi/promosi-1.jpg',
                'images' => ['promosi/promosi-1-1.jpg', 'promosi/promosi-1-2.jpg'],
                'is_published' => true,
            ],
            [
                'title' => 'Pameran Kriya Nusantara',
                'content' => 'Pameran kerajinan tangan dari berbagai daerah di Indonesia. Temukan produk-produk unik dan berkualitas.',
                'date' => '2024-04-01',
                'thumbnail' => 'promosi/promosi-2.jpg',
                'images' => ['promosi/promosi-2-1.jpg'],
                'is_published' => true,
            ],
            [
                'title' => 'Indonesia Fashion Week 2024',
                'content' => 'Event fashion terbesar di Indonesia yang menampilkan koleksi terbaru dari desainer ternama.',
                'date' => '2024-04-20',
                'thumbnail' => 'promosi/promosi-3.jpg',
                'images' => ['promosi/promosi-3-1.jpg', 'promosi/promosi-3-2.jpg', 'promosi/promosi-3-3.jpg'],
                'is_published' => true,
            ],
            [
                'title' => 'Konser Musik Tradisional',
                'content' => 'Nikmati pertunjukan musik tradisional dari berbagai daerah di Indonesia dalam satu panggung megah.',
                'date' => '2024-05-10',
                'thumbnail' => 'promosi/promosi-4.jpg',
                'images' => [],
                'is_published' => true,
            ],
            [
                'title' => 'Bazaar Kuliner Nusantara',
                'content' => 'Temukan berbagai kuliner khas dari seluruh nusantara dalam bazaar kuliner terbesar tahun ini.',
                'date' => '2024-05-25',
                'thumbnail' => 'promosi/promosi-5.jpg',
                'images' => ['promosi/promosi-5-1.jpg'],
                'is_published' => true,
            ],
        ];

        foreach ($promosis as $promosi) {
            Promosi::create($promosi);
        }
    }
}
