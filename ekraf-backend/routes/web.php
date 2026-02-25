<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

$router->get('/', function () use ($router) {
    return response()->json([
        'name' => 'EKRAF API',
        'version' => '1.0.0',
        'framework' => $router->app->version(),
        'message' => 'Selamat datang di EKRAF Backend API'
    ]);
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

$router->group(['prefix' => 'api'], function () use ($router) {

    // =====================
    // AUTH ROUTES
    // =====================
    $router->group(['prefix' => 'auth'], function () use ($router) {
        $router->post('login', 'AuthController@login');
        $router->post('register', 'AuthController@register');
        $router->post('logout', 'AuthController@logout');
        $router->get('me', 'AuthController@me');
        $router->post('refresh', 'AuthController@refresh');
        $router->put('change-password', 'AuthController@changePassword');
        $router->put('profile', 'AuthController@updateProfile');
    });

    // =====================
    // BERITA ROUTES
    // =====================
    $router->group(['prefix' => 'berita'], function () use ($router) {
        $router->get('/', 'BeritaController@index');
        $router->get('/{id}', 'BeritaController@show');
        $router->post('/', 'BeritaController@store');
        $router->put('/{id}', 'BeritaController@update');
        $router->delete('/{id}', 'BeritaController@destroy');
    });

    // =====================
    // PENGUMUMAN ROUTES
    // =====================
    $router->group(['prefix' => 'pengumuman'], function () use ($router) {
        $router->get('/', 'PengumumanController@index');
        $router->get('/{id}', 'PengumumanController@show');
        $router->post('/', 'PengumumanController@store');
        $router->put('/{id}', 'PengumumanController@update');
        $router->delete('/{id}', 'PengumumanController@destroy');
    });

    // =====================
    // PROMOSI ROUTES
    // =====================
    $router->group(['prefix' => 'promosi'], function () use ($router) {
        $router->get('/', 'PromosiController@index');
        $router->get('/{id}', 'PromosiController@show');
        $router->post('/', 'PromosiController@store');
        $router->put('/{id}', 'PromosiController@update');
        $router->delete('/{id}', 'PromosiController@destroy');
    });

    // =====================
    // RAGAM EKRAF ROUTES
    // =====================
    $router->group(['prefix' => 'ragam-ekraf'], function () use ($router) {
        $router->get('/', 'RagamEkrafController@index');
        $router->get('/{id}', 'RagamEkrafController@show');
        $router->get('/subsektor/{subsektorId}', 'RagamEkrafController@bySubsektor');
        $router->post('/', 'RagamEkrafController@store');
        $router->put('/{id}', 'RagamEkrafController@update');
        $router->delete('/{id}', 'RagamEkrafController@destroy');
    });

    // =====================
    // SUBSEKTOR ROUTES
    // =====================
    $router->group(['prefix' => 'subsektor'], function () use ($router) {
        $router->get('/', 'SubsektorController@index');
        $router->get('/{id}', 'SubsektorController@show');
        $router->post('/', 'SubsektorController@store');
        $router->put('/{id}', 'SubsektorController@update');
        $router->delete('/{id}', 'SubsektorController@destroy');
    });

    // =====================
    // NEWSLETTER ROUTES
    // =====================
    $router->group(['prefix' => 'newsletter'], function () use ($router) {
        $router->get('/', 'NewsletterController@index');
        $router->get('/{id}', 'NewsletterController@show');
        $router->post('/', 'NewsletterController@store');
        $router->put('/{id}', 'NewsletterController@update');
        $router->delete('/{id}', 'NewsletterController@destroy');
    });

    // =====================
    // PUSTAKA ROUTES
    // =====================
    $router->group(['prefix' => 'pustaka'], function () use ($router) {
        $router->get('/', 'PustakaController@index');
        $router->get('/{id}', 'PustakaController@show');
        $router->post('/', 'PustakaController@store');
        $router->put('/{id}', 'PustakaController@update');
        $router->delete('/{id}', 'PustakaController@destroy');
    });

    // =====================
    // TENAGA KERJA ROUTES
    // =====================
    $router->group(['prefix' => 'tenaga-kerja'], function () use ($router) {
        $router->get('/', 'TenagaKerjaController@index');
        $router->get('/{id}', 'TenagaKerjaController@show');
        $router->post('/', 'TenagaKerjaController@store');
        $router->put('/{id}', 'TenagaKerjaController@update');
        $router->delete('/{id}', 'TenagaKerjaController@destroy');
    });

    // =====================
    // PRODUK HUKUM ROUTES
    // =====================
    $router->group(['prefix' => 'produk-hukum'], function () use ($router) {
        $router->get('/', 'ProdukHukumController@index');
        $router->get('/category/{category}', 'ProdukHukumController@byCategory');
        $router->get('/{id}', 'ProdukHukumController@show');
        $router->post('/', 'ProdukHukumController@store');
        $router->put('/{id}', 'ProdukHukumController@update');
        $router->delete('/{id}', 'ProdukHukumController@destroy');
    });

    // =====================
    // BANNER ROUTES
    // =====================
    $router->group(['prefix' => 'banner'], function () use ($router) {
        $router->get('/', 'BannerController@index');
        $router->get('/{id}', 'BannerController@show');
        $router->post('/', 'BannerController@store');
        $router->put('/{id}', 'BannerController@update');
        $router->delete('/{id}', 'BannerController@destroy');
    });

    // =====================
    // STATISTIK ROUTES
    // =====================
    $router->group(['prefix' => 'statistik'], function () use ($router) {
        $router->get('/', 'StatistikController@index');
        $router->get('/year/{year}', 'StatistikController@byYear');
        $router->get('/{id}', 'StatistikController@show');
        $router->post('/', 'StatistikController@store');
        $router->put('/{id}', 'StatistikController@update');
        $router->delete('/{id}', 'StatistikController@destroy');
    });

    // =====================
    // PPID ROUTES
    // =====================
    $router->group(['prefix' => 'ppid'], function () use ($router) {
        $router->get('/', 'PPIDController@index');
        $router->get('/section/{section}', 'PPIDController@bySection');
        $router->get('/{id}', 'PPIDController@show');
        $router->post('/', 'PPIDController@store');
        $router->put('/{id}', 'PPIDController@update');
        $router->delete('/{id}', 'PPIDController@destroy');
    });

    // =====================
    // PROFIL ROUTES
    // =====================
    $router->group(['prefix' => 'profil'], function () use ($router) {
        $router->get('/pimpinan', 'ProfilController@indexPimpinan');
        $router->get('/pimpinan/{id}', 'ProfilController@showPimpinan');
        $router->post('/pimpinan', 'ProfilController@storePimpinan');
        $router->put('/pimpinan/{id}', 'ProfilController@updatePimpinan');
        $router->delete('/pimpinan/{id}', 'ProfilController@destroyPimpinan');
    });

    // =====================
    // REFORMASI BIROKRASI ROUTES
    // =====================
    $router->group(['prefix' => 'reformasi-birokrasi'], function () use ($router) {
        $router->get('/', 'ReformasiBirokrasiController@index');
        $router->get('/{id}', 'ReformasiBirokrasiController@show');
        $router->post('/', 'ReformasiBirokrasiController@store');
        $router->put('/{id}', 'ReformasiBirokrasiController@update');
        $router->delete('/{id}', 'ReformasiBirokrasiController@destroy');
    });

    // =====================
    // REALISASI ANGGARAN ROUTES
    // =====================
    $router->group(['prefix' => 'realisasi-anggaran'], function () use ($router) {
        $router->get('/', 'RealisasiAnggaranController@index');
        $router->get('/tahun/{tahun}', 'RealisasiAnggaranController@byTahun');
        $router->get('/{id}', 'RealisasiAnggaranController@show');
        $router->post('/', 'RealisasiAnggaranController@store');
        $router->put('/{id}', 'RealisasiAnggaranController@update');
        $router->delete('/{id}', 'RealisasiAnggaranController@destroy');
    });

    // =====================
    // UPLOAD ROUTES
    // =====================
    $router->group(['prefix' => 'upload'], function () use ($router) {
        $router->post('/image', 'UploadController@uploadImage');
        $router->post('/pdf', 'UploadController@uploadPdf');
        $router->delete('/{filename}', 'UploadController@delete');
    });

    // =====================
    // DASHBOARD ROUTES
    // =====================
    $router->group(['prefix' => 'dashboard'], function () use ($router) {
        $router->get('/stats', 'DashboardController@stats');
    });

    // =====================
    // DASHBOARD PUBLIK (tanpa auth)
    // =====================
    $router->get('/dashboard-publik', 'DashboardExecController@publik');

    // =====================
    // FASILITAS ROUTES (Publik)
    // =====================
    $router->group(['prefix' => 'fasilitas'], function () use ($router) {
        $router->get('/', 'FasilitasController@index');
        $router->get('/{id}', 'FasilitasController@show');
        $router->get('/{id}/ketersediaan', 'FasilitasController@ketersediaan');
    });

    // =====================
    // YOUTH OPPORTUNITY / BONTANG YOUTH TALENT (Publik)
    // =====================
    $router->group(['prefix' => 'youth-opportunity'], function () use ($router) {
        $router->get('/', 'YouthOpportunityController@index');
        $router->get('/{id}', 'YouthOpportunityController@show');
    });

    // =====================
    // SIMPORA — ATLET & PELATIH (Publik)
    // =====================
    $router->get('/atlet', 'SimporaController@indexAtlet');
    $router->get('/atlet/{id}', 'SimporaController@showAtlet');
    $router->get('/pelatih', 'SimporaController@indexPelatih');
    $router->get('/pelatih/{id}', 'SimporaController@showPelatih');

    // =====================
    // TURNAMEN (Publik)
    // =====================
    $router->group(['prefix' => 'turnamen'], function () use ($router) {
        $router->get('/', 'TurnamenController@index');
        $router->get('/{id}', 'TurnamenController@show');
    });

    // =====================
    // PENGADUAN (Publik — submit & track)
    // =====================
    $router->post('/pengaduan', 'PengaduanController@store');
    $router->get('/pengaduan/track/{kode}', 'PengaduanController@track');

    // =====================
    // ORGANISASI / OKP ROUTES (Publik)
    // =====================
    $router->group(['prefix' => 'organisasi'], function () use ($router) {
        $router->get('/', 'OrganisasiController@index');
        $router->get('/{id}', 'OrganisasiController@show');
    });

    // =====================
    // KEGIATAN PUBLIK (Kalender Agregator)
    // =====================
    $router->get('/kegiatan-publik', 'KegiatanController@indexPublik');

    // =====================
    // DESTINASI WISATA ROUTES (Publik)
    // =====================
    $router->group(['prefix' => 'destinasi-wisata'], function () use ($router) {
        $router->get('/', 'DestinasiWisataController@index');
        $router->get('/{id}', 'DestinasiWisataController@show');
    });

    // =====================
    // KATALOG PRODUK ROUTES (Publik)
    // =====================
    $router->group(['prefix' => 'katalog-produk'], function () use ($router) {
        $router->get('/', 'KatalogProdukController@index');
        $router->get('/{id}', 'KatalogProdukController@show');
    });

    // =====================
    // PELATIHAN ROUTES (Publik)
    // =====================
    $router->group(['prefix' => 'pelatihan'], function () use ($router) {
        $router->get('/', 'PelatihanController@index');
        $router->get('/{id}', 'PelatihanController@show');
    });

    // =====================
    // EVENT & FESTIVAL ROUTES (Publik)
    // =====================
    $router->group(['prefix' => 'event-festival'], function () use ($router) {
        $router->get('/', 'EventFestivalController@index');
        $router->get('/{id}', 'EventFestivalController@show');
    });

    // ================================================================
    // AUTHENTICATED ROUTES — Masyarakat & Admin OKP
    // ================================================================
    $router->group(['middleware' => 'auth:api'], function () use ($router) {

        // =====================
        // BOOKING FASILITAS
        // =====================
        $router->group(['prefix' => 'booking'], function () use ($router) {
            $router->post('/', 'BookingController@store');
            $router->get('/riwayat', 'BookingController@riwayat');
            $router->get('/{id}', 'BookingController@show');
            $router->post('/{id}/upload-bukti', 'BookingController@uploadBukti');
            $router->delete('/{id}/batal', 'BookingController@batal');
        });

        // =====================
        // TIKET WISATA
        // =====================
        $router->group(['prefix' => 'tiket-wisata'], function () use ($router) {
            $router->post('/', 'TiketWisataController@store');
            $router->get('/riwayat', 'TiketWisataController@riwayat');
            $router->get('/{id}', 'TiketWisataController@show');
        });

        // =====================
        // ORGANISASI / OKP (Authenticated)
        // =====================
        $router->post('/organisasi', 'OrganisasiController@store');
        $router->put('/organisasi/{id}', 'OrganisasiController@update');
        $router->post('/organisasi/{id}/pengurus', 'OrganisasiController@storePengurus');
        $router->put('/organisasi/{id}/pengurus/{pid}', 'OrganisasiController@updatePengurus');
        $router->delete('/organisasi/{id}/pengurus/{pid}', 'OrganisasiController@destroyPengurus');

        // =====================
        // KEGIATAN OKP (Authenticated)
        // =====================
        $router->post('/organisasi/{id}/kegiatan', 'KegiatanController@store');
        $router->put('/organisasi/{id}/kegiatan/{kid}', 'KegiatanController@update');
        $router->delete('/organisasi/{id}/kegiatan/{kid}', 'KegiatanController@destroy');
        $router->post('/organisasi/{id}/kegiatan/{kid}/laporan', 'KegiatanController@storeLaporan');

        // =====================
        // TURNAMEN — Pendaftaran (Authenticated)
        // =====================
        $router->post('/turnamen/{id}/daftar', 'TurnamenController@daftar');
    });

    // ================================================================
    // ADMIN / PENGELOLA ROUTES
    // ================================================================
    $router->group(['prefix' => 'admin', 'middleware' => ['auth:api', 'role:admin,pengelola']], function () use ($router) {

        // =====================
        // ADMIN: FASILITAS MANAGEMENT
        // =====================
        $router->get('/fasilitas', 'Admin\AdminFasilitasController@index');
        $router->get('/fasilitas/{id}', 'Admin\AdminFasilitasController@show');
        $router->post('/fasilitas', 'Admin\AdminFasilitasController@store');
        $router->put('/fasilitas/{id}', 'Admin\AdminFasilitasController@update');
        $router->delete('/fasilitas/{id}', 'Admin\AdminFasilitasController@destroy');
        $router->post('/fasilitas/{id}/slot', 'Admin\AdminFasilitasController@storeSlot');
        $router->post('/fasilitas/{id}/blackout', 'Admin\AdminFasilitasController@storeBlackout');

        // =====================
        // ADMIN: BOOKING MANAGEMENT
        // =====================
        $router->get('/booking', 'Admin\AdminBookingController@index');
        $router->get('/fasilitas/{id}/bookings', 'Admin\AdminBookingController@indexByFasilitas');
        $router->get('/fasilitas/{id}/kalender', 'Admin\AdminBookingController@kalender');
        $router->put('/booking/{id}/verifikasi', 'Admin\AdminBookingController@verifikasi');
        $router->get('/retribusi/laporan', 'Admin\AdminBookingController@laporanRetribusi');
    });

    $router->group(['prefix' => 'admin', 'middleware' => ['auth:api', 'role:admin']], function () use ($router) {

        // =====================
        // ADMIN: OKP MANAGEMENT
        // =====================
        $router->get('/organisasi', 'Admin\AdminOrganisasiController@index');
        $router->get('/organisasi/all', 'Admin\AdminOrganisasiController@index');
        $router->get('/organisasi/pending', 'Admin\AdminOrganisasiController@pending');
        $router->put('/organisasi/{id}/verifikasi', 'Admin\AdminOrganisasiController@verifikasi');
        $router->put('/organisasi/{oid}/kegiatan/{kid}/laporan/{lid}/review', 'Admin\AdminOrganisasiController@reviewLaporan');

        // =====================
        // ADMIN: DESTINASI WISATA
        // =====================
        $router->get('/destinasi-wisata', 'Admin\AdminContentController@indexDestinasi');
        $router->post('/destinasi-wisata', 'Admin\AdminContentController@storeDestinasi');
        $router->put('/destinasi-wisata/{id}', 'Admin\AdminContentController@updateDestinasi');
        $router->delete('/destinasi-wisata/{id}', 'Admin\AdminContentController@destroyDestinasi');

        // =====================
        // ADMIN: TIKET WISATA
        // =====================
        $router->get('/tiket-wisata', 'Admin\AdminContentController@indexTiket');
        $router->post('/tiket-wisata/{id}/validate', 'Admin\AdminContentController@validateTiket');

        // =====================
        // ADMIN: KATALOG PRODUK
        // =====================
        $router->get('/katalog-produk', 'Admin\AdminContentController@indexKatalog');
        $router->post('/katalog-produk', 'Admin\AdminContentController@storeKatalog');
        $router->put('/katalog-produk/{id}', 'Admin\AdminContentController@updateKatalog');
        $router->delete('/katalog-produk/{id}', 'Admin\AdminContentController@destroyKatalog');

        // =====================
        // ADMIN: PELATIHAN
        // =====================
        $router->get('/pelatihan', 'Admin\AdminContentController@indexPelatihan');
        $router->post('/pelatihan', 'Admin\AdminContentController@storePelatihan');
        $router->put('/pelatihan/{id}', 'Admin\AdminContentController@updatePelatihan');
        $router->delete('/pelatihan/{id}', 'Admin\AdminContentController@destroyPelatihan');

        // =====================
        // ADMIN: EVENT FESTIVAL
        // =====================
        $router->get('/event-festival', 'Admin\AdminContentController@indexEvent');
        $router->post('/event-festival', 'Admin\AdminContentController@storeEvent');
        $router->put('/event-festival/{id}', 'Admin\AdminContentController@updateEvent');
        $router->delete('/event-festival/{id}', 'Admin\AdminContentController@destroyEvent');

        // =====================
        // ADMIN: USER MANAGEMENT
        // =====================
        $router->get('/users', 'Admin\AdminUserController@index');
        $router->get('/users/{id}', 'Admin\AdminUserController@show');
        $router->post('/users', 'Admin\AdminUserController@store');
        $router->put('/users/{id}', 'Admin\AdminUserController@update');
        $router->delete('/users/{id}', 'Admin\AdminUserController@destroy');

        // =====================
        // DASHBOARD EKSEKUTIF & SUB-DASHBOARDS
        // =====================
        $router->get('/dashboard/eksekutif', 'DashboardExecController@eksekutif');
        $router->get('/dashboard/retribusi', 'DashboardExecController@retribusi');
        $router->get('/dashboard/okp', 'DashboardExecController@okp');
        $router->get('/dashboard/wisata', 'DashboardExecController@wisata');

        // =====================
        // ADMIN: YOUTH OPPORTUNITY
        // =====================
        $router->get('/youth-opportunity', 'Admin\AdminNewFeaturesController@indexYouth');
        $router->post('/youth-opportunity', 'Admin\AdminNewFeaturesController@storeYouth');
        $router->put('/youth-opportunity/{id}', 'Admin\AdminNewFeaturesController@updateYouth');
        $router->delete('/youth-opportunity/{id}', 'Admin\AdminNewFeaturesController@destroyYouth');

        // =====================
        // ADMIN: SIMPORA — ATLET
        // =====================
        $router->get('/atlet', 'Admin\AdminNewFeaturesController@indexAtlet');
        $router->post('/atlet', 'Admin\AdminNewFeaturesController@storeAtlet');
        $router->put('/atlet/{id}', 'Admin\AdminNewFeaturesController@updateAtlet');
        $router->delete('/atlet/{id}', 'Admin\AdminNewFeaturesController@destroyAtlet');

        // =====================
        // ADMIN: SIMPORA — PELATIH
        // =====================
        $router->get('/pelatih', 'Admin\AdminNewFeaturesController@indexPelatih');
        $router->post('/pelatih', 'Admin\AdminNewFeaturesController@storePelatih');
        $router->put('/pelatih/{id}', 'Admin\AdminNewFeaturesController@updatePelatih');
        $router->delete('/pelatih/{id}', 'Admin\AdminNewFeaturesController@destroyPelatih');

        // =====================
        // ADMIN: TURNAMEN
        // =====================
        $router->get('/turnamen', 'Admin\AdminNewFeaturesController@indexTurnamen');
        $router->post('/turnamen', 'Admin\AdminNewFeaturesController@storeTurnamen');
        $router->put('/turnamen/{id}', 'Admin\AdminNewFeaturesController@updateTurnamen');
        $router->delete('/turnamen/{id}', 'Admin\AdminNewFeaturesController@destroyTurnamen');
        $router->get('/turnamen/{id}/peserta', 'Admin\AdminNewFeaturesController@pesertaTurnamen');

        // =====================
        // ADMIN: PELAKU EKRAF
        // =====================
        $router->get('/pelaku-ekraf', 'Admin\AdminNewFeaturesController@indexPelaku');
        $router->post('/pelaku-ekraf', 'Admin\AdminNewFeaturesController@storePelaku');
        $router->put('/pelaku-ekraf/{id}', 'Admin\AdminNewFeaturesController@updatePelaku');
        $router->delete('/pelaku-ekraf/{id}', 'Admin\AdminNewFeaturesController@destroyPelaku');
        $router->put('/pelaku-ekraf/{id}/verifikasi', 'Admin\AdminNewFeaturesController@verifikasiPelaku');

        // =====================
        // ADMIN: HAKI
        // =====================
        $router->get('/haki', 'Admin\AdminNewFeaturesController@indexHaki');
        $router->post('/haki', 'Admin\AdminNewFeaturesController@storeHaki');
        $router->put('/haki/{id}', 'Admin\AdminNewFeaturesController@updateHaki');
        $router->delete('/haki/{id}', 'Admin\AdminNewFeaturesController@destroyHaki');

        // =====================
        // ADMIN: PENGADUAN
        // =====================
        $router->get('/pengaduan', 'Admin\AdminNewFeaturesController@indexPengaduan');
        $router->put('/pengaduan/{id}/tanggapi', 'Admin\AdminNewFeaturesController@tanggapiPengaduan');
    });
});
