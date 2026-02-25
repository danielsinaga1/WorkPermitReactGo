<?php

namespace Database\Seeders;

use App\Models\Organisasi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrganisasiSeeder extends Seeder
{
    public function run(): void
    {
        $adminOkp = User::where('role', 'admin_okp')->first();
        $admin    = User::where('role', 'admin')->first();

        if (!$adminOkp) {
            return;
        }

        $organisasis = [
            [
                'nama'               => 'Karang Taruna Bontang Bersatu',
                'singkatan'          => 'KTBB',
                'slug'               => 'karang-taruna-bontang-bersatu',
                'no_sk'              => 'SK/KT/001/2020',
                'file_sk'            => null,
                'tanggal_berdiri'    => '2020-03-15',
                'bidang_fokus'       => 'Kepemudaan',
                'alamat_sekretariat' => 'Jl. Mulawarman No. 10, Bontang Utara',
                'logo'               => null,
                'deskripsi'          => 'Organisasi kepemudaan yang bergerak di bidang pemberdayaan masyarakat, pelatihan keterampilan, dan kegiatan sosial di Kota Bontang.',
                'email'              => 'ktbb@bontang.go.id',
                'no_telp'            => '08115551001',
                'website'            => null,
                'sosial_media'       => ['instagram' => '@ktbb_bontang', 'facebook' => 'KTBB Bontang'],
                'status'             => 'terverifikasi',
                'admin_id'           => $adminOkp->id,
                'verified_by'        => $admin?->id,
                'verified_at'        => Carbon::now()->subMonths(6),
                'catatan_verifikasi' => 'Data lengkap dan valid',
            ],
            [
                'nama'               => 'Himpunan Pemuda Kreatif Bontang',
                'singkatan'          => 'HIPKREB',
                'slug'               => 'himpunan-pemuda-kreatif-bontang',
                'no_sk'              => 'SK/HPK/002/2021',
                'file_sk'            => null,
                'tanggal_berdiri'    => '2021-07-20',
                'bidang_fokus'       => 'Ekonomi Kreatif',
                'alamat_sekretariat' => 'Jl. Letjen S. Parman No. 5, Bontang Selatan',
                'logo'               => null,
                'deskripsi'          => 'Organisasi yang berfokus pada pengembangan ekonomi kreatif dan pemberdayaan UMKM di kalangan pemuda Bontang.',
                'email'              => 'hipkreb@gmail.com',
                'no_telp'            => '08115551002',
                'website'            => 'https://hipkreb.or.id',
                'sosial_media'       => ['instagram' => '@hipkreb', 'tiktok' => '@hipkreb_btg'],
                'status'             => 'terverifikasi',
                'admin_id'           => $adminOkp->id,
                'verified_by'        => $admin?->id,
                'verified_at'        => Carbon::now()->subMonths(3),
                'catatan_verifikasi' => 'Sudah terverifikasi oleh Dispoparekraf',
            ],
            [
                'nama'               => 'Forum Olahraga Pemuda Bontang',
                'singkatan'          => 'FOPB',
                'slug'               => 'forum-olahraga-pemuda-bontang',
                'no_sk'              => 'SK/FOP/003/2022',
                'file_sk'            => null,
                'tanggal_berdiri'    => '2022-01-10',
                'bidang_fokus'       => 'Olahraga',
                'alamat_sekretariat' => 'Jl. Ahmad Yani No. 17, Bontang Utara',
                'logo'               => null,
                'deskripsi'          => 'Forum komunikasi dan pengembangan olahraga di kalangan pemuda Kota Bontang.',
                'email'              => 'fopb.bontang@gmail.com',
                'no_telp'            => '08115551003',
                'website'            => null,
                'sosial_media'       => ['instagram' => '@fopb_btg'],
                'status'             => 'pending_verifikasi',
                'admin_id'           => $adminOkp->id,
                'verified_by'        => null,
                'verified_at'        => null,
                'catatan_verifikasi' => null,
            ],
            [
                'nama'               => 'Komunitas Seni Budaya Bontang',
                'singkatan'          => 'KSBB',
                'slug'               => 'komunitas-seni-budaya-bontang',
                'no_sk'              => null,
                'file_sk'            => null,
                'tanggal_berdiri'    => '2023-05-01',
                'bidang_fokus'       => 'Kesenian',
                'alamat_sekretariat' => 'Jl. Gatot Subroto No. 9, Bontang Baru',
                'logo'               => null,
                'deskripsi'          => 'Komunitas pelestarian seni budaya lokal dan pengembangan kreativitas pemuda Bontang.',
                'email'              => 'ksbb.art@gmail.com',
                'no_telp'            => '08115551004',
                'website'            => null,
                'sosial_media'       => ['instagram' => '@ksbb_art'],
                'status'             => 'draft',
                'admin_id'           => $adminOkp->id,
                'verified_by'        => null,
                'verified_at'        => null,
                'catatan_verifikasi' => null,
            ],
        ];

        foreach ($organisasis as $org) {
            Organisasi::create($org);
        }
    }
}
