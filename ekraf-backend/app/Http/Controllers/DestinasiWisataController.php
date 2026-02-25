<?php

namespace App\Http\Controllers;

use App\Models\DestinasiWisata;
use App\Traits\Uploadable;
use Illuminate\Http\Request;

class DestinasiWisataController extends Controller
{
    use Uploadable;

    /**
     * Daftar destinasi wisata (publik)
     */
    public function index(Request $request)
    {
        $query = DestinasiWisata::active();

        if ($request->has('search')) {
            $query->search($request->input('search'));
        }

        if ($request->has('kategori')) {
            $query->byKategori($request->input('kategori'));
        }

        $perPage = $request->input('per_page', 12);
        $destinasi = $query->orderBy('nama')->paginate($perPage);

        return $this->paginatedResponse($destinasi);
    }

    /**
     * Detail destinasi wisata (publik)
     */
    public function show($id)
    {
        $destinasi = DestinasiWisata::find($id);

        if (!$destinasi) {
            return $this->notFoundResponse('Destinasi wisata tidak ditemukan');
        }

        return $this->successResponse($destinasi);
    }
}
