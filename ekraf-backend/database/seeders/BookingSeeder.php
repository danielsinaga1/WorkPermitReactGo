<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\User;
use App\Models\Fasilitas;
use App\Models\FasilitasTarif;
use App\Models\FasilitasSlot;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $masyarakat = User::where('role', 'masyarakat')->get();
        $admin      = User::where('role', 'admin')->first();
        $fasilitas  = Fasilitas::with(['tarifs', 'slots'])->get();

        if ($masyarakat->isEmpty() || $fasilitas->isEmpty()) {
            return;
        }

        $bookings = [
            [
                'kode_booking'     => 'BK-20260201-001',
                'user_id'          => $masyarakat[0]->id,
                'fasilitas_id'     => $fasilitas[0]->id,
                'slot_id'          => $fasilitas[0]->slots->first()?->id,
                'tarif_id'         => $fasilitas[0]->tarifs->first()?->id ?? 1,
                'tanggal'          => Carbon::now()->addDays(3)->format('Y-m-d'),
                'jam_mulai'        => '08:00',
                'jam_selesai'      => '12:00',
                'tujuan_kegiatan'  => 'Seminar Ekonomi Kreatif Bontang 2026',
                'jumlah_peserta'   => 100,
                'total_biaya'      => 1500000,
                'status'           => 'terverifikasi',
                'bukti_bayar'      => null,
                'payment_method'   => 'bank_transfer',
                'payment_ref'      => 'TRF-20260201-0001',
                'verified_by'      => $admin?->id,
                'verified_at'      => Carbon::now()->subDays(2),
                'catatan_admin'    => 'Pembayaran sudah diverifikasi',
            ],
            [
                'kode_booking'     => 'BK-20260205-001',
                'user_id'          => $masyarakat[1]->id ?? $masyarakat[0]->id,
                'fasilitas_id'     => $fasilitas[4]->id ?? $fasilitas[0]->id,
                'slot_id'          => ($fasilitas[4] ?? $fasilitas[0])->slots->skip(1)->first()?->id,
                'tarif_id'         => ($fasilitas[4] ?? $fasilitas[0])->tarifs->first()?->id ?? 1,
                'tanggal'          => Carbon::now()->addDays(5)->format('Y-m-d'),
                'jam_mulai'        => '13:00',
                'jam_selesai'      => '17:00',
                'tujuan_kegiatan'  => 'Turnamen Badminton antar Kelurahan',
                'jumlah_peserta'   => 50,
                'total_biaya'      => 200000,
                'status'           => 'menunggu_bayar',
                'bukti_bayar'      => null,
                'payment_method'   => null,
                'payment_ref'      => null,
                'verified_by'      => null,
                'verified_at'      => null,
                'catatan_admin'    => null,
            ],
            [
                'kode_booking'     => 'BK-20260210-001',
                'user_id'          => $masyarakat[0]->id,
                'fasilitas_id'     => $fasilitas[2]->id ?? $fasilitas[0]->id,
                'slot_id'          => ($fasilitas[2] ?? $fasilitas[0])->slots->first()?->id,
                'tarif_id'         => ($fasilitas[2] ?? $fasilitas[0])->tarifs->first()?->id ?? 1,
                'tanggal'          => Carbon::now()->addDays(7)->format('Y-m-d'),
                'jam_mulai'        => '18:00',
                'jam_selesai'      => '22:00',
                'tujuan_kegiatan'  => 'Latihan rutin tim futsal RT 05',
                'jumlah_peserta'   => 20,
                'total_biaya'      => 600000,
                'status'           => 'bukti_dikirim',
                'bukti_bayar'      => 'bukti/bukti-bayar-001.jpg',
                'payment_method'   => 'qris',
                'payment_ref'      => 'QRIS-20260210-5678',
                'verified_by'      => null,
                'verified_at'      => null,
                'catatan_admin'    => null,
            ],
            [
                'kode_booking'     => 'BK-20260212-001',
                'user_id'          => $masyarakat[1]->id ?? $masyarakat[0]->id,
                'fasilitas_id'     => $fasilitas[3]->id ?? $fasilitas[0]->id,
                'slot_id'          => ($fasilitas[3] ?? $fasilitas[0])->slots->first()?->id,
                'tarif_id'         => ($fasilitas[3] ?? $fasilitas[0])->tarifs->first()?->id ?? 1,
                'tanggal'          => Carbon::now()->subDays(5)->format('Y-m-d'),
                'jam_mulai'        => '08:00',
                'jam_selesai'      => '12:00',
                'tujuan_kegiatan'  => 'Lomba renang anak-anak HUT Kota Bontang',
                'jumlah_peserta'   => 40,
                'total_biaya'      => 1000000,
                'status'           => 'selesai',
                'bukti_bayar'      => 'bukti/bukti-bayar-002.jpg',
                'payment_method'   => 'bank_transfer',
                'payment_ref'      => 'TRF-20260212-0002',
                'verified_by'      => $admin?->id,
                'verified_at'      => Carbon::now()->subDays(7),
                'catatan_admin'    => 'Kegiatan telah selesai dilaksanakan',
            ],
        ];

        foreach ($bookings as $booking) {
            Booking::create($booking);
        }
    }
}
