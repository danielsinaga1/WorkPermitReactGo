<?php

namespace App\Http\Controllers;

use App\Models\TenagaKerja;
use Illuminate\Http\Request;

class TenagaKerjaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        $query = TenagaKerja::published()->orderBy('date', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        $perPage = $request->get('per_page', 10);
        $tenagaKerjas = $query->paginate($perPage);

        return $this->paginatedResponse($tenagaKerjas);
    }

    public function show($id)
    {
        $tenagaKerja = TenagaKerja::find($id);

        if (!$tenagaKerja) {
            return $this->notFoundResponse('Tenaga Kerja tidak ditemukan!');
        }

        return $this->successResponse($tenagaKerja);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
            'thumbnail' => 'required|string',
            'pdf_url' => 'nullable|string',
            'is_published' => 'boolean'
        ]);

        $data = $request->all();
        $data['is_published'] = $request->get('is_published', true);

        $tenagaKerja = TenagaKerja::create($data);

        return $this->successResponse($tenagaKerja, 'Tenaga Kerja berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $tenagaKerja = TenagaKerja::find($id);

        if (!$tenagaKerja) {
            return $this->notFoundResponse('Tenaga Kerja tidak ditemukan!');
        }

        $this->validate($request, [
            'title' => 'string|max:255',
            'content' => 'string',
            'date' => 'date',
            'thumbnail' => 'string',
            'pdf_url' => 'nullable|string',
            'is_published' => 'boolean'
        ]);

        $tenagaKerja->update($request->all());

        return $this->successResponse($tenagaKerja, 'Tenaga Kerja berhasil diupdate!');
    }

    public function destroy($id)
    {
        $tenagaKerja = TenagaKerja::find($id);

        if (!$tenagaKerja) {
            return $this->notFoundResponse('Tenaga Kerja tidak ditemukan!');
        }

        $tenagaKerja->delete();

        return $this->successResponse(null, 'Tenaga Kerja berhasil dihapus!');
    }
}
