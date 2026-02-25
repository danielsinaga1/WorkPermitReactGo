<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;

class BeritaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show']]);
    }

    /**
     * Display a listing of beritas
     */
    public function index(Request $request)
    {
        $query = Berita::with('author:id,name')
            ->published()
            ->orderBy('date', 'desc');

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Date filter
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        $perPage = $request->get('per_page', 10);
        $beritas = $query->paginate($perPage);

        return $this->paginatedResponse($beritas);
    }

    /**
     * Display the specified berita
     */
    public function show($id)
    {
        $berita = Berita::with('author:id,name')->find($id);

        if (!$berita) {
            return $this->notFoundResponse('Berita tidak ditemukan!');
        }

        return $this->successResponse($berita);
    }

    /**
     * Store a newly created berita
     */
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
        $data['author_id'] = auth()->id();
        $data['is_published'] = $request->get('is_published', true);

        $berita = Berita::create($data);

        return $this->successResponse($berita->load('author:id,name'), 'Berita berhasil dibuat!', 201);
    }

    /**
     * Update the specified berita
     */
    public function update(Request $request, $id)
    {
        $berita = Berita::find($id);

        if (!$berita) {
            return $this->notFoundResponse('Berita tidak ditemukan!');
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

        $berita->update($request->all());

        return $this->successResponse($berita->load('author:id,name'), 'Berita berhasil diupdate!');
    }

    /**
     * Remove the specified berita
     */
    public function destroy($id)
    {
        $berita = Berita::find($id);

        if (!$berita) {
            return $this->notFoundResponse('Berita tidak ditemukan!');
        }

        $berita->delete();

        return $this->successResponse(null, 'Berita berhasil dihapus!');
    }
}
