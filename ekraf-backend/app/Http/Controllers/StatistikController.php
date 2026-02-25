<?php

namespace App\Http\Controllers;

use App\Models\PotensiEkonomi;
use Illuminate\Http\Request;

class StatistikController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show', 'byYear']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show', 'byYear']]);
    }

    public function index(Request $request)
    {
        $query = PotensiEkonomi::orderBy('year', 'desc');

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('year')) {
            $query->byYear($request->year);
        }

        $perPage = $request->get('per_page', 10);
        $statistiks = $query->paginate($perPage);

        return $this->paginatedResponse($statistiks);
    }

    public function show($id)
    {
        $statistik = PotensiEkonomi::find($id);

        if (!$statistik) {
            return $this->notFoundResponse('Data statistik tidak ditemukan!');
        }

        return $this->successResponse($statistik);
    }

    public function byYear($year)
    {
        $statistiks = PotensiEkonomi::byYear($year)->get();

        return $this->successResponse($statistiks);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'value' => 'required|string',
            'unit' => 'nullable|string',
            'year' => 'required|integer|min:2000|max:2100',
            'category' => 'required|string',
            'description' => 'nullable|string'
        ]);

        $statistik = PotensiEkonomi::create($request->all());

        return $this->successResponse($statistik, 'Data statistik berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $statistik = PotensiEkonomi::find($id);

        if (!$statistik) {
            return $this->notFoundResponse('Data statistik tidak ditemukan!');
        }

        $this->validate($request, [
            'title' => 'string|max:255',
            'value' => 'string',
            'unit' => 'nullable|string',
            'year' => 'integer|min:2000|max:2100',
            'category' => 'string',
            'description' => 'nullable|string'
        ]);

        $statistik->update($request->all());

        return $this->successResponse($statistik, 'Data statistik berhasil diupdate!');
    }

    public function destroy($id)
    {
        $statistik = PotensiEkonomi::find($id);

        if (!$statistik) {
            return $this->notFoundResponse('Data statistik tidak ditemukan!');
        }

        $statistik->delete();

        return $this->successResponse(null, 'Data statistik berhasil dihapus!');
    }
}
