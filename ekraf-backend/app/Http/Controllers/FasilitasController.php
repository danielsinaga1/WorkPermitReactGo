<?php

namespace App\Http\Controllers;

use App\Models\Fasilitas;
use App\Models\FasilitasSlot;
use App\Models\FasilitasBlackout;
use App\Traits\Uploadable;
use Carbon\Carbon;
use Illuminate\Http\Request;

class FasilitasController extends Controller
{
    use Uploadable;

    /**
     * Daftar semua fasilitas (publik)
     */
    public function index(Request $request)
    {
        $query = Fasilitas::with(['tarifs' => function ($q) {
            $q->active();
        }])->active();

        if ($request->has('search')) {
            $query->search($request->input('search'));
        }

        if ($request->has('jenis')) {
            $query->byJenis($request->input('jenis'));
        }

        $perPage = $request->input('per_page', 12);
        $fasilitas = $query->orderBy('nama')->paginate($perPage);

        return $this->paginatedResponse($fasilitas);
    }

    /**
     * Detail fasilitas + tarif + slot tersedia
     */
    public function show($id)
    {
        $fasilitas = Fasilitas::with([
            'tarifs' => function ($q) { $q->active(); },
            'pengelola:id,name,no_telp',
        ])->find($id);

        if (!$fasilitas) {
            return $this->notFoundResponse('Fasilitas tidak ditemukan');
        }

        return $this->successResponse($fasilitas);
    }

    /**
     * Kalender ketersediaan fasilitas (publik)
     * Query: ?start=2026-02-01&end=2026-02-28
     */
    public function ketersediaan(Request $request, $id)
    {
        $fasilitas = Fasilitas::find($id);
        if (!$fasilitas) {
            return $this->notFoundResponse('Fasilitas tidak ditemukan');
        }

        $start = $request->input('start', Carbon::now()->format('Y-m-d'));
        $end = $request->input('end', Carbon::now()->addMonth()->format('Y-m-d'));

        $slots = FasilitasSlot::where('fasilitas_id', $id)
            ->byDateRange($start, $end)
            ->orderBy('tanggal')
            ->orderBy('jam_mulai')
            ->get();

        $blackouts = FasilitasBlackout::where('fasilitas_id', $id)
            ->where('tanggal_selesai', '>=', $start)
            ->where('tanggal_mulai', '<=', $end)
            ->get();

        return $this->successResponse([
            'fasilitas' => $fasilitas->only(['id', 'nama', 'jenis']),
            'slots' => $slots,
            'blackouts' => $blackouts,
        ]);
    }
}
