<?php

namespace App\Http\Controllers;

use App\Models\Turnamen;
use App\Models\PesertaTurnamen;
use Illuminate\Http\Request;

class TurnamenController extends Controller
{
    /**
     * Public listing — published tournaments.
     */
    public function index(Request $request)
    {
        $query = Turnamen::published()
            ->orderBy('tanggal_mulai', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('cabang') && $request->cabang) {
            $query->byCabang($request->cabang);
        }
        if ($request->boolean('upcoming', false)) {
            $query->upcoming();
        }

        $perPage = $request->get('per_page', 10);

        return $this->paginatedResponse($query->paginate($perPage));
    }

    /**
     * Show single tournament with participants count.
     */
    public function show($id)
    {
        $turnamen = Turnamen::withCount('peserta')->find($id);

        if (!$turnamen) {
            return $this->notFoundResponse('Turnamen tidak ditemukan!');
        }

        return $this->successResponse($turnamen);
    }

    /**
     * Register participant (authenticated).
     */
    public function daftar(Request $request, $id)
    {
        $turnamen = Turnamen::find($id);

        if (!$turnamen) {
            return $this->notFoundResponse('Turnamen tidak ditemukan!');
        }

        if ($turnamen->status !== 'pendaftaran') {
            return $this->errorResponse('Pendaftaran turnamen sudah ditutup.', 422);
        }

        if ($turnamen->kuota_peserta && $turnamen->peserta_count >= $turnamen->kuota_peserta) {
            return $this->errorResponse('Kuota peserta sudah penuh.', 422);
        }

        $this->validate($request, [
            'nama_peserta' => 'required|string|max:255',
            'nama_tim' => 'nullable|string|max:255',
            'no_telp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $peserta = PesertaTurnamen::create([
            'turnamen_id' => $turnamen->id,
            'user_id' => auth()->id(),
            'nama_peserta' => $request->nama_peserta,
            'nama_tim' => $request->nama_tim,
            'no_telp' => $request->no_telp,
            'email' => $request->email,
            'status' => 'terdaftar',
        ]);

        $turnamen->increment('peserta_count');

        return $this->successResponse($peserta->load('turnamen'), 'Berhasil mendaftar turnamen!', 201);
    }
}
