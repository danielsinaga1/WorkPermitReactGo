<?php

namespace App\Http\Controllers;

use App\Models\Atlet;
use App\Models\Pelatih;
use Illuminate\Http\Request;

class SimporaController extends Controller
{
    // ========================
    // ATLET
    // ========================

    public function indexAtlet(Request $request)
    {
        $query = Atlet::orderBy('nama');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('cabang') && $request->cabang) {
            $query->byCabang($request->cabang);
        }
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);

        return $this->paginatedResponse($query->paginate($perPage));
    }

    public function showAtlet($id)
    {
        $atlet = Atlet::find($id);
        if (!$atlet) {
            return $this->notFoundResponse('Atlet tidak ditemukan!');
        }
        return $this->successResponse($atlet);
    }

    // ========================
    // PELATIH
    // ========================

    public function indexPelatih(Request $request)
    {
        $query = Pelatih::orderBy('nama');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('cabang') && $request->cabang) {
            $query->byCabang($request->cabang);
        }
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);

        return $this->paginatedResponse($query->paginate($perPage));
    }

    public function showPelatih($id)
    {
        $pelatih = Pelatih::find($id);
        if (!$pelatih) {
            return $this->notFoundResponse('Pelatih tidak ditemukan!');
        }
        return $this->successResponse($pelatih);
    }
}
