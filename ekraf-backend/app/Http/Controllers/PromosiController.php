<?php

namespace App\Http\Controllers;

use App\Models\Promosi;
use Illuminate\Http\Request;

class PromosiController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        $query = Promosi::published()->orderBy('date', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        $perPage = $request->get('per_page', 10);
        $promosis = $query->paginate($perPage);

        return $this->paginatedResponse($promosis);
    }

    public function show($id)
    {
        $promosi = Promosi::find($id);

        if (!$promosi) {
            return $this->notFoundResponse('Promosi tidak ditemukan!');
        }

        return $this->successResponse($promosi);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
            'thumbnail' => 'required|string',
            'images' => 'nullable|array',
            'descriptions' => 'nullable|array',
            'is_published' => 'boolean'
        ]);

        $data = $request->all();
        $data['is_published'] = $request->get('is_published', true);

        $promosi = Promosi::create($data);

        return $this->successResponse($promosi, 'Promosi berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $promosi = Promosi::find($id);

        if (!$promosi) {
            return $this->notFoundResponse('Promosi tidak ditemukan!');
        }

        $this->validate($request, [
            'title' => 'string|max:255',
            'content' => 'string',
            'date' => 'date',
            'thumbnail' => 'string',
            'images' => 'nullable|array',
            'descriptions' => 'nullable|array',
            'is_published' => 'boolean'
        ]);

        $promosi->update($request->all());

        return $this->successResponse($promosi, 'Promosi berhasil diupdate!');
    }

    public function destroy($id)
    {
        $promosi = Promosi::find($id);

        if (!$promosi) {
            return $this->notFoundResponse('Promosi tidak ditemukan!');
        }

        $promosi->delete();

        return $this->successResponse(null, 'Promosi berhasil dihapus!');
    }
}
