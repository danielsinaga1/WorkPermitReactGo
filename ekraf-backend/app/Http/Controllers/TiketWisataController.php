<?php

namespace App\Http\Controllers;

use App\Models\TiketWisata;
use App\Models\DestinasiWisata;
use App\Models\PaymentLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TiketWisataController extends Controller
{
    /**
     * Beli tiket wisata
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'destinasi_id' => 'required|exists:destinasi_wisatas,id',
            'tanggal_kunjungan' => 'required|date|after_or_equal:today',
            'jumlah_tiket' => 'required|integer|min:1|max:20',
            'payment_method' => 'required|in:qris,bank_transfer',
        ]);

        $user = Auth::user();
        $destinasi = DestinasiWisata::active()->ticketed()->find($request->destinasi_id);

        if (!$destinasi) {
            return $this->errorResponse('Destinasi tidak tersedia untuk pembelian tiket', 422);
        }

        $hargaSatuan = $destinasi->harga_tiket;
        $totalHarga = $hargaSatuan * $request->jumlah_tiket;

        DB::beginTransaction();
        try {
            $tiket = TiketWisata::create([
                'kode_tiket' => TiketWisata::generateKodeTiket(),
                'user_id' => $user->id,
                'destinasi_id' => $request->destinasi_id,
                'tanggal_kunjungan' => $request->tanggal_kunjungan,
                'jumlah_tiket' => $request->jumlah_tiket,
                'harga_satuan' => $hargaSatuan,
                'total_harga' => $totalHarga,
                'status' => 'menunggu_bayar',
                'payment_method' => $request->payment_method,
            ]);

            // Create payment log
            PaymentLog::create([
                'payable_type' => TiketWisata::class,
                'payable_id' => $tiket->id,
                'user_id' => $user->id,
                'amount' => $totalHarga,
                'method' => $request->payment_method,
                'status' => 'pending',
            ]);

            DB::commit();

            return $this->successResponse(
                $tiket->load('destinasi:id,nama,alamat'),
                'Tiket berhasil dipesan. Silakan lakukan pembayaran.',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Gagal memesan tiket: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Riwayat tiket wisata milik user
     */
    public function riwayat(Request $request)
    {
        $user = Auth::user();
        $tikets = TiketWisata::with(['destinasi:id,nama,thumbnail,alamat'])
            ->byUser($user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10));

        return $this->paginatedResponse($tikets);
    }

    /**
     * Detail tiket + QR Code
     */
    public function show($id)
    {
        $user = Auth::user();
        $tiket = TiketWisata::with(['destinasi'])
            ->where('user_id', $user->id)
            ->find($id);

        if (!$tiket) {
            return $this->notFoundResponse('Tiket tidak ditemukan');
        }

        return $this->successResponse($tiket);
    }
}
