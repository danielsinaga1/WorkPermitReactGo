<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::active();

        if ($request->filled('category')) $query->where('category', $request->category);
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%$s%")
                  ->orWhere('document_number', 'like', "%$s%")
                  ->orWhere('description', 'like', "%$s%");
            });
        }

        $perPage = (int) $request->input('per_page', 20);
        return response()->json([
            'success' => true,
            'data' => $query->orderByDesc('updated_at')->paginate($perPage),
        ]);
    }

    public function show($id)
    {
        $doc = Document::findOrFail($id);
        return response()->json(['success' => true, 'data' => $doc]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title'            => 'required|string|max:255',
            'category'         => 'required|string|max:50',
            'file_path'        => 'required|string',
            'version'          => 'nullable|string',
            'document_number'  => 'nullable|string',
            'description'      => 'nullable|string',
            'file_type'        => 'nullable|string',
            'file_size'        => 'nullable|integer',
            'effective_date'   => 'nullable|date',
            'expiry_date'      => 'nullable|date',
            'allowed_roles'    => 'nullable|array',
            'uploaded_by_name' => 'required|string',
        ]);

        $doc = Document::create($request->all());
        return response()->json(['success' => true, 'data' => $doc], 201);
    }

    public function update(Request $request, $id)
    {
        $doc = Document::findOrFail($id);
        $doc->update($request->all());
        return response()->json(['success' => true, 'data' => $doc->fresh()]);
    }

    public function destroy($id)
    {
        $doc = Document::findOrFail($id);
        $doc->delete();
        return response()->json(['success' => true]);
    }

    public function download($id)
    {
        $doc = Document::findOrFail($id);
        $doc->increment('download_count');

        // The frontend will use the file_path to download (file is uploaded via UploadController separately).
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $doc->id,
                'title' => $doc->title,
                'file_path' => $doc->file_path,
                'file_type' => $doc->file_type,
                'download_count' => $doc->download_count,
            ],
        ]);
    }

    public function categories()
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['code' => 'sop', 'name' => 'SOP'],
                ['code' => 'plan', 'name' => 'Plan'],
                ['code' => 'risk_assessment', 'name' => 'Risk Assessment'],
                ['code' => 'report', 'name' => 'Report'],
                ['code' => 'procedure', 'name' => 'Procedure'],
                ['code' => 'form', 'name' => 'Form'],
                ['code' => 'manual', 'name' => 'Manual'],
                ['code' => 'policy', 'name' => 'Policy'],
            ],
        ]);
    }
}
