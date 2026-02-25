<?php

namespace App\Http\Controllers;

use App\Models\Pelatihan;
use Illuminate\Http\Request;

class PelatihanController extends Controller
{
    /**
     * Daftar pelatihan (publik)
     */
    public function index(Request $request)
    {
        $query = Pelatihan::published();

        if ($request->has('search')) {
            $query->search($request->input('search'));
        }

        if ($request->has('kategori')) {
            $query->byKategori($request->input('kategori'));
        }

        if ($request->has('upcoming') && $request->input('upcoming') == '1') {
            $query->upcoming();
        }

        $perPage = $request->input('per_page', 12);
        $pelatihans = $query->orderBy('tanggal_mulai', 'desc')->paginate($perPage);

        return $this->paginatedResponse($pelatihans);
    }

    /**
     * Detail pelatihan (publik)
     */
    public function show($id)
    {
        $pelatihan = Pelatihan::find($id);

        if (!$pelatihan) {
            return $this->notFoundResponse('Pelatihan tidak ditemukan');
        }

        return $this->successResponse($pelatihan);
    }
}
