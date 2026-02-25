<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\YouthOpportunity;
use App\Models\Atlet;
use App\Models\Pelatih;
use App\Models\Turnamen;
use App\Models\PesertaTurnamen;
use App\Models\PelakuEkraf;
use App\Models\Haki;
use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminNewFeaturesController extends Controller
{
    // ================================================================
    // YOUTH OPPORTUNITY CRUD
    // ================================================================

    public function indexYouth(Request $request)
    {
        $query = YouthOpportunity::orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('jenis') && $request->jenis) {
            $query->byJenis($request->jenis);
        }

        $perPage = $request->get('per_page', 10);
        return $this->paginatedResponse($query->paginate($perPage));
    }

    public function storeYouth(Request $request)
    {
        $this->validate($request, [
            'judul' => 'required|string|max:255',
            'jenis' => 'required|in:beasiswa,lowongan_kerja,magang',
            'deskripsi' => 'nullable|string',
            'penyelenggara' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'batas_pendaftaran' => 'nullable|date',
            'link_pendaftaran' => 'nullable|string',
            'kontak' => 'nullable|string|max:255',
            'thumbnail' => 'nullable|string',
            'persyaratan' => 'nullable|array',
            'gaji_min' => 'nullable|numeric',
            'gaji_max' => 'nullable|numeric',
            'is_published' => 'boolean',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($data['judul']) . '-' . Str::random(5);
        $data['is_published'] = $request->get('is_published', true);

        $item = YouthOpportunity::create($data);

        return $this->successResponse($item, 'Data berhasil dibuat!', 201);
    }

    public function updateYouth(Request $request, $id)
    {
        $item = YouthOpportunity::find($id);
        if (!$item) return $this->notFoundResponse();

        $this->validate($request, [
            'judul' => 'string|max:255',
            'jenis' => 'in:beasiswa,lowongan_kerja,magang',
            'is_published' => 'boolean',
        ]);

        $item->update($request->all());
        return $this->successResponse($item, 'Data berhasil diperbarui!');
    }

    public function destroyYouth($id)
    {
        $item = YouthOpportunity::find($id);
        if (!$item) return $this->notFoundResponse();
        $item->delete();
        return $this->successResponse(null, 'Data berhasil dihapus!');
    }

    // ================================================================
    // ATLET CRUD
    // ================================================================

    public function indexAtlet(Request $request)
    {
        $query = Atlet::orderBy('nama');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('cabang') && $request->cabang) {
            $query->byCabang($request->cabang);
        }

        $perPage = $request->get('per_page', 10);
        return $this->paginatedResponse($query->paginate($perPage));
    }

    public function storeAtlet(Request $request)
    {
        $this->validate($request, [
            'nama' => 'required|string|max:255',
            'cabang_olahraga' => 'required|string|max:255',
            'jenis_kelamin' => 'in:L,P',
            'tanggal_lahir' => 'nullable|date',
            'foto' => 'nullable|string',
            'prestasi' => 'nullable|array',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($data['nama']) . '-' . Str::random(5);

        $atlet = Atlet::create($data);
        return $this->successResponse($atlet, 'Atlet berhasil ditambahkan!', 201);
    }

    public function updateAtlet(Request $request, $id)
    {
        $atlet = Atlet::find($id);
        if (!$atlet) return $this->notFoundResponse();
        $atlet->update($request->all());
        return $this->successResponse($atlet, 'Data atlet berhasil diperbarui!');
    }

    public function destroyAtlet($id)
    {
        $atlet = Atlet::find($id);
        if (!$atlet) return $this->notFoundResponse();
        $atlet->delete();
        return $this->successResponse(null, 'Atlet berhasil dihapus!');
    }

    // ================================================================
    // PELATIH CRUD
    // ================================================================

    public function indexPelatih(Request $request)
    {
        $query = Pelatih::orderBy('nama');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('cabang') && $request->cabang) {
            $query->byCabang($request->cabang);
        }

        $perPage = $request->get('per_page', 10);
        return $this->paginatedResponse($query->paginate($perPage));
    }

    public function storePelatih(Request $request)
    {
        $this->validate($request, [
            'nama' => 'required|string|max:255',
            'cabang_olahraga' => 'required|string|max:255',
            'jenis_kelamin' => 'in:L,P',
            'lisensi' => 'nullable|string|max:255',
            'foto' => 'nullable|string',
            'pengalaman' => 'nullable|array',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($data['nama']) . '-' . Str::random(5);

        $pelatih = Pelatih::create($data);
        return $this->successResponse($pelatih, 'Pelatih berhasil ditambahkan!', 201);
    }

    public function updatePelatih(Request $request, $id)
    {
        $pelatih = Pelatih::find($id);
        if (!$pelatih) return $this->notFoundResponse();
        $pelatih->update($request->all());
        return $this->successResponse($pelatih, 'Data pelatih berhasil diperbarui!');
    }

    public function destroyPelatih($id)
    {
        $pelatih = Pelatih::find($id);
        if (!$pelatih) return $this->notFoundResponse();
        $pelatih->delete();
        return $this->successResponse(null, 'Pelatih berhasil dihapus!');
    }

    // ================================================================
    // TURNAMEN CRUD
    // ================================================================

    public function indexTurnamen(Request $request)
    {
        $query = Turnamen::withCount('peserta')
            ->orderBy('tanggal_mulai', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('cabang') && $request->cabang) {
            $query->byCabang($request->cabang);
        }
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);
        return $this->paginatedResponse($query->paginate($perPage));
    }

    public function storeTurnamen(Request $request)
    {
        $this->validate($request, [
            'nama' => 'required|string|max:255',
            'cabang_olahraga' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date',
            'lokasi' => 'nullable|string|max:255',
            'kuota_peserta' => 'nullable|integer',
            'thumbnail' => 'nullable|string',
            'batas_pendaftaran' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($data['nama']) . '-' . Str::random(5);
        $data['is_published'] = $request->get('is_published', true);

        $turnamen = Turnamen::create($data);
        return $this->successResponse($turnamen, 'Turnamen berhasil dibuat!', 201);
    }

    public function updateTurnamen(Request $request, $id)
    {
        $turnamen = Turnamen::find($id);
        if (!$turnamen) return $this->notFoundResponse();
        $turnamen->update($request->all());
        return $this->successResponse($turnamen, 'Turnamen berhasil diperbarui!');
    }

    public function destroyTurnamen($id)
    {
        $turnamen = Turnamen::find($id);
        if (!$turnamen) return $this->notFoundResponse();
        $turnamen->delete();
        return $this->successResponse(null, 'Turnamen berhasil dihapus!');
    }

    public function pesertaTurnamen(Request $request, $id)
    {
        $turnamen = Turnamen::find($id);
        if (!$turnamen) return $this->notFoundResponse();

        $peserta = PesertaTurnamen::where('turnamen_id', $id)
            ->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->successResponse($peserta);
    }

    // ================================================================
    // PELAKU EKRAF CRUD
    // ================================================================

    public function indexPelaku(Request $request)
    {
        $query = PelakuEkraf::with('subsektor', 'user:id,name')
            ->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('subsektor_id') && $request->subsektor_id) {
            $query->where('subsektor_id', $request->subsektor_id);
        }
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        if ($request->has('skala_usaha') && $request->skala_usaha) {
            $query->where('skala_usaha', $request->skala_usaha);
        }

        $perPage = $request->get('per_page', 10);
        return $this->paginatedResponse($query->paginate($perPage));
    }

    public function storePelaku(Request $request)
    {
        $this->validate($request, [
            'nama' => 'required|string|max:255',
            'nama_usaha' => 'nullable|string|max:255',
            'subsektor_id' => 'nullable|integer|exists:subsektors,id',
            'skala_usaha' => 'in:mikro,kecil,menengah,besar',
            'no_telp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'foto' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($data['nama']) . '-' . Str::random(5);
        $data['status'] = 'pending';

        $pelaku = PelakuEkraf::create($data);
        return $this->successResponse($pelaku->load('subsektor'), 'Pelaku ekraf berhasil ditambahkan!', 201);
    }

    public function updatePelaku(Request $request, $id)
    {
        $pelaku = PelakuEkraf::find($id);
        if (!$pelaku) return $this->notFoundResponse();
        $pelaku->update($request->all());
        return $this->successResponse($pelaku->load('subsektor'), 'Data pelaku ekraf berhasil diperbarui!');
    }

    public function destroyPelaku($id)
    {
        $pelaku = PelakuEkraf::find($id);
        if (!$pelaku) return $this->notFoundResponse();
        $pelaku->delete();
        return $this->successResponse(null, 'Pelaku ekraf berhasil dihapus!');
    }

    public function verifikasiPelaku(Request $request, $id)
    {
        $pelaku = PelakuEkraf::find($id);
        if (!$pelaku) return $this->notFoundResponse();

        $this->validate($request, [
            'status' => 'required|in:terverifikasi,ditolak',
            'catatan_verifikasi' => 'nullable|string',
        ]);

        $pelaku->update([
            'status' => $request->status,
            'catatan_verifikasi' => $request->catatan_verifikasi,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        return $this->successResponse($pelaku, 'Status pelaku ekraf berhasil diperbarui!');
    }

    // ================================================================
    // HAKI CRUD
    // ================================================================

    public function indexHaki(Request $request)
    {
        $query = Haki::with('user:id,name', 'pelakuEkraf:id,nama,nama_usaha')
            ->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('jenis_haki') && $request->jenis_haki) {
            $query->byJenis($request->jenis_haki);
        }
        if ($request->has('status') && $request->status) {
            $query->byStatus($request->status);
        }

        $perPage = $request->get('per_page', 10);
        return $this->paginatedResponse($query->paginate($perPage));
    }

    public function storeHaki(Request $request)
    {
        $this->validate($request, [
            'nama_produk' => 'required|string|max:255',
            'jenis_haki' => 'required|in:merek,paten,hak_cipta,desain_industri,indikasi_geografis',
            'pelaku_ekraf_id' => 'nullable|integer|exists:pelaku_ekrafs,id',
            'deskripsi' => 'nullable|string',
            'file_permohonan' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($data['nama_produk']) . '-' . Str::random(5);
        $data['user_id'] = auth()->id();
        $data['status'] = 'draft';

        $haki = Haki::create($data);
        return $this->successResponse($haki, 'Permohonan HAKI berhasil dibuat!', 201);
    }

    public function updateHaki(Request $request, $id)
    {
        $haki = Haki::find($id);
        if (!$haki) return $this->notFoundResponse();
        $haki->update($request->all());
        return $this->successResponse($haki, 'Data HAKI berhasil diperbarui!');
    }

    public function destroyHaki($id)
    {
        $haki = Haki::find($id);
        if (!$haki) return $this->notFoundResponse();
        $haki->delete();
        return $this->successResponse(null, 'Data HAKI berhasil dihapus!');
    }

    // ================================================================
    // PENGADUAN MANAGEMENT
    // ================================================================

    public function indexPengaduan(Request $request)
    {
        $query = Pengaduan::with('user:id,name', 'penanggap:id,name')
            ->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }
        if ($request->has('status') && $request->status) {
            $query->byStatus($request->status);
        }
        if ($request->has('kategori') && $request->kategori) {
            $query->byKategori($request->kategori);
        }

        $perPage = $request->get('per_page', 10);
        return $this->paginatedResponse($query->paginate($perPage));
    }

    public function tanggapiPengaduan(Request $request, $id)
    {
        $pengaduan = Pengaduan::find($id);
        if (!$pengaduan) return $this->notFoundResponse();

        $this->validate($request, [
            'status' => 'required|in:diproses,ditanggapi,selesai,ditolak',
            'tanggapan' => 'nullable|string',
        ]);

        $pengaduan->update([
            'status' => $request->status,
            'tanggapan' => $request->tanggapan,
            'ditanggapi_oleh' => auth()->id(),
            'ditanggapi_at' => now(),
        ]);

        return $this->successResponse($pengaduan->load('penanggap:id,name'), 'Pengaduan berhasil ditanggapi!');
    }
}
