<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organisasi;
use App\Models\OrgLaporan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminOrganisasiController extends Controller
{
    /**
     * Daftar OKP pending verifikasi
     */
    public function pending(Request $request)
    {
        $organisasis = Organisasi::with(['admin:id,name,email,no_telp', 'pengurus'])
            ->pending()
            ->orderBy('created_at', 'asc')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedResponse($organisasis);
    }

    /**
     * Semua OKP (admin view — semua status)
     */
    public function index(Request $request)
    {
        $query = Organisasi::with(['admin:id,name']);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('search')) {
            $query->search($request->input('search'));
        }

        $organisasis = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedResponse($organisasis);
    }

    /**
     * Verifikasi atau tolak OKP
     */
    public function verifikasi(Request $request, $id)
    {
        $this->validate($request, [
            'aksi' => 'required|in:verifikasi,tolak',
            'catatan_verifikasi' => 'nullable|string|max:500',
        ]);

        $organisasi = Organisasi::find($id);
        if (!$organisasi) {
            return $this->notFoundResponse('Organisasi tidak ditemukan');
        }

        if ($organisasi->status !== 'pending_verifikasi') {
            return $this->errorResponse('OKP tidak dalam status pending', 422);
        }

        $admin = Auth::user();

        if ($request->aksi === 'verifikasi') {
            $organisasi->update([
                'status' => 'terverifikasi',
                'verified_by' => $admin->id,
                'verified_at' => Carbon::now(),
                'catatan_verifikasi' => $request->catatan_verifikasi,
            ]);

            // Upgrade user role to admin_okp
            User::where('id', $organisasi->admin_id)
                ->where('role', 'masyarakat')
                ->update(['role' => 'admin_okp']);

            $message = 'OKP berhasil diverifikasi';
        } else {
            $organisasi->update([
                'status' => 'ditolak',
                'verified_by' => $admin->id,
                'verified_at' => Carbon::now(),
                'catatan_verifikasi' => $request->catatan_verifikasi,
            ]);

            $message = 'OKP ditolak';
        }

        return $this->successResponse($organisasi->fresh(), $message);
    }

    /**
     * Review laporan kegiatan OKP
     */
    public function reviewLaporan(Request $request, $orgId, $kegiatanId, $laporanId)
    {
        $this->validate($request, [
            'aksi' => 'required|in:terima,revisi,tolak',
            'catatan_review' => 'nullable|string|max:500',
        ]);

        $kegiatan = \App\Models\OrgKegiatan::where('organisasi_id', $orgId)->find($kegiatanId);
        if (!$kegiatan) {
            return $this->notFoundResponse('Kegiatan tidak ditemukan pada organisasi ini');
        }

        $laporan = OrgLaporan::where('kegiatan_id', $kegiatanId)->find($laporanId);
        if (!$laporan) {
            return $this->notFoundResponse('Laporan tidak ditemukan');
        }

        $statusMap = [
            'terima' => 'diterima',
            'revisi' => 'revisi',
            'tolak' => 'ditolak',
        ];

        $laporan->update([
            'status' => $statusMap[$request->aksi],
            'reviewed_by' => Auth::id(),
            'reviewed_at' => Carbon::now(),
            'catatan_review' => $request->catatan_review,
        ]);

        return $this->successResponse($laporan, 'Laporan berhasil direview');
    }
}
