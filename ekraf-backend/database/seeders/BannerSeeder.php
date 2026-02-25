<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'title' => 'Selamat Datang di Portal EKRAF',
                'description' => 'Portal Informasi Ekonomi Kreatif Indonesia',
                'image_url' => 'banners/banner-1.jpg',
                'link_url' => '/tentang',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Program Bantuan UMKM Kreatif',
                'description' => 'Daftar sekarang untuk mendapatkan bantuan',
                'image_url' => 'banners/banner-2.jpg',
                'link_url' => '/program-bantuan',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Festival Ekonomi Kreatif 2024',
                'description' => 'Ikuti berbagai kegiatan menarik',
                'image_url' => 'banners/banner-3.jpg',
                'link_url' => '/event',
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::create($banner);
        }
    }
}
