<?php

namespace Database\Seeders;

use App\Models\Haki;
use App\Models\PelakuEkraf;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class HakiSeeder extends Seeder
{
    public function run(): void
    {
        $pelakuEkrafs = PelakuEkraf::all();
        if ($pelakuEkrafs->isEmpty()) {
            return;
        }

        $user = User::first();
        $userId = $user?->id;

        $items = [
            [
                'user_id'              => $userId,
                'pelaku_ekraf_id'      => $pelakuEkrafs->where('slug', 'ibu-fatimah')->first()?->id ?? $pelakuEkrafs->first()->id,
                'nama_produk'          => 'Batik Motif Mangrove Bontang',
                'slug'                 => 'batik-motif-mangrove-bontang',
                'jenis_haki'           => 'hak_cipta',
                'nomor_permohonan'     => 'HC-2024-BTG-0001',
                'nomor_sertifikat'     => 'EC00202400001',
                'tanggal_permohonan'   => Carbon::create(2024, 3, 15),
                'tanggal_terbit'       => Carbon::create(2024, 8, 20),
                'file_sertifikat'      => null,
                'file_permohonan'      => null,
                'deskripsi'            => 'Hak cipta atas desain motif batik mangrove khas pesisir Bontang dengan kombinasi warna biru laut dan hijau hutan.',
                'status'               => 'terdaftar',
                'catatan'              => 'Sertifikat sudah diterima.',
            ],
            [
                'user_id'              => $userId,
                'pelaku_ekraf_id'      => $pelakuEkrafs->where('slug', 'pak-hendra-wijaya')->first()?->id ?? $pelakuEkrafs->first()->id,
                'nama_produk'          => 'Bontang Coffee',
                'slug'                 => 'bontang-coffee',
                'jenis_haki'           => 'merek',
                'nomor_permohonan'     => 'MK-2024-BTG-0002',
                'nomor_sertifikat'     => 'IDM000987654',
                'tanggal_permohonan'   => Carbon::create(2024, 1, 10),
                'tanggal_terbit'       => Carbon::create(2024, 12, 5),
                'file_sertifikat'      => null,
                'file_permohonan'      => null,
                'deskripsi'            => 'Pendaftaran merek dagang "Bontang Coffee" untuk kelas barang 30 (kopi, teh, dan sejenisnya).',
                'status'               => 'terdaftar',
                'catatan'              => null,
            ],
            [
                'user_id'              => $userId,
                'pelaku_ekraf_id'      => $pelakuEkrafs->where('slug', 'nurul-hidayah')->first()?->id ?? $pelakuEkrafs->first()->id,
                'nama_produk'          => 'Kerupuk Ikan Cap Bontang',
                'slug'                 => 'kerupuk-ikan-cap-bontang',
                'jenis_haki'           => 'merek',
                'nomor_permohonan'     => 'MK-2025-BTG-0003',
                'nomor_sertifikat'     => null,
                'tanggal_permohonan'   => Carbon::create(2025, 6, 1),
                'tanggal_terbit'       => null,
                'file_sertifikat'      => null,
                'file_permohonan'      => null,
                'deskripsi'            => 'Permohonan merek dagang "Kerupuk Ikan Cap Bontang" untuk kelas barang 29 (ikan olahan, kerupuk).',
                'status'               => 'proses',
                'catatan'              => 'Sedang dalam pemeriksaan substantif oleh DJKI.',
            ],
            [
                'user_id'              => $userId,
                'pelaku_ekraf_id'      => $pelakuEkrafs->where('slug', 'ibu-fatimah')->first()?->id ?? $pelakuEkrafs->first()->id,
                'nama_produk'          => 'Kemasan Batik Gift Box Pesisir',
                'slug'                 => 'kemasan-batik-gift-box-pesisir',
                'jenis_haki'           => 'desain_industri',
                'nomor_permohonan'     => 'DI-2025-BTG-0004',
                'nomor_sertifikat'     => null,
                'tanggal_permohonan'   => Carbon::create(2025, 9, 10),
                'tanggal_terbit'       => null,
                'file_sertifikat'      => null,
                'file_permohonan'      => null,
                'deskripsi'            => 'Desain kemasan gift box untuk produk batik pesisir Bontang berbentuk kotak kayu bermotif gelombang.',
                'status'               => 'diajukan',
                'catatan'              => 'Dokumen sudah dikirim ke DJKI.',
            ],
            [
                'user_id'              => $userId,
                'pelaku_ekraf_id'      => $pelakuEkrafs->where('slug', 'agus-salim')->first()?->id ?? $pelakuEkrafs->first()->id,
                'nama_produk'          => 'Amplang Bontang',
                'slug'                 => 'amplang-bontang-ig',
                'jenis_haki'           => 'indikasi_geografis',
                'nomor_permohonan'     => 'IG-2025-BTG-0005',
                'nomor_sertifikat'     => null,
                'tanggal_permohonan'   => Carbon::create(2025, 4, 20),
                'tanggal_terbit'       => null,
                'file_sertifikat'      => null,
                'file_permohonan'      => null,
                'deskripsi'            => 'Pengajuan indikasi geografis untuk produk amplang (kerupuk ikan) khas Kota Bontang sebagai identitas produk lokal.',
                'status'               => 'proses',
                'catatan'              => 'Koordinasi dengan Pemda Bontang untuk dokumen pendukung.',
            ],
        ];

        foreach ($items as $item) {
            Haki::create($item);
        }
    }
}
