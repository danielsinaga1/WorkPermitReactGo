<?php

namespace App\Http\Controllers;

use App\Models\Subsektor;
use Illuminate\Http\Request;

class SubsektorController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
        $this->middleware('role:admin', ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        $query = Subsektor::orderBy('name');

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $subsektors = $query->get();

        return $this->successResponse($subsektors);
    }

    public function show($id)
    {
        $subsektor = Subsektor::with('ragamEkrafs')->find($id);

        if (!$subsektor) {
            return $this->notFoundResponse('Subsektor tidak ditemukan!');
        }

        return $this->successResponse($subsektor);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255|unique:subsektors,name',
            'image' => 'required|string',
            'description' => 'nullable|string'
        ]);

        $subsektor = Subsektor::create($request->all());

        return $this->successResponse($subsektor, 'Subsektor berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $subsektor = Subsektor::find($id);

        if (!$subsektor) {
            return $this->notFoundResponse('Subsektor tidak ditemukan!');
        }

        $this->validate($request, [
            'name' => 'string|max:255|unique:subsektors,name,' . $id,
            'image' => 'string',
            'description' => 'nullable|string'
        ]);

        $subsektor->update($request->all());

        return $this->successResponse($subsektor, 'Subsektor berhasil diupdate!');
    }

    public function destroy($id)
    {
        $subsektor = Subsektor::find($id);

        if (!$subsektor) {
            return $this->notFoundResponse('Subsektor tidak ditemukan!');
        }

        $subsektor->delete();

        return $this->successResponse(null, 'Subsektor berhasil dihapus!');
    }
}
