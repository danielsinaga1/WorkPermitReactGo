<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // ── Core ─────────────────────────────────────
            UserSeeder::class,
            SubsektorSeeder::class,

            // ── CMS / Konten ─────────────────────────────
            BannerSeeder::class,
            BeritaSeeder::class,
            PengumumanSeeder::class,
            PromosiSeeder::class,
            RagamEkrafSeeder::class,
            NewsletterSeeder::class,
            PustakaSeeder::class,
            TenagaKerjaSeeder::class,
            ProdukHukumSeeder::class,
            PotensiEkonomiSeeder::class,
            PPIDSeeder::class,
            ProfilPimpinanSeeder::class,
            ReformasiBirokrasiSeeder::class,
            RealisasiAnggaranSeeder::class,

            // ── Fasilitas & Booking ──────────────────────
            FasilitasSeeder::class,
            FasilitasTarifSeeder::class,
            FasilitasSlotSeeder::class,
            FasilitasBlackoutSeeder::class,
            BookingSeeder::class,

            // ── Organisasi ───────────────────────────────
            OrganisasiSeeder::class,
            OrgPengurusSeeder::class,
            OrgKegiatanSeeder::class,
            OrgLaporanSeeder::class,

            // ── Pariwisata ───────────────────────────────
            DestinasiWisataSeeder::class,
            TiketWisataSeeder::class,

            // ── Ekonomi Kreatif ──────────────────────────
            KatalogProdukSeeder::class,
            PelatihanSeeder::class,
            EventFestivalSeeder::class,

            // ── Pelaku Ekraf & HAKI ──────────────────────
            PelakuEkrafSeeder::class,
            HakiSeeder::class,

            // ── Kepemudaan ───────────────────────────────
            YouthOpportunitySeeder::class,

            // ── Olahraga ─────────────────────────────────
            AtletSeeder::class,
            PelatihSeeder::class,
            TurnamenSeeder::class,
            PesertaTurnamenSeeder::class,

            // ── Pengaduan ────────────────────────────────
            PengaduanSeeder::class,

            // ── Payment ──────────────────────────────────
            PaymentLogSeeder::class,
        ]);
    }
}
