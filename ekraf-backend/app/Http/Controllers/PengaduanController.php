<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
use Illuminate\Http\Request;

class PengaduanController extends Controller
{
    /**
     * Submit pengaduan (public / authenticated).
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'nama_pelapor' => 'required|string|max:255',
            'email_pelapor' => 'nullable|email|max:255',
            'no_telp_pelapor' => 'nullable|string|max:20',
            'kategori' => 'required|in:fasilitas,pelayanan,saran,lainnya',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'lokasi' => 'nullable|string|max:255',
            'foto_lampiran' => 'nullable|array',
        ]);

        $data = $request->all();
        $data['kode_pengaduan'] = Pengaduan::generateKode();
        $data['user_id'] = auth()->id() ?? null;
        $data['status'] = 'baru';

        $pengaduan = Pengaduan::create($data);

        return $this->successResponse($pengaduan, 'Pengaduan berhasil dikirim!', 201);
    }

    /**
     * Track pengaduan by kode.
     */
    public function track($kode)
    {
        $pengaduan = Pengaduan::where('kode_pengaduan', $kode)->first();

        if (!$pengaduan) {
            return $this->notFoundResponse('Pengaduan tidak ditemukan!');
        }

        return $this->successResponse($pengaduan);
    }
}
