<?php

namespace App\Services;

use App\Models\ESignature;
use Illuminate\Http\Request;

class ESignatureService
{
    /**
     * Store an electronic signature for any signable entity.
     * Generates SHA-256 hash for integrity verification.
     */
    public function sign(
        string $signableType,
        int    $signableId,
        string $signatureImageBase64,
        string $signerName,
        ?int   $signerId = null,
        ?string $signerRole = null,
        ?Request $request = null
    ): ESignature {
        // Decode and store the signature image
        $imageData     = base64_decode($signatureImageBase64);
        $hash          = hash('sha256', $imageData);
        $fileName      = "signatures/{$hash}.png";
        $storagePath   = storage_path("app/public/{$fileName}");

        $dir = dirname($storagePath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        file_put_contents($storagePath, $imageData);

        return ESignature::create([
            'signable_type'        => $signableType,
            'signable_id'          => $signableId,
            'signer_id'            => $signerId,
            'signer_name'          => $signerName,
            'signer_role'          => $signerRole,
            'signature_image_path' => $fileName,
            'signature_hash'       => $hash,
            'signed_at'            => now(),
            'ip_address'           => $request?->ip(),
            'device_info'          => $request ? substr($request->userAgent() ?? '', 0, 255) : null,
            'gps_latitude'         => $request?->input('gps_latitude'),
            'gps_longitude'        => $request?->input('gps_longitude'),
        ]);
    }
}
