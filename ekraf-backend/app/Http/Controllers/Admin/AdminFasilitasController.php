<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use App\Models\FasilitasSlot;
use App\Models\FasilitasBlackout;
use App\Models\FasilitasTarif;
use App\Traits\Uploadable;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminFasilitasController extends Controller
{
    use Uploadable;

    /**
     * List ALL fasilitas (including inactive) — for admin panel.
     */
    public function index(Request $request)
    {
        $query = Fasilitas::with(['pengelola:id,name', 'tarifs']);

        if ($request->has('jenis')) {
            $query->byJenis($request->jenis);
        }

        if ($request->has('search')) {
            $query->search($request->search);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $perPage = $request->get('per_page', 15);
        $fasilitas = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return $this->paginatedResponse($fasilitas);
    }

    /**
     * Detail fasilitas — for admin (includes all relations).
     */
    public function show($id)
    {
        $fasilitas = Fasilitas::with(['pengelola', 'tarifs', 'slots', 'blackouts', 'bookings.user'])
            ->find($id);

        if (!$fasilitas) {
            return $this->notFoundResponse('Fasilitas tidak ditemukan');
        }

        return $this->successResponse($fasilitas);
    }

    /**
     * CRUD: Create fasilitas
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'nama' => 'required|string|max:255',
            'jenis' => 'required|in:gedung,stadion,lapangan,kolam_renang,gor,lainnya',
            'alamat' => 'required|string',
            'kapasitas' => 'nullable|integer|min:1',
            'pengelola_id' => 'nullable|exists:users,id',
        ]);

        $fasilitas = Fasilitas::create([
            'nama' => $request->nama,
            'slug' => Str::slug($request->nama),
            'jenis' => $request->jenis,
            'deskripsi' => $request->deskripsi,
            'alamat' => $request->alamat,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'kapasitas' => $request->kapasitas,
            'fasilitas_detail' => $request->fasilitas_detail,
            'pengelola_id' => $request->pengelola_id,
            'is_active' => true,
        ]);

        if ($request->hasFile('thumbnail')) {
            $fasilitas->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'fasilitas')
            ]);
        }

        // Create default tarifs if provided
        if ($request->has('tarifs') && is_array($request->tarifs)) {
            foreach ($request->tarifs as $tarif) {
                FasilitasTarif::create([
                    'fasilitas_id' => $fasilitas->id,
                    'nama_tarif' => $tarif['nama_tarif'],
                    'harga' => $tarif['harga'],
                    'satuan' => $tarif['satuan'] ?? 'per_jam',
                    'keterangan' => $tarif['keterangan'] ?? null,
                ]);
            }
        }

        return $this->successResponse(
            $fasilitas->load('tarifs'),
            'Fasilitas berhasil dibuat',
            201
        );
    }

    /**
     * CRUD: Update fasilitas
     */
    public function update(Request $request, $id)
    {
        $fasilitas = Fasilitas::find($id);
        if (!$fasilitas) {
            return $this->notFoundResponse('Fasilitas tidak ditemukan');
        }

        $fasilitas->update($request->only([
            'nama', 'jenis', 'deskripsi', 'alamat',
            'latitude', 'longitude', 'kapasitas',
            'fasilitas_detail', 'pengelola_id', 'is_active',
        ]));

        if ($request->has('nama')) {
            $fasilitas->update(['slug' => Str::slug($request->nama)]);
        }

        if ($request->hasFile('thumbnail')) {
            $this->deleteFile($fasilitas->thumbnail);
            $fasilitas->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'fasilitas')
            ]);
        }

        return $this->successResponse($fasilitas, 'Fasilitas berhasil diperbarui');
    }

    /**
     * CRUD: Delete fasilitas
     */
    public function destroy($id)
    {
        $fasilitas = Fasilitas::find($id);
        if (!$fasilitas) {
            return $this->notFoundResponse('Fasilitas tidak ditemukan');
        }

        $this->deleteFile($fasilitas->thumbnail);
        $fasilitas->delete();

        return $this->successResponse(null, 'Fasilitas berhasil dihapus');
    }

    /**
     * Kelola slot ketersediaan
     */
    public function storeSlot(Request $request, $id)
    {
        $this->validate($request, [
            'slots' => 'required|array|min:1',
            'slots.*.tanggal' => 'required|date',
            'slots.*.jam_mulai' => 'required|date_format:H:i',
            'slots.*.jam_selesai' => 'required|date_format:H:i',
        ]);

        $fasilitas = Fasilitas::find($id);
        if (!$fasilitas) {
            return $this->notFoundResponse('Fasilitas tidak ditemukan');
        }

        $created = [];
        foreach ($request->slots as $slotData) {
            $created[] = FasilitasSlot::create([
                'fasilitas_id' => $id,
                'tanggal' => $slotData['tanggal'],
                'jam_mulai' => $slotData['jam_mulai'],
                'jam_selesai' => $slotData['jam_selesai'],
                'status' => 'tersedia',
            ]);
        }

        return $this->successResponse($created, 'Slot berhasil ditambahkan', 201);
    }

    /**
     * Set tanggal blackout (fasilitas tidak tersedia)
     */
    public function storeBlackout(Request $request, $id)
    {
        $this->validate($request, [
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'alasan' => 'nullable|string|max:255',
        ]);

        $fasilitas = Fasilitas::find($id);
        if (!$fasilitas) {
            return $this->notFoundResponse('Fasilitas tidak ditemukan');
        }

        $blackout = FasilitasBlackout::create([
            'fasilitas_id' => $id,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'alasan' => $request->alasan,
        ]);

        // Mark existing slots in range as maintenance
        FasilitasSlot::where('fasilitas_id', $id)
            ->whereBetween('tanggal', [$request->tanggal_mulai, $request->tanggal_selesai])
            ->where('status', 'tersedia')
            ->update(['status' => 'maintenance']);

        return $this->successResponse($blackout, 'Blackout date berhasil ditambahkan', 201);
    }
}
