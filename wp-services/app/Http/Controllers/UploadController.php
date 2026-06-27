<?php

namespace App\Http\Controllers;

use App\Traits\Uploadable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    use Uploadable;

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Upload an image
     */
    public function uploadImage(Request $request)
    {
        $this->validate($request, [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120'
        ]);

        $file = $request->file('image');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        $path = $file->storeAs('public/images', $filename);
        $url = url('storage/images/' . $filename);

        return $this->successResponse(['url' => $url, 'path' => $path], 'Image berhasil diupload!');
    }

    /**
     * Upload a PDF document
     */
    public function uploadPdf(Request $request)
    {
        $this->validate($request, [
            'pdf' => 'required|mimes:pdf|max:10240'
        ]);

        $file = $request->file('pdf');
        $filename = Str::uuid() . '.pdf';

        $path = $file->storeAs('public/documents', $filename);
        $url = url('storage/documents/' . $filename);

        return $this->successResponse(['url' => $url, 'path' => $path], 'PDF berhasil diupload!');
    }

    /**
     * Delete a file
     */
    public function delete($filename)
    {
        $imagePath = 'public/images/' . $filename;
        $documentPath = 'public/documents/' . $filename;

        if (Storage::exists($imagePath)) {
            Storage::delete($imagePath);
            return $this->successResponse(null, 'File berhasil dihapus!');
        }

        if (Storage::exists($documentPath)) {
            Storage::delete($documentPath);
            return $this->successResponse(null, 'File berhasil dihapus!');
        }

        return $this->notFoundResponse('File tidak ditemukan!');
    }
}
