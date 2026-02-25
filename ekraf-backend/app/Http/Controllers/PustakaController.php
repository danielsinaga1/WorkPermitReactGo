<?php

namespace App\Http\Controllers;

use App\Models\Pustaka;
use Illuminate\Http\Request;

class PustakaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        $query = Pustaka::published()->orderBy('date', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $perPage = $request->get('per_page', 10);
        $pustakas = $query->paginate($perPage);

        return $this->paginatedResponse($pustakas);
    }

    public function show($id)
    {
        $pustaka = Pustaka::find($id);

        if (!$pustaka) {
            return $this->notFoundResponse('Pustaka tidak ditemukan!');
        }

        return $this->successResponse($pustaka);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
            'thumbnail' => 'required|string',
            'pdf_url' => 'required|string',
            'category' => 'nullable|string',
            'is_published' => 'boolean'
        ]);

        $data = $request->all();
        $data['is_published'] = $request->get('is_published', true);

        $pustaka = Pustaka::create($data);

        return $this->successResponse($pustaka, 'Pustaka berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $pustaka = Pustaka::find($id);

        if (!$pustaka) {
            return $this->notFoundResponse('Pustaka tidak ditemukan!');
        }

        $this->validate($request, [
            'title' => 'string|max:255',
            'content' => 'string',
            'date' => 'date',
            'thumbnail' => 'string',
            'pdf_url' => 'string',
            'category' => 'nullable|string',
            'is_published' => 'boolean'
        ]);

        $pustaka->update($request->all());

        return $this->successResponse($pustaka, 'Pustaka berhasil diupdate!');
    }

    public function destroy($id)
    {
        $pustaka = Pustaka::find($id);

        if (!$pustaka) {
            return $this->notFoundResponse('Pustaka tidak ditemukan!');
        }

        $pustaka->delete();

        return $this->successResponse(null, 'Pustaka berhasil dihapus!');
    }
}
