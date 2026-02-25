<?php

namespace Database\Seeders;

use App\Models\PaymentLog;
use App\Models\Booking;
use App\Models\TiketWisata;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PaymentLogSeeder extends Seeder
{
    public function run(): void
    {
        // Payment logs for bookings
        $bookings = Booking::whereIn('status', ['terverifikasi', 'selesai', 'bukti_dikirim'])->get();

        foreach ($bookings as $booking) {
            PaymentLog::create([
                'payable_type'     => 'App\\Models\\Booking',
                'payable_id'       => $booking->id,
                'user_id'          => $booking->user_id,
                'amount'           => $booking->total_biaya,
                'method'           => $booking->payment_method ?? 'bank_transfer',
                'reference'        => $booking->payment_ref,
                'status'           => in_array($booking->status, ['terverifikasi', 'selesai']) ? 'success' : 'pending',
                'gateway_response' => [
                    'transaction_id' => 'TRX-' . strtoupper(substr(md5($booking->kode_booking), 0, 10)),
                    'channel'        => $booking->payment_method ?? 'bank_transfer',
                ],
                'paid_at'          => in_array($booking->status, ['terverifikasi', 'selesai']) ? Carbon::now()->subDays(3) : null,
            ]);
        }

        // Payment logs for tiket wisata
        $tikets = TiketWisata::whereIn('status', ['dibayar', 'digunakan'])->get();

        foreach ($tikets as $tiket) {
            PaymentLog::create([
                'payable_type'     => 'App\\Models\\TiketWisata',
                'payable_id'       => $tiket->id,
                'user_id'          => $tiket->user_id,
                'amount'           => $tiket->total_harga,
                'method'           => $tiket->payment_method ?? 'qris',
                'reference'        => $tiket->payment_ref,
                'status'           => 'success',
                'gateway_response' => [
                    'transaction_id' => 'TRX-' . strtoupper(substr(md5($tiket->kode_tiket), 0, 10)),
                    'channel'        => $tiket->payment_method ?? 'qris',
                ],
                'paid_at'          => Carbon::now()->subDays(5),
            ]);
        }

        // Add a failed payment log
        $masyarakat = User::where('role', 'masyarakat')->first();
        if ($masyarakat) {
            $cancelledBooking = Booking::where('status', 'menunggu_bayar')->first();
            if ($cancelledBooking) {
                PaymentLog::create([
                    'payable_type'     => 'App\\Models\\Booking',
                    'payable_id'       => $cancelledBooking->id,
                    'user_id'          => $cancelledBooking->user_id,
                    'amount'           => $cancelledBooking->total_biaya,
                    'method'           => 'qris',
                    'reference'        => null,
                    'status'           => 'failed',
                    'gateway_response' => [
                        'error'   => 'Payment timeout',
                        'message' => 'Pembayaran tidak selesai dalam batas waktu',
                    ],
                    'paid_at'          => null,
                ]);
            }
        }
    }
}
