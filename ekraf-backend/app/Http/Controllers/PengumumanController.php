<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Illuminate\Http\Request;

class PengumumanController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        $query = Pengumuman::published()->orderBy('date', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        $perPage = $request->get('per_page', 10);
        $pengumumans = $query->paginate($perPage);

        return $this->paginatedResponse($pengumumans);
    }

    public function show($id)
    {
        $pengumuman = Pengumuman::find($id);

        if (!$pengumuman) {
            return $this->notFoundResponse('Pengumuman tidak ditemukan!');
        }

        return $this->successResponse($pengumuman);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
            'thumbnail' => 'required|string',
            'is_published' => 'boolean'
        ]);

        $data = $request->all();
        $data['is_published'] = $request->get('is_published', true);

        $pengumuman = Pengumuman::create($data);

        return $this->successResponse($pengumuman, 'Pengumuman berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $pengumuman = Pengumuman::find($id);

        if (!$pengumuman) {
            return $this->notFoundResponse('Pengumuman tidak ditemukan!');
        }

        $this->validate($request, [
            'title' => 'string|max:255',
            'content' => 'string',
            'date' => 'date',
            'thumbnail' => 'string',
            'is_published' => 'boolean'
        ]);

        $pengumuman->update($request->all());

        return $this->successResponse($pengumuman, 'Pengumuman berhasil diupdate!');
    }

    public function destroy($id)
    {
        $pengumuman = Pengumuman::find($id);

        if (!$pengumuman) {
            return $this->notFoundResponse('Pengumuman tidak ditemukan!');
        }

        $pengumuman->delete();

        return $this->successResponse(null, 'Pengumuman berhasil dihapus!');
    }
}
