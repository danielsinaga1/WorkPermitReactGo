<?php

namespace Database\Seeders;

use App\Models\TiketWisata;
use App\Models\DestinasiWisata;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TiketWisataSeeder extends Seeder
{
    public function run(): void
    {
        $masyarakat = User::where('role', 'masyarakat')->get();
        $destinasis = DestinasiWisata::where('is_ticketed', true)->get();

        if ($masyarakat->isEmpty() || $destinasis->isEmpty()) {
            return;
        }

        $tikets = [
            [
                'kode_tiket'         => 'TK-20260201-001',
                'user_id'            => $masyarakat[0]->id,
                'destinasi_id'       => $destinasis[0]->id,
                'tanggal_kunjungan'  => Carbon::now()->addDays(3)->format('Y-m-d'),
                'jumlah_tiket'       => 4,
                'harga_satuan'       => $destinasis[0]->harga_tiket,
                'total_harga'        => $destinasis[0]->harga_tiket * 4,
                'status'             => 'dibayar',
                'payment_method'     => 'qris',
                'payment_ref'        => 'QRIS-TK-20260201-001',
                'qr_code'            => null,
                'used_at'            => null,
            ],
            [
                'kode_tiket'         => 'TK-20260205-001',
                'user_id'            => $masyarakat[1]->id ?? $masyarakat[0]->id,
                'destinasi_id'       => $destinasis[1]->id ?? $destinasis[0]->id,
                'tanggal_kunjungan'  => Carbon::now()->addDays(5)->format('Y-m-d'),
                'jumlah_tiket'       => 2,
                'harga_satuan'       => ($destinasis[1] ?? $destinasis[0])->harga_tiket,
                'total_harga'        => ($destinasis[1] ?? $destinasis[0])->harga_tiket * 2,
                'status'             => 'menunggu_bayar',
                'payment_method'     => null,
                'payment_ref'        => null,
                'qr_code'            => null,
                'used_at'            => null,
            ],
            [
                'kode_tiket'         => 'TK-20260130-001',
                'user_id'            => $masyarakat[0]->id,
                'destinasi_id'       => $destinasis[2]->id ?? $destinasis[0]->id,
                'tanggal_kunjungan'  => Carbon::now()->subDays(10)->format('Y-m-d'),
                'jumlah_tiket'       => 6,
                'harga_satuan'       => ($destinasis[2] ?? $destinasis[0])->harga_tiket,
                'total_harga'        => ($destinasis[2] ?? $destinasis[0])->harga_tiket * 6,
                'status'             => 'digunakan',
                'payment_method'     => 'bank_transfer',
                'payment_ref'        => 'TRF-TK-20260130-001',
                'qr_code'            => null,
                'used_at'            => Carbon::now()->subDays(10)->setHour(9),
            ],
            [
                'kode_tiket'         => 'TK-20260128-001',
                'user_id'            => $masyarakat[1]->id ?? $masyarakat[0]->id,
                'destinasi_id'       => $destinasis[0]->id,
                'tanggal_kunjungan'  => Carbon::now()->subDays(20)->format('Y-m-d'),
                'jumlah_tiket'       => 3,
                'harga_satuan'       => $destinasis[0]->harga_tiket,
                'total_harga'        => $destinasis[0]->harga_tiket * 3,
                'status'             => 'expired',
                'payment_method'     => 'qris',
                'payment_ref'        => 'QRIS-TK-20260128-001',
                'qr_code'            => null,
                'used_at'            => null,
            ],
        ];

        foreach ($tikets as $tiket) {
            TiketWisata::create($tiket);
        }
    }
}
