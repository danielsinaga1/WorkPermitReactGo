# EKRAF Backend API

Backend API untuk aplikasi EKRAF menggunakan Lumen Laravel.

## Requirements

- PHP >= 8.2
- Composer
- MySQL/MariaDB
- Extension PHP: OpenSSL, PDO, Mbstring, JSON

## Installation

1. Clone repository ini
2. Install dependencies:
```bash
composer install
```

3. Copy file environment:
```bash
cp .env.example .env
```

4. Generate JWT secret:
```bash
php artisan jwt:secret
```

5. Konfigurasi database di file `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ekraf_db
DB_USERNAME=root
DB_PASSWORD=
```

6. Jalankan migration:
```bash
php artisan migrate
```

7. Jalankan seeder:
```bash
php artisan db:seed
```

8. Jalankan server:
```bash
php -S localhost:8000 -t public
```

## Default Users

Setelah menjalankan seeder, akun default yang tersedia:

| Email | Password | Role |
|-------|----------|------|
| admin@ekraf.go.id | admin123 | admin |
| editor@ekraf.go.id | editor123 | editor |
| user@ekraf.go.id | user123 | user |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Berita
- `GET /api/berita` - List all berita
- `GET /api/berita/{id}` - Get berita detail
- `POST /api/berita` - Create berita (admin/editor)
- `PUT /api/berita/{id}` - Update berita (admin/editor)
- `DELETE /api/berita/{id}` - Delete berita (admin)

### Pengumuman
- `GET /api/pengumuman` - List all pengumuman
- `GET /api/pengumuman/{id}` - Get pengumuman detail
- `POST /api/pengumuman` - Create pengumuman (admin/editor)
- `PUT /api/pengumuman/{id}` - Update pengumuman (admin/editor)
- `DELETE /api/pengumuman/{id}` - Delete pengumuman (admin)

### Promosi
- `GET /api/promosi` - List all promosi
- `GET /api/promosi/{id}` - Get promosi detail
- `POST /api/promosi` - Create promosi (admin/editor)
- `PUT /api/promosi/{id}` - Update promosi (admin/editor)
- `DELETE /api/promosi/{id}` - Delete promosi (admin)

### Ragam Ekraf
- `GET /api/ragam-ekraf` - List all ragam ekraf
- `GET /api/ragam-ekraf/{id}` - Get ragam ekraf detail
- `POST /api/ragam-ekraf` - Create ragam ekraf (admin/editor)
- `PUT /api/ragam-ekraf/{id}` - Update ragam ekraf (admin/editor)
- `DELETE /api/ragam-ekraf/{id}` - Delete ragam ekraf (admin)

### Subsektor
- `GET /api/subsektor` - List all subsektor
- `GET /api/subsektor/{id}` - Get subsektor detail
- `POST /api/subsektor` - Create subsektor (admin)
- `PUT /api/subsektor/{id}` - Update subsektor (admin)
- `DELETE /api/subsektor/{id}` - Delete subsektor (admin)

### Newsletter
- `GET /api/newsletter` - List all newsletter
- `GET /api/newsletter/{id}` - Get newsletter detail
- `POST /api/newsletter` - Create newsletter (admin/editor)
- `PUT /api/newsletter/{id}` - Update newsletter (admin/editor)
- `DELETE /api/newsletter/{id}` - Delete newsletter (admin)

### Pustaka
- `GET /api/pustaka` - List all pustaka
- `GET /api/pustaka/{id}` - Get pustaka detail
- `POST /api/pustaka` - Create pustaka (admin/editor)
- `PUT /api/pustaka/{id}` - Update pustaka (admin/editor)
- `DELETE /api/pustaka/{id}` - Delete pustaka (admin)

### Tenaga Kerja
- `GET /api/tenaga-kerja` - List all tenaga kerja
- `GET /api/tenaga-kerja/{id}` - Get tenaga kerja detail
- `POST /api/tenaga-kerja` - Create tenaga kerja (admin/editor)
- `PUT /api/tenaga-kerja/{id}` - Update tenaga kerja (admin/editor)
- `DELETE /api/tenaga-kerja/{id}` - Delete tenaga kerja (admin)

### Produk Hukum
- `GET /api/produk-hukum` - List all produk hukum
- `GET /api/produk-hukum/{id}` - Get produk hukum detail
- `POST /api/produk-hukum` - Create produk hukum (admin/editor)
- `PUT /api/produk-hukum/{id}` - Update produk hukum (admin/editor)
- `DELETE /api/produk-hukum/{id}` - Delete produk hukum (admin)

### Banner
- `GET /api/banner` - List all banner
- `GET /api/banner/{id}` - Get banner detail
- `POST /api/banner` - Create banner (admin)
- `PUT /api/banner/{id}` - Update banner (admin)
- `DELETE /api/banner/{id}` - Delete banner (admin)

### Statistik
- `GET /api/statistik` - Get statistik ekonomi kreatif
- `GET /api/statistik/{id}` - Get statistik detail

### PPID
- `GET /api/ppid` - List all PPID content
- `GET /api/ppid/{section}` - Get PPID by section

### Profil Pimpinan
- `GET /api/profil` - List profil pimpinan
- `GET /api/profil/{id}` - Get profil pimpinan detail

### Reformasi Birokrasi
- `GET /api/reformasi-birokrasi` - List reformasi birokrasi
- `GET /api/reformasi-birokrasi/{id}` - Get reformasi birokrasi detail

### Realisasi Anggaran
- `GET /api/realisasi-anggaran` - List realisasi anggaran
- `GET /api/realisasi-anggaran/{id}` - Get realisasi anggaran detail

### Dashboard (Admin)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent` - Get recent activities

### Upload
- `POST /api/upload/image` - Upload image
- `POST /api/upload/document` - Upload document
- `DELETE /api/upload/{path}` - Delete file

## Testing

Jalankan test:
```bash
./vendor/bin/phpunit
```

## License

MIT License
