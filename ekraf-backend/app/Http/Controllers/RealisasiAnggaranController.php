<?php

namespace App\Http\Controllers;

use App\Models\RealisasiAnggaran;
use Illuminate\Http\Request;

class RealisasiAnggaranController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show', 'byTahun']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show', 'byTahun']]);
    }

    public function index(Request $request)
    {
        $query = RealisasiAnggaran::orderBy('tahun', 'desc');

        if ($request->has('tahun')) {
            $query->byTahun($request->tahun);
        }

        $perPage = $request->get('per_page', 10);
        $realisasis = $query->paginate($perPage);

        return $this->paginatedResponse($realisasis);
    }

    public function show($id)
    {
        $realisasi = RealisasiAnggaran::find($id);

        if (!$realisasi) {
            return $this->notFoundResponse('Data Realisasi Anggaran tidak ditemukan!');
        }

        return $this->successResponse($realisasi);
    }

    public function byTahun($tahun)
    {
        $realisasis = RealisasiAnggaran::byTahun($tahun)->get();

        return $this->successResponse($realisasis);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'tahun' => 'required|integer|min:2000|max:2100',
            'program' => 'required|string|max:255',
            'anggaran' => 'required|numeric|min:0',
            'realisasi' => 'required|numeric|min:0',
            'persentase' => 'required|numeric|min:0|max:100'
        ]);

        $realisasi = RealisasiAnggaran::create($request->all());

        return $this->successResponse($realisasi, 'Data Realisasi Anggaran berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $realisasi = RealisasiAnggaran::find($id);

        if (!$realisasi) {
            return $this->notFoundResponse('Data Realisasi Anggaran tidak ditemukan!');
        }

        $this->validate($request, [
            'tahun' => 'integer|min:2000|max:2100',
            'program' => 'string|max:255',
            'anggaran' => 'numeric|min:0',
            'realisasi' => 'numeric|min:0',
            'persentase' => 'numeric|min:0|max:100'
        ]);

        $realisasi->update($request->all());

        return $this->successResponse($realisasi, 'Data Realisasi Anggaran berhasil diupdate!');
    }

    public function destroy($id)
    {
        $realisasi = RealisasiAnggaran::find($id);

        if (!$realisasi) {
            return $this->notFoundResponse('Data Realisasi Anggaran tidak ditemukan!');
        }

        $realisasi->delete();

        return $this->successResponse(null, 'Data Realisasi Anggaran berhasil dihapus!');
    }
}
