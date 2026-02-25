<?php

namespace App\Http\Controllers;

use App\Models\OrgKegiatan;
use App\Models\OrgLaporan;
use App\Models\Organisasi;
use App\Traits\Uploadable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KegiatanController extends Controller
{
    use Uploadable;

    /**
     * Kalender kegiatan publik (agregator semua OKP)
     */
    public function indexPublik(Request $request)
    {
        $query = OrgKegiatan::with(['organisasi:id,nama,singkatan,logo'])
            ->published();

        if ($request->has('jenis')) {
            $query->byJenis($request->input('jenis'));
        }

        if ($request->has('bulan') && $request->has('tahun')) {
            $query->whereMonth('tanggal_mulai', $request->input('bulan'))
                  ->whereYear('tanggal_mulai', $request->input('tahun'));
        } elseif ($request->has('start') && $request->has('end')) {
            $query->whereBetween('tanggal_mulai', [$request->input('start'), $request->input('end')]);
        }

        $perPage = $request->input('per_page', 15);
        $kegiatans = $query->orderBy('tanggal_mulai', 'desc')->paginate($perPage);

        return $this->paginatedResponse($kegiatans);
    }

    /**
     * Buat kegiatan baru (admin OKP)
     */
    public function store(Request $request, $organisasiId)
    {
        $this->validate($request, [
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'nullable|string|max:255',
            'jenis' => 'required|in:rapat,pelatihan,bakti_sosial,olahraga,kesenian,pendidikan,lingkungan,lainnya',
            'peserta_target' => 'nullable|integer|min:1',
        ]);

        $user = Auth::user();
        $organisasi = Organisasi::where('admin_id', $user->id)->find($organisasiId);

        if (!$organisasi && !$user->isAdmin()) {
            return $this->forbiddenResponse('Anda bukan admin organisasi ini');
        }

        $kegiatan = OrgKegiatan::create([
            'organisasi_id' => $organisasiId,
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi' => $request->lokasi,
            'jenis' => $request->jenis,
            'peserta_target' => $request->peserta_target,
            'status' => 'diajukan',
            'is_published' => false,
        ]);

        if ($request->hasFile('thumbnail')) {
            $kegiatan->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'kegiatan')
            ]);
        }

        return $this->successResponse($kegiatan, 'Kegiatan berhasil dibuat', 201);
    }

    /**
     * Update kegiatan (admin OKP)
     */
    public function update(Request $request, $organisasiId, $id)
    {
        $user = Auth::user();
        $organisasi = Organisasi::where('admin_id', $user->id)->find($organisasiId);

        if (!$organisasi && !$user->isAdmin()) {
            return $this->forbiddenResponse();
        }

        $kegiatan = OrgKegiatan::where('organisasi_id', $organisasiId)->find($id);
        if (!$kegiatan) {
            return $this->notFoundResponse('Kegiatan tidak ditemukan');
        }

        $kegiatan->update($request->only([
            'judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai',
            'lokasi', 'jenis', 'peserta_target',
        ]));

        if ($request->hasFile('thumbnail')) {
            $this->deleteFile($kegiatan->thumbnail);
            $kegiatan->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'kegiatan')
            ]);
        }

        return $this->successResponse($kegiatan, 'Kegiatan berhasil diperbarui');
    }

    /**
     * Hapus kegiatan (admin OKP)
     */
    public function destroy($organisasiId, $id)
    {
        $user = Auth::user();
        $organisasi = Organisasi::where('admin_id', $user->id)->find($organisasiId);

        if (!$organisasi && !$user->isAdmin()) {
            return $this->forbiddenResponse();
        }

        $kegiatan = OrgKegiatan::where('organisasi_id', $organisasiId)->find($id);
        if (!$kegiatan) {
            return $this->notFoundResponse('Kegiatan tidak ditemukan');
        }

        $kegiatan->delete();
        return $this->successResponse(null, 'Kegiatan berhasil dihapus');
    }

    /**
     * Upload laporan kegiatan (admin OKP)
     */
    public function storeLaporan(Request $request, $organisasiId, $kegiatanId)
    {
        $this->validate($request, [
            'file_laporan' => 'required|file|mimes:pdf|max:10240', // 10MB
            'deskripsi' => 'nullable|string',
            'jumlah_peserta' => 'nullable|integer|min:0',
            'hasil_kegiatan' => 'nullable|string',
            'kendala' => 'nullable|string',
        ]);

        $user = Auth::user();
        $organisasi = Organisasi::where('admin_id', $user->id)->find($organisasiId);

        if (!$organisasi && !$user->isAdmin()) {
            return $this->forbiddenResponse();
        }

        $kegiatan = OrgKegiatan::where('organisasi_id', $organisasiId)->find($kegiatanId);
        if (!$kegiatan) {
            return $this->notFoundResponse('Kegiatan tidak ditemukan');
        }

        // Check if laporan already exists
        if ($kegiatan->laporan) {
            return $this->errorResponse('Laporan sudah pernah diunggah. Gunakan endpoint update.', 422);
        }

        $filePath = $this->uploadDocument($request->file('file_laporan'), 'laporan-kegiatan');

        $fotoKegiatan = [];
        if ($request->hasFile('foto_kegiatan')) {
            foreach ($request->file('foto_kegiatan') as $foto) {
                $fotoKegiatan[] = $this->uploadImage($foto, 'foto-kegiatan');
            }
        }

        $laporan = OrgLaporan::create([
            'kegiatan_id' => $kegiatanId,
            'file_laporan' => $filePath,
            'deskripsi' => $request->deskripsi,
            'foto_kegiatan' => $fotoKegiatan ?: null,
            'jumlah_peserta' => $request->jumlah_peserta,
            'hasil_kegiatan' => $request->hasil_kegiatan,
            'kendala' => $request->kendala,
            'status' => 'diajukan',
        ]);

        // Update kegiatan status
        $kegiatan->update(['status' => 'selesai']);

        return $this->successResponse($laporan, 'Laporan kegiatan berhasil diunggah', 201);
    }
}
