<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DestinasiWisata;
use App\Models\KatalogProduk;
use App\Models\Pelatihan;
use App\Models\EventFestival;
use App\Models\TiketWisata;
use App\Traits\Uploadable;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminContentController extends Controller
{
    use Uploadable;

    // =============================================
    // ADMIN INDEX — All content with filters
    // =============================================

    /**
     * List ALL destinasi wisata (including inactive).
     */
    public function indexDestinasi(Request $request)
    {
        $query = DestinasiWisata::query();

        if ($request->has('kategori')) {
            $query->byKategori($request->kategori);
        }
        if ($request->has('search')) {
            $query->search($request->search);
        }
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $perPage = $request->get('per_page', 15);
        return $this->paginatedResponse($query->orderBy('created_at', 'desc')->paginate($perPage));
    }

    /**
     * List ALL katalog produk (including unverified/inactive).
     */
    public function indexKatalog(Request $request)
    {
        $query = KatalogProduk::with(['subsektor:id,name', 'pemilik:id,name']);

        if ($request->has('kategori')) {
            $query->byKategori($request->kategori);
        }
        if ($request->has('search')) {
            $query->search($request->search);
        }
        if ($request->has('is_verified')) {
            $query->where('is_verified', $request->boolean('is_verified'));
        }

        $perPage = $request->get('per_page', 15);
        return $this->paginatedResponse($query->orderBy('created_at', 'desc')->paginate($perPage));
    }

    /**
     * List ALL pelatihan (including unpublished).
     */
    public function indexPelatihan(Request $request)
    {
        $query = Pelatihan::query();

        if ($request->has('kategori')) {
            $query->byKategori($request->kategori);
        }
        if ($request->has('search')) {
            $query->search($request->search);
        }

        $perPage = $request->get('per_page', 15);
        return $this->paginatedResponse($query->orderBy('created_at', 'desc')->paginate($perPage));
    }

    /**
     * List ALL event/festival (including unpublished).
     */
    public function indexEvent(Request $request)
    {
        $query = EventFestival::query();

        if ($request->has('kategori')) {
            $query->byKategori($request->kategori);
        }
        if ($request->has('search')) {
            $query->search($request->search);
        }

        $perPage = $request->get('per_page', 15);
        return $this->paginatedResponse($query->orderBy('created_at', 'desc')->paginate($perPage));
    }

    /**
     * List ALL tiket wisata for admin management.
     */
    public function indexTiket(Request $request)
    {
        $query = TiketWisata::with(['user:id,name,email', 'destinasi:id,nama']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('destinasi_id')) {
            $query->where('destinasi_id', $request->destinasi_id);
        }
        if ($request->has('tanggal_mulai') && $request->has('tanggal_selesai')) {
            $query->whereBetween('tanggal_kunjungan', [$request->tanggal_mulai, $request->tanggal_selesai]);
        }

        $perPage = $request->get('per_page', 15);
        return $this->paginatedResponse($query->orderBy('created_at', 'desc')->paginate($perPage));
    }

    // =============================================
    // DESTINASI WISATA CRUD
    // =============================================

    public function storeDestinasi(Request $request)
    {
        $this->validate($request, [
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'kategori' => 'required|in:alam,budaya,religi,kuliner,edukasi,buatan,bahari,lainnya',
        ]);

        $destinasi = DestinasiWisata::create(array_merge(
            $request->only([
                'nama', 'deskripsi', 'alamat', 'latitude', 'longitude',
                'kategori', 'jam_buka', 'jam_tutup', 'hari_operasional',
                'harga_tiket', 'harga_tiket_asing', 'fasilitas_wisata',
                'kontak', 'website', 'is_ticketed',
            ]),
            ['slug' => Str::slug($request->nama), 'is_active' => true]
        ));

        if ($request->hasFile('thumbnail')) {
            $destinasi->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'wisata')
            ]);
        }

        return $this->successResponse($destinasi, 'Destinasi wisata berhasil dibuat', 201);
    }

    public function updateDestinasi(Request $request, $id)
    {
        $destinasi = DestinasiWisata::find($id);
        if (!$destinasi) {
            return $this->notFoundResponse('Destinasi tidak ditemukan');
        }

        $destinasi->update($request->only([
            'nama', 'deskripsi', 'alamat', 'latitude', 'longitude',
            'kategori', 'jam_buka', 'jam_tutup', 'hari_operasional',
            'harga_tiket', 'harga_tiket_asing', 'fasilitas_wisata',
            'kontak', 'website', 'is_ticketed', 'is_active',
        ]));

        if ($request->has('nama')) {
            $destinasi->update(['slug' => Str::slug($request->nama)]);
        }

        if ($request->hasFile('thumbnail')) {
            $this->deleteFile($destinasi->thumbnail);
            $destinasi->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'wisata')
            ]);
        }

        return $this->successResponse($destinasi, 'Destinasi berhasil diperbarui');
    }

    public function destroyDestinasi($id)
    {
        $destinasi = DestinasiWisata::find($id);
        if (!$destinasi) {
            return $this->notFoundResponse('Destinasi tidak ditemukan');
        }

        $this->deleteFile($destinasi->thumbnail);
        $destinasi->delete();

        return $this->successResponse(null, 'Destinasi berhasil dihapus');
    }

    /**
     * Validasi tiket wisata di loket
     */
    public function validateTiket(Request $request, $id)
    {
        $tiket = TiketWisata::with('destinasi:id,nama')->find($id);
        if (!$tiket) {
            return $this->notFoundResponse('Tiket tidak ditemukan');
        }

        if ($tiket->status !== 'dibayar') {
            return $this->errorResponse('Tiket tidak valid. Status: ' . $tiket->status, 422);
        }

        if ($tiket->tanggal_kunjungan->format('Y-m-d') !== Carbon::now()->format('Y-m-d')) {
            return $this->errorResponse('Tiket untuk tanggal ' . $tiket->tanggal_kunjungan->format('d/m/Y'), 422);
        }

        $tiket->update([
            'status' => 'digunakan',
            'used_at' => Carbon::now(),
        ]);

        // Increment visitor count
        DestinasiWisata::where('id', $tiket->destinasi_id)
            ->increment('total_pengunjung', $tiket->jumlah_tiket);

        return $this->successResponse($tiket, 'Tiket berhasil divalidasi');
    }

    // =============================================
    // KATALOG PRODUK CRUD
    // =============================================

    public function storeKatalog(Request $request)
    {
        $this->validate($request, [
            'nama_produk' => 'required|string|max:255',
            'kategori' => 'required|in:batik,kuliner,kriya,fashion,seni_rupa,musik,fotografi,desain,lainnya',
        ]);

        $produk = KatalogProduk::create(array_merge(
            $request->only([
                'nama_produk', 'deskripsi', 'harga_mulai', 'harga_sampai',
                'kategori', 'subsektor_id', 'pemilik_id', 'nama_usaha',
                'kontak', 'whatsapp', 'alamat', 'latitude', 'longitude',
            ]),
            ['slug' => Str::slug($request->nama_produk), 'is_active' => true, 'is_verified' => true]
        ));

        if ($request->hasFile('thumbnail')) {
            $produk->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'katalog')
            ]);
        }

        return $this->successResponse($produk, 'Produk berhasil ditambahkan', 201);
    }

    public function updateKatalog(Request $request, $id)
    {
        $produk = KatalogProduk::find($id);
        if (!$produk) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        }

        $produk->update($request->only([
            'nama_produk', 'deskripsi', 'harga_mulai', 'harga_sampai',
            'kategori', 'subsektor_id', 'nama_usaha',
            'kontak', 'whatsapp', 'alamat', 'latitude', 'longitude',
            'is_verified', 'is_active',
        ]));

        if ($request->hasFile('thumbnail')) {
            $this->deleteFile($produk->thumbnail);
            $produk->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'katalog')
            ]);
        }

        return $this->successResponse($produk, 'Produk berhasil diperbarui');
    }

    public function destroyKatalog($id)
    {
        $produk = KatalogProduk::find($id);
        if (!$produk) {
            return $this->notFoundResponse('Produk tidak ditemukan');
        }

        $this->deleteFile($produk->thumbnail);
        $produk->delete();

        return $this->successResponse(null, 'Produk berhasil dihapus');
    }

    // =============================================
    // PELATIHAN CRUD
    // =============================================

    public function storePelatihan(Request $request)
    {
        $this->validate($request, [
            'judul' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'kategori' => 'required|in:kewirausahaan,digital_marketing,desain,kuliner,kerajinan,teknologi,manajemen,haki,lainnya',
        ]);

        $pelatihan = Pelatihan::create(array_merge(
            $request->only([
                'judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai',
                'lokasi', 'kuota', 'narasumber', 'kategori',
                'kontak_pendaftaran', 'link_pendaftaran',
            ]),
            ['slug' => Str::slug($request->judul), 'is_published' => $request->input('is_published', false)]
        ));

        if ($request->hasFile('thumbnail')) {
            $pelatihan->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'pelatihan')
            ]);
        }

        return $this->successResponse($pelatihan, 'Pelatihan berhasil dibuat', 201);
    }

    public function updatePelatihan(Request $request, $id)
    {
        $pelatihan = Pelatihan::find($id);
        if (!$pelatihan) {
            return $this->notFoundResponse('Pelatihan tidak ditemukan');
        }

        $pelatihan->update($request->only([
            'judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai',
            'lokasi', 'kuota', 'narasumber', 'kategori',
            'kontak_pendaftaran', 'link_pendaftaran', 'is_published',
        ]));

        if ($request->hasFile('thumbnail')) {
            $this->deleteFile($pelatihan->thumbnail);
            $pelatihan->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'pelatihan')
            ]);
        }

        return $this->successResponse($pelatihan, 'Pelatihan berhasil diperbarui');
    }

    public function destroyPelatihan($id)
    {
        $pelatihan = Pelatihan::find($id);
        if (!$pelatihan) {
            return $this->notFoundResponse('Pelatihan tidak ditemukan');
        }

        $this->deleteFile($pelatihan->thumbnail);
        $pelatihan->delete();

        return $this->successResponse(null, 'Pelatihan berhasil dihapus');
    }

    // =============================================
    // EVENT FESTIVAL CRUD
    // =============================================

    public function storeEvent(Request $request)
    {
        $this->validate($request, [
            'nama' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'kategori' => 'required|in:festival_budaya,pameran,kompetisi,konser,bazaar,seminar,workshop,lainnya',
        ]);

        $event = EventFestival::create(array_merge(
            $request->only([
                'nama', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai',
                'lokasi', 'kategori', 'penyelenggara', 'kontak',
                'website', 'harga_tiket',
            ]),
            ['slug' => Str::slug($request->nama), 'is_published' => $request->input('is_published', false)]
        ));

        if ($request->hasFile('thumbnail')) {
            $event->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'event')
            ]);
        }

        return $this->successResponse($event, 'Event berhasil dibuat', 201);
    }

    public function updateEvent(Request $request, $id)
    {
        $event = EventFestival::find($id);
        if (!$event) {
            return $this->notFoundResponse('Event tidak ditemukan');
        }

        $event->update($request->only([
            'nama', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai',
            'lokasi', 'kategori', 'penyelenggara', 'kontak',
            'website', 'harga_tiket', 'is_published',
        ]));

        if ($request->hasFile('thumbnail')) {
            $this->deleteFile($event->thumbnail);
            $event->update([
                'thumbnail' => $this->uploadImage($request->file('thumbnail'), 'event')
            ]);
        }

        return $this->successResponse($event, 'Event berhasil diperbarui');
    }

    public function destroyEvent($id)
    {
        $event = EventFestival::find($id);
        if (!$event) {
            return $this->notFoundResponse('Event tidak ditemukan');
        }

        $this->deleteFile($event->thumbnail);
        $event->delete();

        return $this->successResponse(null, 'Event berhasil dihapus');
    }
}
