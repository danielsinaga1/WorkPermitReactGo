<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\Pengumuman;
use App\Models\Promosi;
use App\Models\RagamEkraf;
use App\Models\Newsletter;
use App\Models\Pustaka;
use App\Models\ProdukHukum;
use App\Models\User;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware('role:admin,editor');
    }

    /**
     * Get dashboard statistics
     */
    public function stats()
    {
        $stats = [
            'total_berita' => Berita::count(),
            'total_pengumuman' => Pengumuman::count(),
            'total_promosi' => Promosi::count(),
            'total_ragam_ekraf' => RagamEkraf::count(),
            'total_newsletter' => Newsletter::count(),
            'total_pustaka' => Pustaka::count(),
            'total_produk_hukum' => ProdukHukum::count(),
            'total_users' => User::count(),
            'published_berita' => Berita::published()->count(),
            'published_pengumuman' => Pengumuman::published()->count(),
            'recent_berita' => Berita::with('author:id,name')
                ->published()
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'recent_pengumuman' => Pengumuman::published()
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'produk_hukum_by_category' => [
                'undang_undang' => ProdukHukum::byCategory('undang_undang')->count(),
                'peraturan_pemerintah' => ProdukHukum::byCategory('peraturan_pemerintah')->count(),
                'peraturan_presiden' => ProdukHukum::byCategory('peraturan_presiden')->count(),
                'peraturan_menteri' => ProdukHukum::byCategory('peraturan_menteri')->count(),
                'naskah_kerja_sama' => ProdukHukum::byCategory('naskah_kerja_sama')->count(),
                'rancangan_produk_hukum' => ProdukHukum::byCategory('rancangan_produk_hukum')->count(),
                'produk_hukum_lainnya' => ProdukHukum::byCategory('produk_hukum_lainnya')->count(),
            ]
        ];

        return $this->successResponse($stats);
    }
}
