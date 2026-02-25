<?php

namespace Database\Seeders;

use App\Models\OrgLaporan;
use App\Models\OrgKegiatan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrgLaporanSeeder extends Seeder
{
    public function run(): void
    {
        $selesaiKegiatans = OrgKegiatan::where('status', 'selesai')->get();
        $admin            = User::where('role', 'admin')->first();

        if ($selesaiKegiatans->isEmpty()) {
            return;
        }

        foreach ($selesaiKegiatans as $kegiatan) {
            OrgLaporan::create([
                'kegiatan_id'     => $kegiatan->id,
                'file_laporan'    => 'laporan/laporan-kegiatan-' . $kegiatan->id . '.pdf',
                'deskripsi'       => 'Laporan pelaksanaan kegiatan "' . $kegiatan->judul . '" yang telah dilaksanakan.',
                'foto_kegiatan'   => ['foto-kegiatan-' . $kegiatan->id . '-1.jpg', 'foto-kegiatan-' . $kegiatan->id . '-2.jpg'],
                'jumlah_peserta'  => $kegiatan->peserta_target ? (int) ($kegiatan->peserta_target * 0.85) : 20,
                'hasil_kegiatan'  => 'Kegiatan berjalan dengan lancar dan sesuai rencana. Peserta antusias mengikuti seluruh rangkaian acara.',
                'kendala'         => 'Tidak ada kendala berarti selama pelaksanaan kegiatan.',
                'status'          => 'diterima',
                'reviewed_by'     => $admin?->id,
                'reviewed_at'     => Carbon::now()->subDays(3),
                'catatan_review'  => 'Laporan sudah lengkap dan sesuai format. Terima kasih.',
            ]);
        }
    }
}
