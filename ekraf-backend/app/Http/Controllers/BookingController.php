<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Fasilitas;
use App\Models\FasilitasSlot;
use App\Models\FasilitasTarif;
use App\Models\PaymentLog;
use App\Traits\Uploadable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    use Uploadable;

    /**
     * Buat booking baru
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'fasilitas_id' => 'required|exists:fasilitas,id',
            'tarif_id' => 'required|exists:fasilitas_tarifs,id',
            'tanggal' => 'required|date|after_or_equal:today',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'tujuan_kegiatan' => 'required|string|max:500',
            'jumlah_peserta' => 'nullable|integer|min:1',
            'payment_method' => 'nullable|in:qris,bank_transfer,tunai',
        ]);

        $user = Auth::user();

        // Check if user can book
        if (!$user->canBook()) {
            return $this->forbiddenResponse('Anda tidak memiliki akses untuk booking');
        }

        // Check fasilitas is active
        $fasilitas = Fasilitas::active()->find($request->fasilitas_id);
        if (!$fasilitas) {
            return $this->errorResponse('Fasilitas tidak tersedia', 422);
        }

        // Check tarif belongs to fasilitas
        $tarif = FasilitasTarif::where('fasilitas_id', $request->fasilitas_id)
            ->where('id', $request->tarif_id)
            ->active()
            ->first();
        if (!$tarif) {
            return $this->errorResponse('Tarif tidak valid', 422);
        }

        // Check for conflicting bookings
        $conflict = Booking::where('fasilitas_id', $request->fasilitas_id)
            ->where('tanggal', $request->tanggal)
            ->whereNotIn('status', ['ditolak', 'dibatalkan'])
            ->where(function ($q) use ($request) {
                $q->where(function ($q2) use ($request) {
                    $q2->where('jam_mulai', '<', $request->jam_selesai)
                        ->where('jam_selesai', '>', $request->jam_mulai);
                });
            })
            ->exists();

        if ($conflict) {
            return $this->errorResponse('Slot waktu sudah dipesan. Silakan pilih waktu lain.', 422);
        }

        // Calculate cost based on tarif
        $jamMulai = strtotime($request->jam_mulai);
        $jamSelesai = strtotime($request->jam_selesai);
        $durasiJam = ($jamSelesai - $jamMulai) / 3600;

        $totalBiaya = $tarif->harga;
        if ($tarif->satuan === 'per_jam') {
            $totalBiaya = $tarif->harga * ceil($durasiJam);
        }

        DB::beginTransaction();
        try {
            // Create slot record
            $slot = FasilitasSlot::create([
                'fasilitas_id' => $request->fasilitas_id,
                'tanggal' => $request->tanggal,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'status' => 'dipesan',
            ]);

            // Create booking
            $booking = Booking::create([
                'kode_booking' => Booking::generateKodeBooking(),
                'user_id' => $user->id,
                'fasilitas_id' => $request->fasilitas_id,
                'slot_id' => $slot->id,
                'tarif_id' => $request->tarif_id,
                'tanggal' => $request->tanggal,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'tujuan_kegiatan' => $request->tujuan_kegiatan,
                'jumlah_peserta' => $request->jumlah_peserta,
                'total_biaya' => $totalBiaya,
                'status' => 'menunggu_bayar',
                'payment_method' => $request->payment_method,
            ]);

            DB::commit();

            return $this->successResponse(
                $booking->load(['fasilitas:id,nama,jenis', 'tarif']),
                'Booking berhasil dibuat. Silakan lakukan pembayaran.',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Gagal membuat booking: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Riwayat booking milik user
     */
    public function riwayat(Request $request)
    {
        $user = Auth::user();
        $query = Booking::with(['fasilitas:id,nama,jenis,thumbnail', 'tarif'])
            ->byUser($user->id);

        if ($request->has('status')) {
            $query->byStatus($request->input('status'));
        }

        $bookings = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10));

        return $this->paginatedResponse($bookings);
    }

    /**
     * Detail booking
     */
    public function show($id)
    {
        $user = Auth::user();
        $booking = Booking::with(['fasilitas', 'tarif', 'slot', 'verifier:id,name'])
            ->where('user_id', $user->id)
            ->find($id);

        if (!$booking) {
            return $this->notFoundResponse('Booking tidak ditemukan');
        }

        return $this->successResponse($booking);
    }

    /**
     * Upload bukti pembayaran
     */
    public function uploadBukti(Request $request, $id)
    {
        $this->validate($request, [
            'bukti_bayar' => 'required|image|max:5120', // 5MB
            'payment_ref' => 'nullable|string|max:100',
        ]);

        $user = Auth::user();
        $booking = Booking::where('user_id', $user->id)
            ->where('status', 'menunggu_bayar')
            ->find($id);

        if (!$booking) {
            return $this->errorResponse('Booking tidak ditemukan atau sudah dibayar', 404);
        }

        $path = $this->uploadImage($request->file('bukti_bayar'), 'bukti-bayar');

        $booking->update([
            'bukti_bayar' => $path,
            'payment_ref' => $request->payment_ref,
            'status' => 'bukti_dikirim',
        ]);

        // Create payment log
        PaymentLog::create([
            'payable_type' => Booking::class,
            'payable_id' => $booking->id,
            'user_id' => $user->id,
            'amount' => $booking->total_biaya,
            'method' => $booking->payment_method ?? 'bank_transfer',
            'reference' => $request->payment_ref,
            'status' => 'pending',
        ]);

        return $this->successResponse($booking, 'Bukti pembayaran berhasil dikirim');
    }

    /**
     * Batalkan booking
     */
    public function batal($id)
    {
        $user = Auth::user();
        $booking = Booking::where('user_id', $user->id)
            ->whereIn('status', ['menunggu_bayar', 'bukti_dikirim'])
            ->find($id);

        if (!$booking) {
            return $this->errorResponse('Booking tidak dapat dibatalkan', 422);
        }

        // Release slot
        if ($booking->slot_id) {
            FasilitasSlot::where('id', $booking->slot_id)->update(['status' => 'tersedia']);
        }

        $booking->update(['status' => 'dibatalkan']);

        return $this->successResponse(null, 'Booking berhasil dibatalkan');
    }
}
