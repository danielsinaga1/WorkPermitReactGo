<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait Uploadable
{
    /**
     * Upload an image file
     */
    protected function uploadImage(UploadedFile $file, $folder = 'images')
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("public/{$folder}", $filename);
        
        return str_replace('public/', 'storage/', $path);
    }

    /**
     * Upload a document file
     */
    protected function uploadDocument(UploadedFile $file, $folder = 'documents')
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("public/{$folder}", $filename);
        
        return str_replace('public/', 'storage/', $path);
    }

    /**
     * Delete a file from storage
     */
    protected function deleteFile($path)
    {
        if ($path) {
            $storagePath = str_replace('storage/', 'public/', $path);
            if (Storage::exists($storagePath)) {
                Storage::delete($storagePath);
                return true;
            }
        }
        return false;
    }

    /**
     * Get the full URL of a file
     */
    protected function getFileUrl($path)
    {
        if ($path) {
            return url($path);
        }
        return null;
    }
}
