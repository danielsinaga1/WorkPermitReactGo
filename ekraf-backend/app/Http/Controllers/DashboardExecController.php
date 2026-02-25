<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Organisasi;
use App\Models\OrgKegiatan;
use App\Models\DestinasiWisata;
use App\Models\TiketWisata;
use App\Models\KatalogProduk;
use App\Models\PaymentLog;
use App\Models\Fasilitas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardExecController extends Controller
{
    /**
     * Dashboard eksekutif — full analytics
     */
    public function eksekutif()
    {
        $bulanIni = Carbon::now()->month;
        $tahunIni = Carbon::now()->year;

        // === RETRIBUSI ===
        $totalRetribusiBulanIni = Booking::where('status', 'terverifikasi')
            ->whereMonth('verified_at', $bulanIni)
            ->whereYear('verified_at', $tahunIni)
            ->sum('total_biaya');

        $totalRetribusiTahunIni = Booking::where('status', 'terverifikasi')
            ->whereYear('verified_at', $tahunIni)
            ->sum('total_biaya');

        $bookingBulanIni = Booking::whereMonth('created_at', $bulanIni)
            ->whereYear('created_at', $tahunIni)
            ->count();

        // === OKP ===
        $totalOKPAktif = Organisasi::terverifikasi()->count();
        $totalOKPPending = Organisasi::pending()->count();

        $kegiatanPemudaBulanIni = OrgKegiatan::bulanIni()->count();

        // === WISATA ===
        $totalDestinasiAktif = DestinasiWisata::active()->count();

        $pengunjungBulanIni = TiketWisata::where('status', 'digunakan')
            ->whereMonth('used_at', $bulanIni)
            ->whereYear('used_at', $tahunIni)
            ->sum('jumlah_tiket');

        $pendapatanTiketBulanIni = TiketWisata::whereIn('status', ['dibayar', 'digunakan'])
            ->whereMonth('created_at', $bulanIni)
            ->whereYear('created_at', $tahunIni)
            ->sum('total_harga');

        // === EKRAF ===
        $totalProdukKatalog = KatalogProduk::active()->verified()->count();

        // === TREND RETRIBUSI 12 BULAN TERAKHIR ===
        $trendRetribusi = Booking::where('status', 'terverifikasi')
            ->where('verified_at', '>=', Carbon::now()->subMonths(12))
            ->select(
                DB::raw('MONTH(verified_at) as bulan'),
                DB::raw('YEAR(verified_at) as tahun'),
                DB::raw('SUM(total_biaya) as total'),
                DB::raw('COUNT(*) as jumlah')
            )
            ->groupBy(DB::raw('YEAR(verified_at)'), DB::raw('MONTH(verified_at)'))
            ->orderBy(DB::raw('YEAR(verified_at)'))
            ->orderBy(DB::raw('MONTH(verified_at)'))
            ->get();

        // === TREND KUNJUNGAN WISATA 12 BULAN ===
        $trendWisata = TiketWisata::where('status', 'digunakan')
            ->where('used_at', '>=', Carbon::now()->subMonths(12))
            ->select(
                DB::raw('MONTH(used_at) as bulan'),
                DB::raw('YEAR(used_at) as tahun'),
                DB::raw('SUM(jumlah_tiket) as total_pengunjung')
            )
            ->groupBy(DB::raw('YEAR(used_at)'), DB::raw('MONTH(used_at)'))
            ->orderBy(DB::raw('YEAR(used_at)'))
            ->orderBy(DB::raw('MONTH(used_at)'))
            ->get();

        // === BOOKING PER STATUS ===
        $bookingPerStatus = Booking::select('status', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('status')
            ->get();

        // === TOP FASILITAS ===
        $topFasilitas = Booking::where('status', 'terverifikasi')
            ->whereYear('verified_at', $tahunIni)
            ->select('fasilitas_id', DB::raw('COUNT(*) as jumlah_booking'), DB::raw('SUM(total_biaya) as total_pendapatan'))
            ->groupBy('fasilitas_id')
            ->orderByDesc('total_pendapatan')
            ->limit(5)
            ->with('fasilitas:id,nama,jenis')
            ->get();

        // === TOP DESTINASI ===
        $topDestinasi = DestinasiWisata::active()
            ->orderByDesc('total_pengunjung')
            ->limit(5)
            ->get(['id', 'nama', 'kategori', 'total_pengunjung']);

        return $this->successResponse([
            'summary' => [
                'retribusi_bulan_ini' => $totalRetribusiBulanIni,
                'retribusi_tahun_ini' => $totalRetribusiTahunIni,
                'booking_bulan_ini' => $bookingBulanIni,
                'okp_aktif' => $totalOKPAktif,
                'okp_pending' => $totalOKPPending,
                'kegiatan_pemuda_bulan_ini' => $kegiatanPemudaBulanIni,
                'destinasi_aktif' => $totalDestinasiAktif,
                'pengunjung_wisata_bulan_ini' => $pengunjungBulanIni,
                'pendapatan_tiket_bulan_ini' => $pendapatanTiketBulanIni,
                'produk_katalog' => $totalProdukKatalog,
            ],
            'trend_retribusi' => $trendRetribusi,
            'trend_wisata' => $trendWisata,
            'booking_per_status' => $bookingPerStatus,
            'top_fasilitas' => $topFasilitas,
            'top_destinasi' => $topDestinasi,
        ]);
    }

    /**
     * Statistik publik ringkas (tanpa auth)
     */
    public function publik()
    {
        return $this->successResponse([
            'okp_aktif' => Organisasi::terverifikasi()->count(),
            'destinasi_wisata' => DestinasiWisata::active()->count(),
            'fasilitas_tersedia' => Fasilitas::active()->count(),
            'produk_ekraf' => KatalogProduk::active()->verified()->count(),
            'kegiatan_bulan_ini' => OrgKegiatan::bulanIni()->published()->count(),
        ]);
    }

    /**
     * Dashboard Retribusi — focused retribusi data & trend.
     */
    public function retribusi(Request $request)
    {
        $tahun = $request->get('tahun', Carbon::now()->year);

        $totalTahun = Booking::where('status', 'terverifikasi')
            ->whereYear('verified_at', $tahun)
            ->sum('total_biaya');

        $trend = Booking::where('status', 'terverifikasi')
            ->whereYear('verified_at', $tahun)
            ->select(
                DB::raw('MONTH(verified_at) as bulan'),
                DB::raw('SUM(total_biaya) as total'),
                DB::raw('COUNT(*) as jumlah')
            )
            ->groupBy(DB::raw('MONTH(verified_at)'))
            ->orderBy(DB::raw('MONTH(verified_at)'))
            ->get();

        $bookingPerStatus = Booking::whereYear('created_at', $tahun)
            ->select('status', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('status')
            ->get();

        $perFasilitas = Booking::where('status', 'terverifikasi')
            ->whereYear('verified_at', $tahun)
            ->select('fasilitas_id', DB::raw('COUNT(*) as jumlah_booking'), DB::raw('SUM(total_biaya) as total'))
            ->groupBy('fasilitas_id')
            ->orderByDesc('total')
            ->with('fasilitas:id,nama,jenis')
            ->get();

        return $this->successResponse([
            'total_retribusi_tahun' => $totalTahun,
            'trend_bulanan' => $trend,
            'booking_per_status' => $bookingPerStatus,
            'retribusi_per_fasilitas' => $perFasilitas,
        ]);
    }

    /**
     * Dashboard OKP — focused OKP statistics.
     */
    public function okp(Request $request)
    {
        $bulanIni = Carbon::now()->month;
        $tahunIni = Carbon::now()->year;

        $statusDistribusi = Organisasi::select('status', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('status')
            ->get();

        $bidangDistribusi = Organisasi::terverifikasi()
            ->select('bidang_fokus', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('bidang_fokus')
            ->get();

        $kegiatanPerBulan = OrgKegiatan::whereYear('tanggal_mulai', $tahunIni)
            ->select(
                DB::raw('MONTH(tanggal_mulai) as bulan'),
                DB::raw('COUNT(*) as jumlah')
            )
            ->groupBy(DB::raw('MONTH(tanggal_mulai)'))
            ->orderBy(DB::raw('MONTH(tanggal_mulai)'))
            ->get();

        $kegiatanPerJenis = OrgKegiatan::whereYear('tanggal_mulai', $tahunIni)
            ->select('jenis', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('jenis')
            ->get();

        $okpPalingAktif = Organisasi::terverifikasi()
            ->withCount(['kegiatans' => function ($q) use ($tahunIni) {
                $q->whereYear('tanggal_mulai', $tahunIni);
            }])
            ->orderByDesc('kegiatans_count')
            ->limit(10)
            ->get(['id', 'nama', 'singkatan']);

        return $this->successResponse([
            'total_okp' => Organisasi::count(),
            'okp_aktif' => Organisasi::terverifikasi()->count(),
            'okp_pending' => Organisasi::pending()->count(),
            'kegiatan_bulan_ini' => OrgKegiatan::bulanIni()->count(),
            'status_distribusi' => $statusDistribusi,
            'bidang_distribusi' => $bidangDistribusi,
            'kegiatan_per_bulan' => $kegiatanPerBulan,
            'kegiatan_per_jenis' => $kegiatanPerJenis,
            'okp_paling_aktif' => $okpPalingAktif,
        ]);
    }

    /**
     * Dashboard Wisata — focused tourism statistics.
     */
    public function wisata(Request $request)
    {
        $tahun = $request->get('tahun', Carbon::now()->year);

        $trendPengunjung = TiketWisata::where('status', 'digunakan')
            ->whereYear('used_at', $tahun)
            ->select(
                DB::raw('MONTH(used_at) as bulan'),
                DB::raw('SUM(jumlah_tiket) as total_pengunjung'),
                DB::raw('SUM(total_harga) as total_pendapatan')
            )
            ->groupBy(DB::raw('MONTH(used_at)'))
            ->orderBy(DB::raw('MONTH(used_at)'))
            ->get();

        $perKategori = DestinasiWisata::active()
            ->select('kategori', DB::raw('COUNT(*) as jumlah'))
            ->groupBy('kategori')
            ->get();

        $topDestinasi = DestinasiWisata::active()
            ->orderByDesc('total_pengunjung')
            ->limit(10)
            ->get(['id', 'nama', 'kategori', 'total_pengunjung']);

        $totalPendapatanTahun = TiketWisata::whereIn('status', ['dibayar', 'digunakan'])
            ->whereYear('created_at', $tahun)
            ->sum('total_harga');

        return $this->successResponse([
            'total_destinasi' => DestinasiWisata::active()->count(),
            'total_pengunjung_tahun' => TiketWisata::where('status', 'digunakan')
                ->whereYear('used_at', $tahun)->sum('jumlah_tiket'),
            'total_pendapatan_tahun' => $totalPendapatanTahun,
            'trend_pengunjung' => $trendPengunjung,
            'per_kategori' => $perKategori,
            'top_destinasi' => $topDestinasi,
        ]);
    }
}
