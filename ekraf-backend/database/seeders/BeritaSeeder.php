<?php

namespace Database\Seeders;

use App\Models\Berita;
use App\Models\User;
use Illuminate\Database\Seeder;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        if (!$admin) {
            return;
        }

        $beritas = [
            [
                'author_id' => $admin->id,
                'title' => 'Perkembangan Ekonomi Kreatif di Indonesia Tahun 2024',
                'content' => 'Ekonomi kreatif Indonesia terus menunjukkan pertumbuhan yang signifikan. Sektor ini berkontribusi besar terhadap PDB nasional dan menciptakan jutaan lapangan kerja.',
                'date' => '2024-01-15',
                'thumbnail' => 'berita/berita-1.jpg',
                'images' => ['berita/berita-1-1.jpg', 'berita/berita-1-2.jpg'],
                'descriptions' => ['Gambar pertama', 'Gambar kedua'],
                'is_published' => true,
            ],
            [
                'author_id' => $admin->id,
                'title' => 'Peluncuran Program UMKM Digital',
                'content' => 'Pemerintah meluncurkan program digitalisasi UMKM untuk meningkatkan daya saing pelaku ekonomi kreatif di pasar global.',
                'date' => '2024-01-20',
                'thumbnail' => 'berita/berita-2.jpg',
                'images' => ['berita/berita-2-1.jpg'],
                'descriptions' => ['Dokumentasi peluncuran'],
                'is_published' => true,
            ],
            [
                'author_id' => $admin->id,
                'title' => 'Kolaborasi Internasional Sektor Kreatif',
                'content' => 'Indonesia menjalin kerja sama dengan berbagai negara untuk mengembangkan sektor ekonomi kreatif.',
                'date' => '2024-02-01',
                'thumbnail' => 'berita/berita-3.jpg',
                'images' => [],
                'descriptions' => [],
                'is_published' => true,
            ],
            [
                'author_id' => $admin->id,
                'title' => 'Workshop Pengembangan Produk Kreatif',
                'content' => 'Workshop ini bertujuan untuk meningkatkan kualitas produk kreatif Indonesia agar mampu bersaing di pasar internasional.',
                'date' => '2024-02-10',
                'thumbnail' => 'berita/berita-4.jpg',
                'images' => ['berita/berita-4-1.jpg', 'berita/berita-4-2.jpg', 'berita/berita-4-3.jpg'],
                'descriptions' => ['Workshop hari pertama', 'Sesi diskusi', 'Foto bersama peserta'],
                'is_published' => true,
            ],
            [
                'author_id' => $admin->id,
                'title' => 'Prestasi Desainer Indonesia di Kancah Global',
                'content' => 'Desainer Indonesia berhasil meraih penghargaan bergengsi di ajang fashion week internasional.',
                'date' => '2024-02-15',
                'thumbnail' => 'berita/berita-5.jpg',
                'images' => [],
                'descriptions' => [],
                'is_published' => true,
            ],
        ];

        foreach ($beritas as $berita) {
            Berita::create($berita);
        }
    }
}
