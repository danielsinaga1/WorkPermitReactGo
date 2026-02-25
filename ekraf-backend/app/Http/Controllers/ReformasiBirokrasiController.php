<?php

namespace App\Http\Controllers;

use App\Models\ReformasiBirokrasi;
use Illuminate\Http\Request;

class ReformasiBirokrasiController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        $query = ReformasiBirokrasi::query();

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $perPage = $request->get('per_page', 10);
        $reformasis = $query->paginate($perPage);

        return $this->paginatedResponse($reformasis);
    }

    public function show($id)
    {
        $reformasi = ReformasiBirokrasi::find($id);

        if (!$reformasi) {
            return $this->notFoundResponse('Data Reformasi Birokrasi tidak ditemukan!');
        }

        return $this->successResponse($reformasi);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string'
        ]);

        $reformasi = ReformasiBirokrasi::create($request->all());

        return $this->successResponse($reformasi, 'Data Reformasi Birokrasi berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $reformasi = ReformasiBirokrasi::find($id);

        if (!$reformasi) {
            return $this->notFoundResponse('Data Reformasi Birokrasi tidak ditemukan!');
        }

        $this->validate($request, [
            'title' => 'string|max:255',
            'content' => 'string',
            'category' => 'nullable|string'
        ]);

        $reformasi->update($request->all());

        return $this->successResponse($reformasi, 'Data Reformasi Birokrasi berhasil diupdate!');
    }

    public function destroy($id)
    {
        $reformasi = ReformasiBirokrasi::find($id);

        if (!$reformasi) {
            return $this->notFoundResponse('Data Reformasi Birokrasi tidak ditemukan!');
        }

        $reformasi->delete();

        return $this->successResponse(null, 'Data Reformasi Birokrasi berhasil dihapus!');
    }
}
