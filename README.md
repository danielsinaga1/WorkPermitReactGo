# DISPOPAREKRAF Kota Bontang

Aplikasi web Dinas Pemuda, Olahraga, Pariwisata, dan Ekonomi Kreatif (DISPOPAREKRAF) Kota Bontang. Sistem ini mencakup portal publik, dashboard admin, dan berbagai fitur layanan digital.

## 📁 Struktur Proyek

```
├── ekraf-backend/    # Backend API (Lumen 10 / PHP 8.1+)
├── ekraf-web/        # Frontend (React 19 + TypeScript + Vite)
└── ARCHITECTURE.md   # Dokumentasi arsitektur lengkap
```

## ⚙️ Tech Stack

| Layer    | Teknologi                                      |
| -------- | ---------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, PrimeReact |
| Backend  | Lumen 10 (Laravel), PHP 8.1+                  |
| Database | MySQL                                          |
| Auth     | JWT (tymon/jwt-auth)                           |

## 🚀 Getting Started

### Prasyarat

- **PHP** >= 8.1 + Composer
- **Node.js** >= 18 + npm
- **MySQL** >= 8.0

### 1. Clone Repository

```bash
git clone https://github.com/Devel-LTN/dispopar-apps.git
cd dispopar-apps
```

### 2. Setup Backend

```bash
cd ekraf-backend
composer install
cp .env.example .env
# Edit .env sesuai konfigurasi database lokal
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`

### 3. Setup Frontend

```bash
cd ekraf-web
npm install
# Pastikan VITE_API_URL mengarah ke backend (default: http://localhost:8000)
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🌐 Fitur Utama

- **Portal Publik** — Berita, pengumuman, informasi pariwisata, ekonomi kreatif
- **Fasilitas & Booking** — Daftar fasilitas olahraga, booking online dengan e-ticketing
- **Pariwisata** — Destinasi wisata, event & festival, tiket wisata
- **Ekonomi Kreatif** — Ragam ekraf, e-katalog produk UMKM, pelatihan, pengajuan HAKI
- **Kepemudaan** — Direktori organisasi, kegiatan pemuda
- **Dashboard Admin** — Manajemen konten, verifikasi pelaku ekraf, laporan & statistik
- **PPID** — Informasi publik dan transparansi

## 👥 User Roles

| Role            | Akses                                    |
| --------------- | ---------------------------------------- |
| Super Admin     | Full access seluruh sistem               |
| Admin Pariwisata| Manajemen wisata, event, booking         |
| Admin Ekraf     | Manajemen ekraf, HAKI, katalog produk    |
| Admin Pemuda    | Manajemen organisasi, kegiatan pemuda    |
| Pelaku Ekraf    | Profil, produk, pendaftaran pelatihan    |
| Publik          | Akses portal publik tanpa login          |

## 📜 Lisensi

MIT
