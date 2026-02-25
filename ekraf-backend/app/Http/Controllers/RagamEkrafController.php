<?php

namespace App\Http\Controllers;

use App\Models\RagamEkraf;
use Illuminate\Http\Request;

class RagamEkrafController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show', 'bySubsektor']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show', 'bySubsektor']]);
    }

    public function index(Request $request)
    {
        $query = RagamEkraf::with('subsektor:id,name')
            ->published()
            ->orderBy('date', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        if ($request->has('subsektor_id')) {
            $query->where('subsektor_id', $request->subsektor_id);
        }

        $perPage = $request->get('per_page', 10);
        $ragamEkrafs = $query->paginate($perPage);

        return $this->paginatedResponse($ragamEkrafs);
    }

    public function show($id)
    {
        $ragamEkraf = RagamEkraf::with('subsektor:id,name')->find($id);

        if (!$ragamEkraf) {
            return $this->notFoundResponse('Ragam Ekraf tidak ditemukan!');
        }

        return $this->successResponse($ragamEkraf);
    }

    public function bySubsektor($subsektorId)
    {
        $ragamEkrafs = RagamEkraf::with('subsektor:id,name')
            ->where('subsektor_id', $subsektorId)
            ->published()
            ->orderBy('date', 'desc')
            ->paginate(10);

        return $this->paginatedResponse($ragamEkrafs);
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
            'subsektor_id' => 'nullable|exists:subsektors,id',
            'is_published' => 'boolean'
        ]);

        $data = $request->all();
        $data['is_published'] = $request->get('is_published', true);

        $ragamEkraf = RagamEkraf::create($data);

        return $this->successResponse($ragamEkraf->load('subsektor:id,name'), 'Ragam Ekraf berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $ragamEkraf = RagamEkraf::find($id);

        if (!$ragamEkraf) {
            return $this->notFoundResponse('Ragam Ekraf tidak ditemukan!');
        }

        $this->validate($request, [
            'title' => 'string|max:255',
            'content' => 'string',
            'date' => 'date',
            'thumbnail' => 'string',
            'images' => 'nullable|array',
            'descriptions' => 'nullable|array',
            'subsektor_id' => 'nullable|exists:subsektors,id',
            'is_published' => 'boolean'
        ]);

        $ragamEkraf->update($request->all());

        return $this->successResponse($ragamEkraf->load('subsektor:id,name'), 'Ragam Ekraf berhasil diupdate!');
    }

    public function destroy($id)
    {
        $ragamEkraf = RagamEkraf::find($id);

        if (!$ragamEkraf) {
            return $this->notFoundResponse('Ragam Ekraf tidak ditemukan!');
        }

        $ragamEkraf->delete();

        return $this->successResponse(null, 'Ragam Ekraf berhasil dihapus!');
    }
}
