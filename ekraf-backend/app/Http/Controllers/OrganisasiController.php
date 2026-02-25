<?php

namespace App\Http\Controllers;

use App\Models\Organisasi;
use App\Models\OrgPengurus;
use App\Models\OrgKegiatan;
use App\Models\OrgLaporan;
use App\Traits\Uploadable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrganisasiController extends Controller
{
    use Uploadable;

    /**
     * Direktori OKP publik (hanya yang terverifikasi)
     */
    public function index(Request $request)
    {
        $query = Organisasi::with(['pengurus' => function ($q) {
            $q->active()->orderBy('jabatan');
        }])->terverifikasi();

        if ($request->has('search')) {
            $query->search($request->input('search'));
        }

        if ($request->has('bidang')) {
            $query->byBidang($request->input('bidang'));
        }

        $perPage = $request->input('per_page', 12);
        $organisasis = $query->orderBy('nama')->paginate($perPage);

        return $this->paginatedResponse($organisasis);
    }

    /**
     * Detail OKP publik
     */
    public function show($id)
    {
        $organisasi = Organisasi::with([
            'pengurus' => function ($q) { $q->active(); },
            'kegiatans' => function ($q) {
                $q->published()->orderBy('tanggal_mulai', 'desc')->limit(10);
            },
            'admin:id,name',
        ])->find($id);

        if (!$organisasi) {
            return $this->notFoundResponse('Organisasi tidak ditemukan');
        }

        return $this->successResponse($organisasi);
    }

    /**
     * Daftarkan OKP baru (masyarakat/admin_okp)
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'nama' => 'required|string|max:255',
            'singkatan' => 'nullable|string|max:50',
            'no_sk' => 'nullable|string|max:255',
            'tanggal_berdiri' => 'nullable|date',
            'bidang_fokus' => 'required|string|max:255',
            'alamat_sekretariat' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'email' => 'nullable|email',
            'no_telp' => 'nullable|string|max:20',
            'website' => 'nullable|string|max:255',
            'pengurus' => 'required|array|min:3',
            'pengurus.*.nama' => 'required|string',
            'pengurus.*.jabatan' => 'required|string',
        ]);

        $user = Auth::user();

        // Check if user already has a pending/verified OKP
        $existing = Organisasi::where('admin_id', $user->id)
            ->whereIn('status', ['pending_verifikasi', 'terverifikasi'])
            ->exists();

        if ($existing) {
            return $this->errorResponse('Anda sudah memiliki organisasi yang terdaftar', 422);
        }

        DB::beginTransaction();
        try {
            $organisasi = Organisasi::create([
                'nama' => $request->nama,
                'singkatan' => $request->singkatan,
                'slug' => Str::slug($request->nama),
                'no_sk' => $request->no_sk,
                'tanggal_berdiri' => $request->tanggal_berdiri,
                'bidang_fokus' => $request->bidang_fokus,
                'alamat_sekretariat' => $request->alamat_sekretariat,
                'deskripsi' => $request->deskripsi,
                'email' => $request->email,
                'no_telp' => $request->no_telp,
                'website' => $request->website,
                'sosial_media' => $request->sosial_media,
                'status' => 'pending_verifikasi',
                'admin_id' => $user->id,
            ]);

            // Upload logo if provided
            if ($request->hasFile('logo')) {
                $logoPath = $this->uploadImage($request->file('logo'), 'organisasi');
                $organisasi->update(['logo' => $logoPath]);
            }

            // Upload SK if provided
            if ($request->hasFile('file_sk')) {
                $skPath = $this->uploadDocument($request->file('file_sk'), 'organisasi-sk');
                $organisasi->update(['file_sk' => $skPath]);
            }

            // Create pengurus records
            foreach ($request->pengurus as $pengurus) {
                OrgPengurus::create([
                    'organisasi_id' => $organisasi->id,
                    'nama' => $pengurus['nama'],
                    'jabatan' => $pengurus['jabatan'],
                    'no_telp' => $pengurus['no_telp'] ?? null,
                    'email' => $pengurus['email'] ?? null,
                    'is_active' => true,
                ]);
            }

            DB::commit();

            return $this->successResponse(
                $organisasi->load('pengurus'),
                'Organisasi berhasil didaftarkan. Menunggu verifikasi admin.',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Gagal mendaftarkan organisasi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update profil OKP (admin OKP only)
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $organisasi = Organisasi::where('admin_id', $user->id)->find($id);

        if (!$organisasi && !$user->isAdmin()) {
            return $this->forbiddenResponse('Anda bukan admin organisasi ini');
        }

        if (!$organisasi) {
            $organisasi = Organisasi::find($id);
        }

        if (!$organisasi) {
            return $this->notFoundResponse('Organisasi tidak ditemukan');
        }

        $fillable = [
            'nama', 'singkatan', 'bidang_fokus', 'alamat_sekretariat',
            'deskripsi', 'email', 'no_telp', 'website', 'sosial_media',
        ];

        $organisasi->update($request->only($fillable));

        if ($request->hasFile('logo')) {
            $this->deleteFile($organisasi->logo);
            $organisasi->update(['logo' => $this->uploadImage($request->file('logo'), 'organisasi')]);
        }

        return $this->successResponse($organisasi, 'Profil organisasi berhasil diperbarui');
    }

    /**
     * Tambah pengurus OKP
     */
    public function storePengurus(Request $request, $id)
    {
        $this->validate($request, [
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:100',
            'no_telp' => 'nullable|string|max:20',
            'email' => 'nullable|email',
        ]);

        $user = Auth::user();
        $organisasi = Organisasi::where('admin_id', $user->id)->find($id);

        if (!$organisasi && !$user->isAdmin()) {
            return $this->forbiddenResponse();
        }

        $pengurus = OrgPengurus::create([
            'organisasi_id' => $id,
            'nama' => $request->nama,
            'jabatan' => $request->jabatan,
            'no_telp' => $request->no_telp,
            'email' => $request->email,
            'periode_mulai' => $request->periode_mulai,
            'periode_selesai' => $request->periode_selesai,
            'is_active' => true,
        ]);

        return $this->successResponse($pengurus, 'Pengurus berhasil ditambahkan', 201);
    }

    /**
     * Update pengurus OKP
     */
    public function updatePengurus(Request $request, $id, $pengurusId)
    {
        $user = Auth::user();
        $organisasi = Organisasi::where('admin_id', $user->id)->find($id);

        if (!$organisasi && !$user->isAdmin()) {
            return $this->forbiddenResponse();
        }

        $pengurus = OrgPengurus::where('organisasi_id', $id)->find($pengurusId);
        if (!$pengurus) {
            return $this->notFoundResponse('Pengurus tidak ditemukan');
        }

        $pengurus->update($request->only([
            'nama', 'jabatan', 'no_telp', 'email',
            'periode_mulai', 'periode_selesai', 'is_active',
        ]));

        return $this->successResponse($pengurus, 'Pengurus berhasil diperbarui');
    }

    /**
     * Hapus pengurus OKP
     */
    public function destroyPengurus($id, $pengurusId)
    {
        $user = Auth::user();
        $organisasi = Organisasi::where('admin_id', $user->id)->find($id);

        if (!$organisasi && !$user->isAdmin()) {
            return $this->forbiddenResponse();
        }

        $pengurus = OrgPengurus::where('organisasi_id', $id)->find($pengurusId);
        if (!$pengurus) {
            return $this->notFoundResponse('Pengurus tidak ditemukan');
        }

        $pengurus->delete();
        return $this->successResponse(null, 'Pengurus berhasil dihapus');
    }
}
