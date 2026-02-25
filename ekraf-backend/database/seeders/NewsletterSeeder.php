<?php

namespace Database\Seeders;

use App\Models\Newsletter;
use Illuminate\Database\Seeder;

class NewsletterSeeder extends Seeder
{
    public function run(): void
    {
        $newsletters = [
            [
                'title' => 'Newsletter EKRAF Edisi Januari 2024',
                'content' => 'Rangkuman kegiatan dan perkembangan ekonomi kreatif Indonesia selama bulan Januari 2024.',
                'date' => '2024-01-31',
                'thumbnail' => 'newsletter/newsletter-1.jpg',
                'pdf_url' => 'newsletter/newsletter-januari-2024.pdf',
                'is_published' => true,
            ],
            [
                'title' => 'Newsletter EKRAF Edisi Februari 2024',
                'content' => 'Rangkuman kegiatan dan perkembangan ekonomi kreatif Indonesia selama bulan Februari 2024.',
                'date' => '2024-02-29',
                'thumbnail' => 'newsletter/newsletter-2.jpg',
                'pdf_url' => 'newsletter/newsletter-februari-2024.pdf',
                'is_published' => true,
            ],
            [
                'title' => 'Newsletter EKRAF Edisi Maret 2024',
                'content' => 'Rangkuman kegiatan dan perkembangan ekonomi kreatif Indonesia selama bulan Maret 2024.',
                'date' => '2024-03-31',
                'thumbnail' => 'newsletter/newsletter-3.jpg',
                'pdf_url' => 'newsletter/newsletter-maret-2024.pdf',
                'is_published' => true,
            ],
            [
                'title' => 'Newsletter EKRAF Edisi April 2024',
                'content' => 'Rangkuman kegiatan dan perkembangan ekonomi kreatif Indonesia selama bulan April 2024.',
                'date' => '2024-04-30',
                'thumbnail' => 'newsletter/newsletter-4.jpg',
                'pdf_url' => 'newsletter/newsletter-april-2024.pdf',
                'is_published' => true,
            ],
            [
                'title' => 'Newsletter EKRAF Edisi Mei 2024',
                'content' => 'Rangkuman kegiatan dan perkembangan ekonomi kreatif Indonesia selama bulan Mei 2024.',
                'date' => '2024-05-31',
                'thumbnail' => 'newsletter/newsletter-5.jpg',
                'pdf_url' => 'newsletter/newsletter-mei-2024.pdf',
                'is_published' => true,
            ],
        ];

        foreach ($newsletters as $newsletter) {
            Newsletter::create($newsletter);
        }
    }
}
