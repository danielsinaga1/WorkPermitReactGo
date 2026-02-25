<?php

namespace App\Http\Controllers;

use App\Models\ProdukHukum;
use Illuminate\Http\Request;

class ProdukHukumController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show', 'byCategory']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show', 'byCategory']]);
    }

    public function index(Request $request)
    {
        $query = ProdukHukum::published()->orderBy('date', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $perPage = $request->get('per_page', 10);
        $produkHukums = $query->paginate($perPage);

        return $this->paginatedResponse($produkHukums);
    }

    public function show($id)
    {
        $produkHukum = ProdukHukum::find($id);

        if (!$produkHukum) {
            return $this->notFoundResponse('Produk Hukum tidak ditemukan!');
        }

        // Increment hit count
        $produkHukum->incrementHits();

        return $this->successResponse($produkHukum);
    }

    public function byCategory($category)
    {
        if (!in_array($category, ProdukHukum::getCategories())) {
            return $this->errorResponse('Kategori tidak valid!', 400);
        }

        $produkHukums = ProdukHukum::byCategory($category)
            ->published()
            ->orderBy('date', 'desc')
            ->paginate(10);

        return $this->paginatedResponse($produkHukums);
    }

    public function store(Request $request)
    {
        $categories = implode(',', ProdukHukum::getCategories());

        $this->validate($request, [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'date' => 'required|date',
            'file_url' => 'required|string',
            'category' => "required|in:{$categories}",
            'is_published' => 'boolean'
        ]);

        $data = $request->all();
        $data['hits'] = 0;
        $data['is_published'] = $request->get('is_published', true);

        $produkHukum = ProdukHukum::create($data);

        return $this->successResponse($produkHukum, 'Produk Hukum berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $produkHukum = ProdukHukum::find($id);

        if (!$produkHukum) {
            return $this->notFoundResponse('Produk Hukum tidak ditemukan!');
        }

        $categories = implode(',', ProdukHukum::getCategories());

        $this->validate($request, [
            'title' => 'string|max:255',
            'author' => 'string|max:255',
            'date' => 'date',
            'file_url' => 'string',
            'category' => "in:{$categories}",
            'is_published' => 'boolean'
        ]);

        $produkHukum->update($request->all());

        return $this->successResponse($produkHukum, 'Produk Hukum berhasil diupdate!');
    }

    public function destroy($id)
    {
        $produkHukum = ProdukHukum::find($id);

        if (!$produkHukum) {
            return $this->notFoundResponse('Produk Hukum tidak ditemukan!');
        }

        $produkHukum->delete();

        return $this->successResponse(null, 'Produk Hukum berhasil dihapus!');
    }
}
