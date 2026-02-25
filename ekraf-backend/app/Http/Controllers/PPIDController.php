<?php

namespace App\Http\Controllers;

use App\Models\PPID;
use Illuminate\Http\Request;

class PPIDController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show', 'bySection']]);
        $this->middleware('role:admin', ['except' => ['index', 'show', 'bySection']]);
    }

    public function index()
    {
        $ppids = PPID::all();

        return $this->successResponse($ppids);
    }

    public function show($id)
    {
        $ppid = PPID::find($id);

        if (!$ppid) {
            return $this->notFoundResponse('Data PPID tidak ditemukan!');
        }

        return $this->successResponse($ppid);
    }

    public function bySection($section)
    {
        if (!in_array($section, PPID::getSections())) {
            return $this->errorResponse('Section tidak valid!', 400);
        }

        $ppid = PPID::bySection($section)->first();

        if (!$ppid) {
            return $this->notFoundResponse('Data PPID untuk section ini tidak ditemukan!');
        }

        return $this->successResponse($ppid);
    }

    public function store(Request $request)
    {
        $sections = implode(',', PPID::getSections());

        $this->validate($request, [
            'section' => "required|in:{$sections}",
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'file_url' => 'nullable|string'
        ]);

        $ppid = PPID::create($request->all());

        return $this->successResponse($ppid, 'Data PPID berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $ppid = PPID::find($id);

        if (!$ppid) {
            return $this->notFoundResponse('Data PPID tidak ditemukan!');
        }

        $sections = implode(',', PPID::getSections());

        $this->validate($request, [
            'section' => "in:{$sections}",
            'title' => 'string|max:255',
            'content' => 'string',
            'file_url' => 'nullable|string'
        ]);

        $ppid->update($request->all());

        return $this->successResponse($ppid, 'Data PPID berhasil diupdate!');
    }

    public function destroy($id)
    {
        $ppid = PPID::find($id);

        if (!$ppid) {
            return $this->notFoundResponse('Data PPID tidak ditemukan!');
        }

        $ppid->delete();

        return $this->successResponse(null, 'Data PPID berhasil dihapus!');
    }
}
