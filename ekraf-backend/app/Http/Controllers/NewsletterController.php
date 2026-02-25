<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
        $this->middleware('role:admin,editor', ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        $query = Newsletter::published()->orderBy('date', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        $perPage = $request->get('per_page', 10);
        $newsletters = $query->paginate($perPage);

        return $this->paginatedResponse($newsletters);
    }

    public function show($id)
    {
        $newsletter = Newsletter::find($id);

        if (!$newsletter) {
            return $this->notFoundResponse('Newsletter tidak ditemukan!');
        }

        return $this->successResponse($newsletter);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
            'thumbnail' => 'required|string',
            'pdf_url' => 'required|string',
            'is_published' => 'boolean'
        ]);

        $data = $request->all();
        $data['is_published'] = $request->get('is_published', true);

        $newsletter = Newsletter::create($data);

        return $this->successResponse($newsletter, 'Newsletter berhasil dibuat!', 201);
    }

    public function update(Request $request, $id)
    {
        $newsletter = Newsletter::find($id);

        if (!$newsletter) {
            return $this->notFoundResponse('Newsletter tidak ditemukan!');
        }

        $this->validate($request, [
            'title' => 'string|max:255',
            'content' => 'string',
            'date' => 'date',
            'thumbnail' => 'string',
            'pdf_url' => 'string',
            'is_published' => 'boolean'
        ]);

        $newsletter->update($request->all());

        return $this->successResponse($newsletter, 'Newsletter berhasil diupdate!');
    }

    public function destroy($id)
    {
        $newsletter = Newsletter::find($id);

        if (!$newsletter) {
            return $this->notFoundResponse('Newsletter tidak ditemukan!');
        }

        $newsletter->delete();

        return $this->successResponse(null, 'Newsletter berhasil dihapus!');
    }
}
