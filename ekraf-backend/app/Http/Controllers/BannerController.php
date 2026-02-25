<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
        $this->middleware('role:admin', ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        $query = Banner::active();

        if ($request->has('all') && $request->all == 'true') {
            $query = Banner::orderBy('order');
        }

        $banners = $query->get();

        return $this->successResponse($banners);
    }

    public function show($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return $this->notFoundResponse('Banner tidak ditemukan!');
        }

        return $this->successResponse($banner);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'required|string',
            'link_url' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $data = $request->all();
        $data['order'] = $request->get('order', 0);
        $data['is_active'] = $request->get('is_active', true);

        $banner = Banner::create($data);

        return $this->successResponse($banner, 'Banner berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return $this->notFoundResponse('Banner tidak ditemukan!');
        }

        $this->validate($request, [
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'string',
            'link_url' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $banner->update($request->all());

        return $this->successResponse($banner, 'Banner berhasil diupdate!');
    }

    public function destroy($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return $this->notFoundResponse('Banner tidak ditemukan!');
        }

        $banner->delete();

        return $this->successResponse(null, 'Banner berhasil dihapus!');
    }
}
