<?php

namespace App\Http\Controllers;

use App\Models\ProfilPimpinan;
use Illuminate\Http\Request;

class ProfilController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['indexPimpinan', 'showPimpinan']]);
        $this->middleware('role:admin', ['except' => ['indexPimpinan', 'showPimpinan']]);
    }

    /**
     * Get all pimpinan
     */
    public function indexPimpinan()
    {
        $pimpinans = ProfilPimpinan::ordered()->get();

        return $this->successResponse($pimpinans);
    }

    /**
     * Get pimpinan by ID
     */
    public function showPimpinan($id)
    {
        $pimpinan = ProfilPimpinan::find($id);

        if (!$pimpinan) {
            return $this->notFoundResponse('Profil Pimpinan tidak ditemukan!');
        }

        return $this->successResponse($pimpinan);
    }

    /**
     * Store new pimpinan
     */
    public function storePimpinan(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'photo' => 'required|string',
            'biography' => 'nullable|string',
            'order' => 'integer'
        ]);

        $data = $request->all();
        $data['order'] = $request->get('order', 0);

        $pimpinan = ProfilPimpinan::create($data);

        return $this->successResponse($pimpinan, 'Profil Pimpinan berhasil dibuat!', 201);
    }

    /**
     * Update pimpinan
     */
    public function updatePimpinan(Request $request, $id)
    {
        $pimpinan = ProfilPimpinan::find($id);

        if (!$pimpinan) {
            return $this->notFoundResponse('Profil Pimpinan tidak ditemukan!');
        }

        $this->validate($request, [
            'name' => 'string|max:255',
            'position' => 'string|max:255',
            'photo' => 'string',
            'biography' => 'nullable|string',
            'order' => 'integer'
        ]);

        $pimpinan->update($request->all());

        return $this->successResponse($pimpinan, 'Profil Pimpinan berhasil diupdate!');
    }

    /**
     * Delete pimpinan
     */
    public function destroyPimpinan($id)
    {
        $pimpinan = ProfilPimpinan::find($id);

        if (!$pimpinan) {
            return $this->notFoundResponse('Profil Pimpinan tidak ditemukan!');
        }

        $pimpinan->delete();

        return $this->successResponse(null, 'Profil Pimpinan berhasil dihapus!');
    }
}
