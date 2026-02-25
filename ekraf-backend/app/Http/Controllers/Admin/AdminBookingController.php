<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\FasilitasSlot;
use App\Models\PaymentLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminBookingController extends Controller
{
    /**
     * Daftar semua booking (all fasilitas)
     */
    public function index(Request $request)
    {
        $query = Booking::with(['user:id,name,email,no_telp', 'fasilitas:id,nama,jenis', 'tarif']);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->has('fasilitas_id')) {
            $query->where('fasilitas_id', $request->input('fasilitas_id'));
        }
        if ($request->has('search')) {
            $s = $request->input('search');
            $query->whereHas('user', fn($q) => $q->where('name', 'like', "%{$s}%"));
        }

        $data = $query->orderByDesc('created_at')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedResponse($data);
    }

    /**
     * Daftar booking per fasilitas
     */
    public function indexByFasilitas(Request $request, $fasilitasId)
    {
        $query = Booking::with(['user:id,name,email,no_telp', 'tarif'])
            ->byFasilitas($fasilitasId);

        if ($request->has('status')) {
            $query->byStatus($request->input('status'));
        }

        if ($request->has('tanggal')) {
            $query->where('tanggal', $request->input('tanggal'));
        }

        $bookings = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedResponse($bookings);
    }

    /**
     * Verifikasi atau tolak booking
     */
    public function verifikasi(Request $request, $id)
    {
        $this->validate($request, [
            'aksi' => 'required|in:verifikasi,tolak',
            'catatan_admin' => 'nullable|string|max:500',
        ]);

        $booking = Booking::with('slot')->find($id);
        if (!$booking) {
            return $this->notFoundResponse('Booking tidak ditemukan');
        }

        if ($booking->status !== 'bukti_dikirim') {
            return $this->errorResponse('Booking tidak dalam status menunggu verifikasi', 422);
        }

        $admin = Auth::user();

        if ($request->aksi === 'verifikasi') {
            $booking->update([
                'status' => 'terverifikasi',
                'verified_by' => $admin->id,
                'verified_at' => Carbon::now(),
                'catatan_admin' => $request->catatan_admin,
            ]);

            // Confirm slot
            if ($booking->slot) {
                $booking->slot->update(['status' => 'dikonfirmasi']);
            }

            // Update payment log
            PaymentLog::where('payable_type', Booking::class)
                ->where('payable_id', $booking->id)
                ->where('status', 'pending')
                ->update([
                    'status' => 'success',
                    'paid_at' => Carbon::now(),
                ]);

            $message = 'Booking berhasil diverifikasi';
        } else {
            $booking->update([
                'status' => 'ditolak',
                'verified_by' => $admin->id,
                'verified_at' => Carbon::now(),
                'catatan_admin' => $request->catatan_admin,
            ]);

            // Release slot
            if ($booking->slot) {
                $booking->slot->update(['status' => 'tersedia']);
            }

            // Update payment log
            PaymentLog::where('payable_type', Booking::class)
                ->where('payable_id', $booking->id)
                ->where('status', 'pending')
                ->update(['status' => 'failed']);

            $message = 'Booking ditolak';
        }

        return $this->successResponse($booking->fresh(), $message);
    }

    /**
     * Kalender booking per fasilitas
     */
    public function kalender(Request $request, $fasilitasId)
    {
        $start = $request->input('start', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $end = $request->input('end', Carbon::now()->endOfMonth()->format('Y-m-d'));

        $bookings = Booking::with('user:id,name')
            ->byFasilitas($fasilitasId)
            ->whereNotIn('status', ['ditolak', 'dibatalkan'])
            ->whereBetween('tanggal', [$start, $end])
            ->get(['id', 'kode_booking', 'user_id', 'tanggal', 'jam_mulai', 'jam_selesai', 'status', 'tujuan_kegiatan']);

        return $this->successResponse($bookings);
    }

    /**
     * Laporan retribusi
     */
    public function laporanRetribusi(Request $request)
    {
        $bulan = $request->input('bulan', Carbon::now()->month);
        $tahun = $request->input('tahun', Carbon::now()->year);

        $bookings = Booking::with(['fasilitas:id,nama,jenis', 'user:id,name'])
            ->where('status', 'terverifikasi')
            ->whereMonth('verified_at', $bulan)
            ->whereYear('verified_at', $tahun)
            ->get();

        $totalPendapatan = $bookings->sum('total_biaya');

        $perFasilitas = $bookings->groupBy('fasilitas_id')->map(function ($items) {
            return [
                'fasilitas' => $items->first()->fasilitas,
                'jumlah_booking' => $items->count(),
                'total_pendapatan' => $items->sum('total_biaya'),
            ];
        })->values();

        return $this->successResponse([
            'bulan' => $bulan,
            'tahun' => $tahun,
            'total_pendapatan' => $totalPendapatan,
            'jumlah_booking' => $bookings->count(),
            'per_fasilitas' => $perFasilitas,
            'detail' => $bookings,
        ]);
    }
}
