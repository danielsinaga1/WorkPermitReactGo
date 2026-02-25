<?php

namespace Database\Seeders;

use App\Models\Pengaduan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PengaduanSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@bontang.go.id')->first();
        $adminId = $admin?->id;

        $items = [
            [
                'kode_pengaduan'    => 'ADU-202602-0001',
                'user_id'           => null,
                'nama_pelapor'      => 'Hadi Susanto',
                'email_pelapor'     => 'hadi.susanto@mail.com',
                'no_telp_pelapor'   => '08115590501',
                'kategori'          => 'fasilitas',
                'judul'             => 'Lampu Taman Kota Mati Sebagian',
                'deskripsi'         => 'Beberapa lampu penerangan di area Taman Kota Bontang sebelah barat mati sudah sekitar 2 minggu. Hal ini menyulitkan pengunjung sore/malam hari dan berpotensi membahayakan keamanan.',
                'lokasi'            => 'Taman Kota Bontang, area barat dekat air mancur',
                'foto_lampiran'     => ['lampiran-taman-1.jpg'],
                'status'            => 'diproses',
                'tanggapan'         => 'Terima kasih atas laporannya. Tim kami sedang melakukan pengecekan dan perbaikan.',
                'ditanggapi_oleh'   => $adminId,
                'ditanggapi_at'     => Carbon::now()->subDays(3),
            ],
            [
                'kode_pengaduan'    => 'ADU-202602-0002',
                'user_id'           => null,
                'nama_pelapor'      => 'Rina Kartini',
                'email_pelapor'     => 'rina.k@mail.com',
                'no_telp_pelapor'   => '08115590502',
                'kategori'          => 'pelayanan',
                'judul'             => 'Antrean Panjang di Kantor Dinas',
                'deskripsi'         => 'Setiap hari Senin, antrean di loket pelayanan Dinas Pariwisata sangat panjang hingga keluar gedung. Mohon ditambah loket atau dibuat sistem antrian online.',
                'lokasi'            => 'Kantor Dispoparekraf, Jl. Bessai Berinta',
                'foto_lampiran'     => null,
                'status'            => 'baru',
                'tanggapan'         => null,
                'ditanggapi_oleh'   => null,
                'ditanggapi_at'     => null,
            ],
            [
                'kode_pengaduan'    => 'ADU-202602-0003',
                'user_id'           => null,
                'nama_pelapor'      => 'Ahmad Ridwan',
                'email_pelapor'     => 'ahmad.ridwan@mail.com',
                'no_telp_pelapor'   => '08115590503',
                'kategori'          => 'saran',
                'judul'             => 'Saran Penambahan Fasilitas WiFi di Taman',
                'deskripsi'         => 'Alangkah baiknya jika area Taman Kota dan Pantai Marina dilengkapi fasilitas WiFi gratis untuk pengunjung. Ini bisa mendukung promosi wisata digital.',
                'lokasi'            => 'Taman Kota & Pantai Marina Bontang',
                'foto_lampiran'     => null,
                'status'            => 'selesai',
                'tanggapan'         => 'Terima kasih atas sarannya. Kami sudah memasukkan rencana pemasangan WiFi publik di area wisata ke dalam RKPD 2027.',
                'ditanggapi_oleh'   => $adminId,
                'ditanggapi_at'     => Carbon::now()->subDays(7),
            ],
            [
                'kode_pengaduan'    => 'ADU-202602-0004',
                'user_id'           => null,
                'nama_pelapor'      => 'Siti Aminah',
                'email_pelapor'     => 'siti.aminah@mail.com',
                'no_telp_pelapor'   => '08115590504',
                'kategori'          => 'fasilitas',
                'judul'             => 'Toilet Umum di Pantai Marina Kotor',
                'deskripsi'         => 'Kondisi toilet umum di area parkir Pantai Marina sangat kotor dan tidak terawat. Air tidak jalan, sabun habis, dan bau tidak sedap.',
                'lokasi'            => 'Pantai Marina Bontang, area parkir',
                'foto_lampiran'     => ['lampiran-toilet-1.jpg', 'lampiran-toilet-2.jpg'],
                'status'            => 'ditanggapi',
                'tanggapan'         => 'Kami telah menginstruksikan tim kebersihan untuk membersihkan dan memperbaiki toilet secara berkala. Mohon maaf atas ketidaknyamanannya.',
                'ditanggapi_oleh'   => $adminId,
                'ditanggapi_at'     => Carbon::now()->subDays(1),
            ],
            [
                'kode_pengaduan'    => 'ADU-202602-0005',
                'user_id'           => null,
                'nama_pelapor'      => 'Budi Prasetyo',
                'email_pelapor'     => 'budi.p@mail.com',
                'no_telp_pelapor'   => '08115590505',
                'kategori'          => 'lainnya',
                'judul'             => 'Pedagang Liar di Area Obyek Wisata',
                'deskripsi'         => 'Banyak pedagang kaki lima yang berjualan di pinggir jalan masuk kawasan Hutan Mangrove tanpa izin, mengganggu lalu lintas dan keindahan kawasan.',
                'lokasi'            => 'Jalan masuk Hutan Mangrove Bontang',
                'foto_lampiran'     => null,
                'status'            => 'baru',
                'tanggapan'         => null,
                'ditanggapi_oleh'   => null,
                'ditanggapi_at'     => null,
            ],
            [
                'kode_pengaduan'    => 'ADU-202602-0006',
                'user_id'           => null,
                'nama_pelapor'      => 'Dewi Lestari',
                'email_pelapor'     => 'dewi.l@mail.com',
                'no_telp_pelapor'   => '08115590506',
                'kategori'          => 'pelayanan',
                'judul'             => 'E-Ticket Wisata Tidak Bisa Divalidasi',
                'deskripsi'         => 'Saya membeli e-ticket untuk masuk Hutan Mangrove tanggal 15 Februari, namun saat di loket, petugas tidak bisa memvalidasi QR Code tiket digital saya. Akhirnya harus beli tiket lagi di loket.',
                'lokasi'            => 'Loket masuk Wisata Hutan Mangrove Bontang',
                'foto_lampiran'     => ['lampiran-eticket.jpg'],
                'status'            => 'ditolak',
                'tanggapan'         => 'Setelah kami verifikasi, tiket dengan kode yang dilaporkan tidak ditemukan di sistem. Mohon pastikan pembelian dilakukan melalui website resmi.',
                'ditanggapi_oleh'   => $adminId,
                'ditanggapi_at'     => Carbon::now()->subDays(5),
            ],
        ];

        foreach ($items as $item) {
            Pengaduan::create($item);
        }
    }
}
