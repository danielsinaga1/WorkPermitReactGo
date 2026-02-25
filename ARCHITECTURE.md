# 🏛️ Arsitektur Aplikasi Dispoparekraf Kota Bontang

## Comprehensive System Design Document
**Version**: 2.0  
**Date**: 13 Februari 2026  
**Framework**: Lumen 10 (Backend) + React 19 + TypeScript (Frontend)

---

## 📋 DAFTAR ISI

1. [Struktur Menu Aplikasi (Sitemap)](#1-sitemap)
2. [User Roles & Hak Akses](#2-user-roles)
3. [Skema Database (ERD)](#3-database-schema)
4. [Daftar API Endpoint](#4-api-endpoints)
5. [User Flow](#5-user-flow)
6. [UI/UX Concept](#6-uiux-concept)
7. [Roadmap Development](#7-roadmap)

---

## 1. SITEMAP — Struktur Menu Aplikasi <a id="1-sitemap"></a>

```
🌐 PORTAL PUBLIK (Tanpa Login)
├── 🏠 Beranda
│   ├── Banner Slider
│   ├── Berita Terbaru
│   ├── Pengumuman
│   ├── Agenda/Kalender Publik
│   └── Statistik Ringkas
│
├── 📰 Berita & Informasi (EXISTING)
│   ├── Berita
│   ├── Pengumuman
│   ├── Promosi
│   └── Newsletter
│
├── 🏟️ Fasilitas & Olahraga
│   ├── Daftar Fasilitas (Gedung/Stadion/Lapangan)
│   ├── Detail Fasilitas + Kalender Ketersediaan
│   ├── Booking Fasilitas (Requires Login)
│   └── Cek Status Booking
│
├── 👥 Kepemudaan
│   ├── Direktori OKP (Organisasi Kemasyarakatan Pemuda)
│   ├── Profil OKP Detail
│   ├── Kalender Kegiatan Pemuda
│   ├── Pendaftaran OKP Baru (Requires Login)
│   └── Galeri Kegiatan
│
├── 🏝️ Pariwisata
│   ├── Destinasi Wisata (Peta Interaktif)
│   ├── Detail Wisata + E-Ticketing
│   ├── Kalender Event/Festival
│   └── Info Wisata (Tips, Panduan)
│
├── 🎨 Ekonomi Kreatif (EXISTING + ENHANCED)
│   ├── Ragam Ekraf (by Subsektor)
│   ├── E-Katalog Produk UMKM
│   ├── Info Pelatihan & Workshop
│   ├── Pengajuan HAKI
│   └── Festival & Event Budaya
│
├── 📊 Data & Statistik (EXISTING + ENHANCED)
│   ├── Potensi Ekonomi Kreatif
│   ├── Realisasi Anggaran
│   └── Dashboard Publik (Read-only stats)
│
├── 📋 Profil Dinas (EXISTING)
│   ├── Profil Lembaga
│   ├── Profil Pimpinan
│   ├── Struktur Organisasi
│   └── Reformasi Birokrasi
│
├── 📜 PPID (EXISTING)
│   ├── Tentang PPID
│   ├── Regulasi
│   └── Formulir Permohonan
│
└── 🔑 Authentication
    ├── Login (SSO)
    ├── Register (Masyarakat / OKP)
    └── Lupa Password

🔒 PANEL MASYARAKAT (Role: masyarakat)
├── 📊 Dashboard Pribadi
│   ├── Riwayat Booking
│   ├── Tiket Wisata Saya
│   └── Notifikasi
├── 🏟️ Booking Fasilitas
│   ├── Booking Baru
│   ├── Upload Bukti Bayar
│   └── Riwayat & Status
└── 🎫 Tiket Wisata
    ├── Beli Tiket
    └── E-Ticket Saya

🔒 PANEL ADMIN OKP (Role: admin_okp)
├── 📊 Dashboard OKP
│   ├── Statistik Kegiatan
│   └── Status Verifikasi
├── 🏢 Profil Organisasi
│   ├── Data Legalitas
│   ├── Pengurus
│   └── Bidang Fokus
├── 📅 Kegiatan
│   ├── Buat Kegiatan Baru
│   ├── Upload Laporan Kegiatan
│   └── Riwayat Kegiatan
└── 🏟️ Booking Fasilitas (sama seperti masyarakat)

🔒 PANEL PENGELOLA FASILITAS (Role: pengelola)
├── 📊 Dashboard Fasilitas
│   ├── Kalender Booking
│   ├── Pending Verifikasi
│   └── Statistik Pendapatan
├── 🏟️ Manajemen Fasilitas
│   ├── Kelola Ketersediaan
│   ├── Set Tarif
│   └── Blackout Dates
└── 💳 Verifikasi Pembayaran
    ├── Verifikasi Bukti Bayar
    └── Laporan Retribusi

🔒 PANEL SUPER ADMIN (Role: admin)
├── 📊 Dashboard Eksekutif
│   ├── Total Pendapatan Retribusi
│   ├── Jumlah OKP Aktif
│   ├── Tren Kunjungan Wisata
│   ├── Jumlah Kegiatan Pemuda Bulan Ini
│   └── Grafik & Analitik Real-time
├── 🏟️ Manajemen Fasilitas
│   ├── CRUD Fasilitas
│   ├── Kelola Pengelola
│   └── Laporan Retribusi Global
├── 👥 Manajemen Kepemudaan
│   ├── Verifikasi OKP
│   ├── Kelola Database OKP
│   └── Validasi Laporan Kegiatan
├── 🏝️ Manajemen Pariwisata
│   ├── CRUD Destinasi Wisata
│   ├── Kelola E-Ticketing
│   └── Kelola Event/Festival
├── 🎨 Manajemen Ekraf
│   ├── CRUD Subsektor & Ragam Ekraf (EXISTING)
│   ├── Kelola E-Katalog
│   └── Kelola Pelatihan
├── 📰 Manajemen Konten (EXISTING)
│   ├── Berita, Pengumuman, Promosi
│   ├── Newsletter, Pustaka
│   └── Produk Hukum
├── ⚙️ Pengaturan Sistem
│   ├── Manajemen User
│   ├── Banner
│   ├── Konfigurasi Payment Gateway
│   └── Audit Log
└── 📈 Laporan
    ├── Laporan Retribusi
    ├── Laporan OKP
    ├── Laporan Kunjungan
    └── Export (PDF/Excel)
```

---

## 2. USER ROLES & HAK AKSES <a id="2-user-roles"></a>

### Role Definitions

| Role | Kode | Deskripsi | Registrasi |
|------|------|-----------|------------|
| **Super Admin** | `admin` | Pegawai Dinas (Kadis/Kabid) — full access | Dibuat oleh system |
| **Editor** | `editor` | Staf Dinas — kelola konten | Dibuat oleh Admin |
| **Pengelola Fasilitas** | `pengelola` | Petugas pengelola gedung/lapangan | Dibuat oleh Admin |
| **Admin OKP** | `admin_okp` | Ketua/Sekretaris organisasi pemuda | Self-register + verifikasi |
| **Masyarakat** | `masyarakat` | Warga umum — booking & tiket | Self-register |

### Permission Matrix

| Fitur | Masyarakat | Admin OKP | Pengelola | Editor | Admin |
|-------|:----------:|:---------:|:---------:|:------:|:-----:|
| Lihat konten publik | ✅ | ✅ | ✅ | ✅ | ✅ |
| Booking fasilitas | ✅ | ✅ | ❌ | ❌ | ✅ |
| Beli tiket wisata | ✅ | ✅ | ❌ | ❌ | ✅ |
| Daftar OKP | ❌ | ✅ | ❌ | ❌ | ✅ |
| Upload laporan OKP | ❌ | ✅ | ❌ | ❌ | ✅ |
| Kelola ketersediaan | ❌ | ❌ | ✅ | ❌ | ✅ |
| Verifikasi pembayaran | ❌ | ❌ | ✅ | ❌ | ✅ |
| Kelola konten (CMS) | ❌ | ❌ | ❌ | ✅ | ✅ |
| Verifikasi OKP | ❌ | ❌ | ❌ | ❌ | ✅ |
| Dashboard eksekutif | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manajemen user | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. SKEMA DATABASE <a id="3-database-schema"></a>

### Entity Relationship Diagram (ERD)

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    users      │       │    fasilitas      │       │  fasilitas_tarif │
│──────────────│       │──────────────────│       │──────────────────│
│ id (UUID) PK │◄──┐   │ id PK            │───┐   │ id PK            │
│ name         │   │   │ nama             │   │   │ fasilitas_id FK  │───┐
│ email        │   │   │ jenis (enum)     │   │   │ nama_tarif       │   │
│ password     │   │   │ deskripsi        │   │   │ harga            │   │
│ role (enum)  │   │   │ alamat           │   │   │ satuan           │   │
│ nik          │   │   │ latitude         │   └───│ is_active        │   │
│ no_telp      │   │   │ longitude        │       └──────────────────┘   │
│ avatar       │   │   │ kapasitas        │                              │
│ alamat       │   │   │ thumbnail        │       ┌──────────────────┐   │
│ is_active    │   │   │ images (json)    │       │  fasilitas_slot  │   │
│ verified_at  │   │   │ fasilitas_detail │       │──────────────────│   │
│ created_at   │   │   │ pengelola_id FK  │───┐   │ id PK            │   │
│ deleted_at   │   │   │ is_active        │   │   │ fasilitas_id FK  │───┘
└──────┬───────┘   │   └──────────────────┘   │   │ tanggal          │
       │           │                          │   │ jam_mulai        │
       │           │   ┌──────────────────┐   │   │ jam_selesai      │
       │           │   │     bookings     │   │   │ status (enum)    │
       │           │   │──────────────────│   │   └──────────────────┘
       │           ├───│ user_id FK       │   │
       │           │   │ fasilitas_id FK  │───┘   ┌──────────────────┐
       │           │   │ slot_id FK       │       │    organisasi    │
       │           │   │ tarif_id FK      │       │──────────────────│
       │           │   │ tujuan_kegiatan  │   ┌───│ id PK            │
       │           │   │ jumlah_peserta   │   │   │ nama             │
       │           │   │ total_biaya      │   │   │ singkatan        │
       │           │   │ status (enum)    │   │   │ no_sk            │
       │           │   │ bukti_bayar      │   │   │ tanggal_berdiri  │
       │           │   │ verified_by FK   │   │   │ bidang_fokus     │
       │           │   │ verified_at      │   │   │ alamat_sekretariat│
       │           │   │ catatan_admin    │   │   │ logo             │
       │           │   │ payment_method   │   │   │ deskripsi        │
       │           │   │ payment_ref      │   │   │ status (enum)    │
       │           │   └──────────────────┘   │   │ admin_id FK      │───┐
       │           │                          │   │ verified_by FK   │   │
       │           │   ┌──────────────────┐   │   │ verified_at      │   │
       │           │   │   org_pengurus   │   │   │ catatan_verif    │   │
       │           │   │──────────────────│   │   └──────────────────┘   │
       │           │   │ id PK            │   │                          │
       │           └───│ user_id FK       │   │   ┌──────────────────┐   │
       │               │ organisasi_id FK │───┘   │  org_kegiatan    │   │
       │               │ jabatan          │       │──────────────────│   │
       │               │ periode_mulai    │       │ id PK            │   │
       │               │ periode_selesai  │   ┌───│ organisasi_id FK │   │
       │               │ is_active        │   │   │ judul            │   │
       │               └──────────────────┘   │   │ deskripsi        │   │
       │                                      │   │ tanggal_mulai    │   │
       │           ┌──────────────────┐       │   │ tanggal_selesai  │   │
       │           │  org_laporan     │       │   │ lokasi           │   │
       │           │──────────────────│       │   │ jenis (enum)     │   │
       │           │ id PK            │       │   │ peserta_target   │   │
       │           │ kegiatan_id FK   │───────┘   │ thumbnail        │   │
       │           │ file_laporan     │           │ status (enum)    │   │
       │           │ deskripsi        │           │ is_published     │   │
       │           │ foto_kegiatan    │           └──────────────────┘   │
       │           │ jumlah_peserta   │                                  │
       │           │ status (enum)    │   ┌──────────────────┐          │
       │           │ reviewed_by FK   │   │   destinasi_wisata│          │
       │           │ catatan_review   │   │──────────────────│          │
       │           └──────────────────┘   │ id PK            │          │
       │                                  │ nama             │          │
       │           ┌──────────────────┐   │ deskripsi        │          │
       │           │   tiket_wisata   │   │ alamat           │          │
       │           │──────────────────│   │ latitude         │          │
       └───────────│ user_id FK       │   │ longitude        │          │
                   │ destinasi_id FK  │───│ kategori (enum)  │          │
                   │ tanggal_kunjungan│   │ thumbnail        │          │
                   │ jumlah_tiket     │   │ images (json)    │          │
                   │ total_harga      │   │ jam_buka         │          │
                   │ status (enum)    │   │ jam_tutup        │          │
                   │ payment_method   │   │ harga_tiket      │          │
                   │ payment_ref      │   │ fasilitas_wisata │          │
                   │ qr_code          │   │ kontak           │          │
                   │ used_at          │   │ is_ticketed      │          │
                   └──────────────────┘   │ is_active        │          │
                                          └──────────────────┘          │
       ┌──────────────────┐                                             │
       │  katalog_produk  │       ┌──────────────────┐                  │
       │──────────────────│       │    pelatihan      │                  │
       │ id PK            │       │──────────────────│                  │
       │ nama_produk      │       │ id PK            │                  │
       │ deskripsi        │       │ judul            │                  │
       │ harga_mulai      │       │ deskripsi        │                  │
       │ harga_sampai     │       │ tanggal_mulai    │                  │
       │ kategori (enum)  │       │ tanggal_selesai  │                  │
       │ subsektor_id FK  │       │ lokasi           │                  │
       │ pemilik_id FK    │───────│ kuota            │                  │
       │ thumbnail        │       │ thumbnail        │                  │
       │ images (json)    │       │ kategori         │                  │
       │ kontak           │       │ pendaftar_count  │                  │
       │ alamat           │       │ is_published     │                  │
       │ is_verified      │       └──────────────────┘                  │
       │ is_active        │                                             │
       └──────────────────┘       ┌──────────────────┐                  │
                                  │   event_festival  │                  │
                                  │──────────────────│                  │
                                  │ id PK            │                  │
                                  │ nama             │                  │
                                  │ deskripsi        │                  │
                                  │ tanggal_mulai    │                  │
                                  │ tanggal_selesai  │                  │
                                  │ lokasi           │                  │
                                  │ thumbnail        │                  │
                                  │ images (json)    │                  │
                                  │ kategori (enum)  │                  │
                                  │ is_published     │                  │
                                  └──────────────────┘                  │
                                                                        │
                                  ┌──────────────────┐                  │
                                  │  payment_logs    │                  │
                                  │──────────────────│                  │
                                  │ id PK            │                  │
                                  │ payable_type     │ (polymorphic)    │
                                  │ payable_id       │                  │
                                  │ user_id FK       │──────────────────┘
                                  │ amount           │
                                  │ method           │
                                  │ reference        │
                                  │ status (enum)    │
                                  │ gateway_response │
                                  │ paid_at          │
                                  └──────────────────┘
```

### Tabel Baru yang Ditambahkan

| # | Tabel | Deskripsi |
|---|-------|-----------|
| 1 | `fasilitas` | Master data fasilitas (gedung, stadion, lapangan) |
| 2 | `fasilitas_tarifs` | Tarif per fasilitas sesuai regulasi |
| 3 | `fasilitas_slots` | Slot waktu ketersediaan per hari |
| 4 | `fasilitas_blackouts` | Tanggal tidak tersedia (maintenance, dll) |
| 5 | `bookings` | Pemesanan fasilitas oleh user |
| 6 | `organisasis` | Master data OKP |
| 7 | `org_pengurus` | Pengurus organisasi (many-to-many user↔org) |
| 8 | `org_kegiatans` | Kegiatan/agenda OKP |
| 9 | `org_laporans` | Laporan kegiatan OKP |
| 10 | `destinasi_wisatas` | Master data destinasi wisata |
| 11 | `tiket_wisatas` | Transaksi tiket wisata digital |
| 12 | `katalog_produks` | E-Katalog produk UMKM/Ekraf |
| 13 | `pelatihans` | Jadwal pelatihan & workshop |
| 14 | `event_festivals` | Event & festival budaya |
| 15 | `payment_logs` | Log pembayaran polymorphic |

---

## 4. DAFTAR API ENDPOINT <a id="4-api-endpoints"></a>

### 🔓 Public Endpoints (Tanpa Auth)

```
GET    /api/fasilitas                     → Daftar fasilitas (paginated, filter by jenis)
GET    /api/fasilitas/{id}                → Detail fasilitas + slots + tarif
GET    /api/fasilitas/{id}/ketersediaan   → Kalender slot tersedia (by date range)

GET    /api/organisasi                    → Direktori OKP (paginated, search, filter status)
GET    /api/organisasi/{id}               → Detail OKP + pengurus + kegiatan
GET    /api/kegiatan-publik               → Kalender kegiatan semua OKP (aggregator)

GET    /api/destinasi-wisata              → Daftar destinasi (paginated, filter kategori)
GET    /api/destinasi-wisata/{id}         → Detail destinasi

GET    /api/katalog-produk                → E-Katalog (paginated, filter subsektor/kategori)
GET    /api/katalog-produk/{id}           → Detail produk

GET    /api/pelatihan                     → Daftar pelatihan (paginated)
GET    /api/pelatihan/{id}                → Detail pelatihan

GET    /api/event-festival                → Daftar event & festival (paginated)
GET    /api/event-festival/{id}           → Detail event

GET    /api/dashboard-publik              → Statistik publik ringkas
```

### 🔐 Authenticated Endpoints — Masyarakat & Admin OKP

```
# === BOOKING FASILITAS ===
POST   /api/booking                       → Buat booking baru
GET    /api/booking/riwayat               → Riwayat booking saya
GET    /api/booking/{id}                  → Detail booking saya
POST   /api/booking/{id}/upload-bukti     → Upload bukti bayar
DELETE /api/booking/{id}/batal            → Batalkan booking

# === TIKET WISATA ===
POST   /api/tiket-wisata                  → Beli tiket wisata
GET    /api/tiket-wisata/riwayat          → Riwayat tiket saya
GET    /api/tiket-wisata/{id}             → Detail + QR Code

# === OKP (Admin OKP Only) ===
POST   /api/organisasi                    → Daftar OKP baru
PUT    /api/organisasi/{id}               → Update profil OKP
POST   /api/organisasi/{id}/pengurus      → Tambah pengurus
PUT    /api/organisasi/{id}/pengurus/{pid}→ Update pengurus
DELETE /api/organisasi/{id}/pengurus/{pid}→ Hapus pengurus

POST   /api/organisasi/{id}/kegiatan      → Buat kegiatan baru
PUT    /api/organisasi/{id}/kegiatan/{kid}→ Update kegiatan
DELETE /api/organisasi/{id}/kegiatan/{kid}→ Hapus kegiatan
POST   /api/organisasi/{id}/kegiatan/{kid}/laporan → Upload laporan
```

### 🔒 Admin/Pengelola Endpoints

```
# === PENGELOLA FASILITAS ===
GET    /api/admin/fasilitas/{id}/bookings → Daftar booking per fasilitas
PUT    /api/admin/booking/{id}/verifikasi → Verifikasi/tolak booking
GET    /api/admin/fasilitas/{id}/kalender → Kalender booking
POST   /api/admin/fasilitas/{id}/slot     → Kelola slot
POST   /api/admin/fasilitas/{id}/blackout → Set tanggal blackout
GET    /api/admin/retribusi/laporan       → Laporan retribusi

# === SUPER ADMIN ===
POST   /api/admin/fasilitas               → CRUD Fasilitas
PUT    /api/admin/fasilitas/{id}
DELETE /api/admin/fasilitas/{id}

POST   /api/admin/destinasi-wisata        → CRUD Destinasi
PUT    /api/admin/destinasi-wisata/{id}
DELETE /api/admin/destinasi-wisata/{id}

PUT    /api/admin/organisasi/{id}/verifikasi → Verifikasi/tolak OKP
GET    /api/admin/organisasi/pending       → Daftar OKP pending
PUT    /api/admin/organisasi/{id}/kegiatan/{kid}/laporan/{lid}/review → Review laporan

POST   /api/admin/katalog-produk          → CRUD Katalog Produk
PUT    /api/admin/katalog-produk/{id}
DELETE /api/admin/katalog-produk/{id}

POST   /api/admin/pelatihan               → CRUD Pelatihan
PUT    /api/admin/pelatihan/{id}
DELETE /api/admin/pelatihan/{id}

POST   /api/admin/event-festival          → CRUD Event/Festival
PUT    /api/admin/event-festival/{id}
DELETE /api/admin/event-festival/{id}

POST   /api/admin/tiket-wisata/{id}/validate → Validasi tiket di loket

# === DASHBOARD EKSEKUTIF ===
GET    /api/admin/dashboard/eksekutif      → Full analytics dashboard
GET    /api/admin/dashboard/retribusi      → Data retribusi & trend
GET    /api/admin/dashboard/okp            → Data OKP & kegiatan
GET    /api/admin/dashboard/wisata         → Data kunjungan wisata
GET    /api/admin/dashboard/export/{type}  → Export to PDF/Excel
```

---

## 5. USER FLOW <a id="5-user-flow"></a>

### Alur: Pemuda Mendaftarkan OKP → Booking Gedung

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGISTRATION FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Akses Portal → Klik "Daftar"                               │
│           │                                                     │
│  2. Isi Form Registrasi (Nama, NIK, Email, No.Telp, Password)  │
│           │                                                     │
│  3. Verifikasi Email → Login sebagai "masyarakat"               │
│           │                                                     │
│  4. Akses Menu "Kepemudaan" → "Daftarkan OKP"                  │
│           │                                                     │
│  5. Isi Data Organisasi:                                        │
│     • Nama Organisasi + Singkatan                               │
│     • No SK Pendirian (upload scan)                             │
│     • Tanggal Berdiri + Bidang Fokus                            │
│     • Alamat Sekretariat                                        │
│     • Upload Logo                                               │
│     • Daftar Pengurus (minimal 3)                               │
│           │                                                     │
│  6. Submit → Status "pending_verifikasi"                        │
│           │                                                     │
│  7. Admin Dinas menerima notifikasi                             │
│           │                                                     │
│  8. Admin review → Verifikasi / Tolak (dengan catatan)          │
│           │                                                     │
│  9. Jika DIVERIFIKASI:                                          │
│     • User otomatis di-upgrade → role "admin_okp"               │
│     • OKP muncul di Direktori Publik                            │
│     • Admin OKP bisa kelola kegiatan & booking                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    BOOKING FACILITY FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Login sebagai Admin OKP / Masyarakat                        │
│           │                                                     │
│  2. Akses Menu "Fasilitas" → Pilih fasilitas                    │
│           │                                                     │
│  3. Lihat Kalender Ketersediaan (slot available/booked)         │
│           │                                                     │
│  4. Pilih Tanggal + Jam Mulai + Jam Selesai                     │
│           │                                                     │
│  5. Isi Detail Booking:                                         │
│     • Tujuan Kegiatan                                           │
│     • Perkiraan Jumlah Peserta                                  │
│     • Pilih Tarif (sesuai jenis penggunaan)                     │
│           │                                                     │
│  6. Sistem Hitung Otomatis → Total Biaya                        │
│           │                                                     │
│  7. Pilih Metode Pembayaran (QRIS / Bank Transfer)             │
│           │                                                     │
│  8. Submit Booking → Status "menunggu_bayar"                    │
│           │                                                     │
│  9. User melakukan pembayaran + Upload Bukti                    │
│           │                                                     │
│  10. Pengelola menerima notifikasi                              │
│           │                                                     │
│  11. Pengelola verifikasi bukti bayar →                         │
│      Terverifikasi / Ditolak                                    │
│           │                                                     │
│  12. Jika TERVERIFIKASI:                                        │
│      • Slot fasilitas terkunci (confirmed)                      │
│      • User menerima e-Bukti Booking (PDF/QR)                   │
│      • Data masuk Dashboard Retribusi                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. UI/UX CONCEPT <a id="6-uiux-concept"></a>

### Design Principles
- **Mobile-First**: 70%+ users akses via smartphone
- **Clean & Modern**: Flat design dengan accent color `#004E7E` (primary) & `#008DE4` (secondary)
- **Accessibility**: Kontras tinggi, font size minimum 14px, touch target ≥ 44px
- **Progressive Disclosure**: Informasi ditampilkan bertahap, tidak overwhelming

### Key UI Components
1. **Kalender Interaktif**: Full-calendar view dengan color-coded slots (hijau=tersedia, merah=terisi, abu=maintenance)
2. **Peta Interaktif**: Leaflet/Map dengan pin wisata & OKP, clustered markers
3. **Stepper Form**: Multi-step form untuk booking & registrasi OKP
4. **Dashboard Cards**: Stat cards dengan mini-charts (ApexCharts sudah tersedia)
5. **E-Ticket QR**: Tiket digital dengan QR Code scannable

### Color System
```
Primary:    #004E7E (Dark Blue - Header, CTA)
Secondary:  #008DE4 (Light Blue - Links, Accent)
Success:    #10B981 (Green - Available, Verified)
Warning:    #F59E0B (Amber - Pending)
Danger:     #EF4444 (Red - Unavailable, Rejected)
Neutral:    #F3F4F6 (Light Gray - Background)
```

---

## 7. ROADMAP DEVELOPMENT <a id="7-roadmap"></a>

### Phase 1: Foundation (Minggu 1-4) ✅ PARTIALLY DONE
- [x] Setup Backend Lumen + JWT Auth
- [x] CMS Module (Berita, Pengumuman, Promosi, Newsletter)
- [x] PPID & Profil Dinas
- [x] Produk Hukum & Statistik
- [x] Frontend public pages & admin panel
- [ ] **Upgrade User roles** (tambah masyarakat, admin_okp, pengelola)
- [ ] **SSO Registration** (register publik + email verification)

### Phase 2: Fasilitas & Retribusi (Minggu 5-8)
- [ ] Database schema fasilitas + tarif + slot
- [ ] API CRUD fasilitas & manajemen slot
- [ ] Kalender ketersediaan real-time
- [ ] Booking flow + kalkulasi biaya otomatis
- [ ] Upload & verifikasi bukti pembayaran
- [ ] Dashboard pengelola fasilitas
- [ ] Payment gateway integration (QRIS/Bank Transfer)

### Phase 3: Kepemudaan / OKP (Minggu 9-12)
- [ ] Database schema OKP + pengurus + kegiatan
- [ ] Registrasi & verifikasi OKP
- [ ] Manajemen profil & pengurus OKP
- [ ] Kalender kegiatan publik (agregator)
- [ ] Digital reporting (upload laporan kegiatan)
- [ ] Dashboard Admin OKP

### Phase 4: Pariwisata & E-Ticketing (Minggu 13-16)
- [ ] Database schema destinasi wisata
- [ ] Peta interaktif destinasi
- [ ] E-Ticketing system + QR Code
- [ ] Event & festival calendar
- [ ] Validasi tiket di loket

### Phase 5: Ekonomi Kreatif Enhancement (Minggu 17-20)
- [ ] E-Katalog produk UMKM
- [ ] Registrasi produk oleh pelaku UMKM
- [ ] Modul pelatihan & workshop
- [ ] Info pengajuan HAKI
- [ ] Festival budaya calendar

### Phase 6: Dashboard Eksekutif & Reporting (Minggu 21-24)
- [ ] Dashboard analitik pimpinan
- [ ] Aggregated statistics real-time
- [ ] Trend analysis & charts
- [ ] Export laporan (PDF/Excel)
- [ ] Audit log system

### Phase 7: Integration & Optimization (Minggu 25-28)
- [ ] Payment gateway live integration
- [ ] Push notifications (Email/SMS)
- [ ] Performance optimization & caching
- [ ] Security audit & penetration testing
- [ ] UAT (User Acceptance Testing)
- [ ] Deployment to production

---

## 📁 STRUKTUR FILE BARU

### Backend (ekraf-backend/)
```
app/
├── Models/
│   ├── Fasilitas.php           ← NEW
│   ├── FasilitasTarif.php      ← NEW
│   ├── FasilitasSlot.php       ← NEW
│   ├── FasilitasBlackout.php   ← NEW
│   ├── Booking.php             ← NEW
│   ├── Organisasi.php          ← NEW
│   ├── OrgPengurus.php         ← NEW
│   ├── OrgKegiatan.php         ← NEW
│   ├── OrgLaporan.php          ← NEW
│   ├── DestinasiWisata.php     ← NEW
│   ├── TiketWisata.php         ← NEW
│   ├── KatalogProduk.php       ← NEW
│   ├── Pelatihan.php           ← NEW
│   ├── EventFestival.php       ← NEW
│   └── PaymentLog.php          ← NEW
├── Http/Controllers/
│   ├── FasilitasController.php      ← NEW
│   ├── BookingController.php        ← NEW
│   ├── OrganisasiController.php     ← NEW
│   ├── KegiatanController.php       ← NEW
│   ├── DestinasiWisataController.php← NEW
│   ├── TiketWisataController.php    ← NEW
│   ├── KatalogProdukController.php  ← NEW
│   ├── PelatihanController.php      ← NEW
│   ├── EventFestivalController.php  ← NEW
│   ├── DashboardExecController.php  ← NEW
│   └── Admin/                       ← NEW (admin-specific controllers)
│       ├── AdminFasilitasController.php
│       ├── AdminBookingController.php
│       ├── AdminOrganisasiController.php
│       ├── AdminDestinasiController.php
│       ├── AdminKatalogController.php
│       ├── AdminPelatihanController.php
│       └── AdminEventController.php
└── database/migrations/
    ├── 2024_02_01_000001_create_fasilitas_table.php
    ├── 2024_02_01_000002_create_fasilitas_tarifs_table.php
    ├── 2024_02_01_000003_create_fasilitas_slots_table.php
    ├── 2024_02_01_000004_create_fasilitas_blackouts_table.php
    ├── 2024_02_01_000005_create_bookings_table.php
    ├── 2024_02_01_000006_create_organisasis_table.php
    ├── 2024_02_01_000007_create_org_pengurus_table.php
    ├── 2024_02_01_000008_create_org_kegiatans_table.php
    ├── 2024_02_01_000009_create_org_laporans_table.php
    ├── 2024_02_01_000010_create_destinasi_wisatas_table.php
    ├── 2024_02_01_000011_create_tiket_wisatas_table.php
    ├── 2024_02_01_000012_create_katalog_produks_table.php
    ├── 2024_02_01_000013_create_pelatihans_table.php
    ├── 2024_02_01_000014_create_event_festivals_table.php
    ├── 2024_02_01_000015_create_payment_logs_table.php
    └── 2024_02_01_000016_update_users_table_add_fields.php
```

### Frontend (ekraf-web/src/)
```
src/
├── services/
│   └── api.ts                    ← NEW (Axios service layer)
├── types/
│   └── index.ts                  ← NEW (All TypeScript interfaces)
├── pages/
│   ├── Fasilitas/                ← NEW
│   │   ├── FasilitasList.tsx
│   │   ├── FasilitasDetail.tsx
│   │   └── BookingForm.tsx
│   ├── Kepemudaan/               ← NEW
│   │   ├── DirektoriOKP.tsx
│   │   ├── OKPDetail.tsx
│   │   ├── RegisterOKP.tsx
│   │   └── KalenderKegiatan.tsx
│   ├── Pariwisata/               ← NEW
│   │   ├── DestinasiList.tsx
│   │   ├── DestinasiDetail.tsx
│   │   └── BeliTiket.tsx
│   ├── EkonomiKreatif/           ← NEW
│   │   ├── KatalogProduk.tsx
│   │   ├── ProdukDetail.tsx
│   │   └── Pelatihan.tsx
│   ├── EventFestival/            ← NEW
│   │   ├── EventList.tsx
│   │   └── EventDetail.tsx
│   ├── Panel/                    ← NEW (Authenticated user panels)
│   │   ├── Masyarakat/
│   │   │   ├── DashboardMasyarakat.tsx
│   │   │   ├── RiwayatBooking.tsx
│   │   │   └── TiketSaya.tsx
│   │   ├── OKP/
│   │   │   ├── DashboardOKP.tsx
│   │   │   ├── ProfilOrganisasi.tsx
│   │   │   ├── KelolaKegiatan.tsx
│   │   │   └── LaporanKegiatan.tsx
│   │   └── Pengelola/
│   │       ├── DashboardPengelola.tsx
│   │       ├── KalenderBooking.tsx
│   │       └── VerifikasiPembayaran.tsx
│   └── Dashboard/
│       └── DashboardExec.tsx     ← NEW (Executive dashboard)
└── components/
    ├── booking/                  ← NEW
    │   ├── CalendarSlot.tsx
    │   ├── BookingCard.tsx
    │   └── PaymentUpload.tsx
    ├── map/                      ← NEW
    │   └── InteractiveMap.tsx
    ├── okp/                      ← NEW
    │   ├── OKPCard.tsx
    │   └── KegiatanTimeline.tsx
    └── wisata/                   ← NEW
        ├── DestinasiCard.tsx
        └── ETicket.tsx
```
