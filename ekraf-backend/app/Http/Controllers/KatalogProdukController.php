<?php

namespace App\Http\Controllers;

use App\Models\KatalogProduk;
use App\Traits\Uploadable;
use Illuminate\Http\Request;

class KatalogProdukController extends Controller
{
    use Uploadable;

    /**
     * E-Katalog produk UMKM (publik)
     */
    public function index(Request $request)
    {
        $query = KatalogProduk::with(['subsektor:id,name'])
            ->active()
            ->verified();

        if ($request->has('search')) {
            $query->search($request->input('search'));
        }

        if ($request->has('kategori')) {
            $query->byKategori($request->input('kategori'));
        }

        if ($request->has('subsektor_id')) {
            $query->bySubsektor($request->input('subsektor_id'));
        }

        $perPage = $request->input('per_page', 12);
        $produk = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return $this->paginatedResponse($produk);
    }

    /**
     * Detail produk (publik)
     */
    public function show($id)
    {
        $produk = KatalogProduk::with(['subsektor:id,name', 'pemilik:id,name,no_telp'])
            ->find($id);

        if (!$produk) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        }

        return $this->successResponse($produk);
    }
}
