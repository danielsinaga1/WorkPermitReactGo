# Gap Analysis: Safetymint E-PTW vs WP-HSE Application

> **Tanggal Analisis:** 5 April 2026  
> **Standar Acuan:** Safetymint E-PTW  
> **Aplikasi Target:** WP-HSE (wp-services + wp-ui)  
> **Metode:** Full codebase review (41 models, 100+ endpoints, 21 pages, 44 components)

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Tabel Perbandingan Fitur](#2-tabel-perbandingan-fitur)
   - [2.1 Konfigurasi & Setup](#21-konfigurasi--setup)
   - [2.2 Operasional Izin Kerja](#22-operasional-izin-kerja)
   - [2.3 Modul Keselamatan Terintegrasi](#23-modul-keselamatan-terintegrasi)
   - [2.4 Monitoring & Pelaporan](#24-monitoring--pelaporan)
   - [2.5 Manajemen Pengguna](#25-manajemen-pengguna)
   - [2.6 Teknis & Integrasi](#26-teknis--integrasi)
3. [Ringkasan Kesenjangan](#3-ringkasan-kesenjangan)
   - [3.1 Fitur Kritis yang Hilang (High Priority)](#31-fitur-kritis-yang-hilang-high-priority)
   - [3.2 Fitur Penting yang Hilang (Medium Priority)](#32-fitur-penting-yang-hilang-medium-priority)
4. [Keunggulan Aplikasi Anda vs Safetymint](#4-keunggulan-aplikasi-anda-vs-safetymint)
5. [Rekomendasi Prioritas Pengembangan](#5-rekomendasi-prioritas-pengembangan)
6. [Statistik Keseluruhan](#6-statistik-keseluruhan)

---

## 1. Ringkasan Eksekutif

Dari **26 fitur standar** Safetymint E-PTW yang dianalisis:

| Status | Jumlah | Persentase |
|--------|--------|------------|
| ✅ Ada (Fully Implemented) | **13** | 50% |
| ⚠️ Parsial (Partially Implemented) | **7** | 27% |
| ❌ Tidak Ada (Missing) | **6** | 23% |

Aplikasi WP-HSE sudah mencakup **77% fitur** Safetymint (termasuk parsial), dan memiliki **8 fitur unggulan** yang tidak dimiliki Safetymint. Area kesenjangan terbesar ada pada **Teknis & Integrasi** (SSO, Multilingual, Mobile App) dan beberapa fitur operasional kritis (Transfer, Revoke, PPE Checklist).

---

## 2. Tabel Perbandingan Fitur

### 2.1 Konfigurasi & Setup

| # | Fitur Standar (Safetymint) | Status | Rincian Perbedaan / Catatan |
|---|---|:---:|---|
| 1.1 | **Permit Checklist Builder (no-code)** | ❌ Tidak Ada | Tidak ada UI drag-and-drop builder. Sistem menggunakan JSA Templates dan `PermitType` dengan konfigurasi `workflow_stages` (JSON), namun konfigurasi harus dilakukan oleh developer, bukan end-user. |
| 1.2 | **Customizable Workflows** | ✅ Ada | `PermitType` model memiliki `workflow_stages` (JSON array) yang mengatur stage approval per tipe izin. Stage bisa dikustomisasi: approval, verification, review, sign-off. Dikelola via halaman Permit Type List. |
| 1.3 | **Template Settings** | ✅ Ada | 3 template permits (GREEN/BLUE/RED) dengan konfigurasi berbeda — required qualifications, equipment certifications, max duration. JSA Templates juga tersedia per permit type & zone type. |
| 1.4 | **Field Configuration (Mandatory/Optional)** | ⚠️ Parsial | Business rules enforce mandatory fields secara **hardcoded** di `WorkPermitService` (gas test wajib untuk Blue Form, foto before/after untuk Green Form, lessons learned untuk Red Form). **Tidak ada UI konfigurasi** untuk menentukan field mandatory/optional secara dinamis. |
| 1.5 | **Instruction Embedding** | ⚠️ Parsial | `ToolboxMeeting` memiliki `briefing_template` dan `key_points`. JSA Templates memiliki steps dengan hazard & control. Namun **tidak ada fitur embedding instruksi langsung ke dalam form permit** (tooltip/inline guidance). |

### 2.2 Operasional Izin Kerja

| # | Fitur Standar (Safetymint) | Status | Rincian Perbedaan / Catatan |
|---|---|:---:|---|
| 2.1 | **Initiate Request** | ✅ Ada | `POST /api/wp/permits` + UI PermitForm. Lifecycle: Draft → Submitted → Under Review → Risk Assessment → Pending Approval → Approved → Active → Completed → Closed. |
| 2.2 | **Digital Signature (Text/Draw/Upload)** | ⚠️ Parsial | **Draw** tersedia via `ESignatureCanvas` (canvas freehand drawing, mouse + touch). SHA-256 hash, GPS, IP, device info tercatat. **Text signature** dan **Upload gambar tanda tangan** belum tersedia — hanya mode Draw. |
| 2.3 | **QR Code System (Scanner & Generator)** | ⚠️ Parsial | **Scanner/Verifier** ada via `QRScanner` component + `POST /api/wp/qr-verify`. `Personnel` dan `Equipment` memiliki field `qr_code`. Namun **QR Code Generator UI** (untuk mencetak/menampilkan QR) tidak ditemukan di frontend. |
| 2.4 | **Permit Lifecycle — Extend** | ✅ Ada | Model `PermitExtension` dengan `original_end`, `extended_end`, `reason`, `status`. |
| 2.5 | **Permit Lifecycle — Transfer** | ❌ Tidak Ada | **Tidak ada model, endpoint, atau UI** untuk mentransfer permit ke personel/supervisor lain. |
| 2.6 | **Permit Lifecycle — Revoke** | ❌ Tidak Ada | Status permit mencakup `suspended` tetapi **tidak ada endpoint atau UI** khusus untuk revoke/pencabutan permit. |
| 2.7 | **Permit Lifecycle — Close** | ✅ Ada | `POST /api/wp/permits/{id}/close` dengan validasi foto evidence (Green Form) dan closure remarks. |
| 2.8 | **Night Work Toggle** | ❌ Tidak Ada | Tidak ditemukan field `is_night_work`, toggle, atau logika khusus shift malam di seluruh codebase. |
| 2.9 | **Closure Checklist** | ⚠️ Parsial | Penutupan permit memerlukan foto before/after dan remarks, tetapi **tidak ada checklist terstruktur** (daftar item yang harus dicentang sebelum closure). |

### 2.3 Modul Keselamatan Terintegrasi

| # | Fitur Standar (Safetymint) | Status | Rincian Perbedaan / Catatan |
|---|---|:---:|---|
| 3.1 | **HIRA (Hazard Identification and Risk Assessment)** | ✅ Ada | `PermitRiskAssessment` dengan matrix Likelihood (1-5) × Severity (1-5), auto-calculated risk level (Low/Medium/High/Extreme), kategori hazard (chemical, physical, biological, ergonomic, mechanical), control measures & residual risk. |
| 3.2 | **PPE Checklist** | ❌ Tidak Ada | **Tidak ada model atau UI khusus** untuk PPE checklist. `SafetyObservation` memiliki kategori `ppe_compliance`, tetapi itu hanya untuk pelaporan pelanggaran — bukan checklist yang harus diisi sebelum kerja dimulai. |
| 3.3 | **Incident & Observation Reporting** | ✅ Ada | **Sangat lengkap.** Incidents (10 tipe: near-miss s/d fatality), Observations (8 kategori), foto annotations (before/during/after), RCA (5 metode: 5-Why, Fishbone, Fault-Tree, TapRoot, Bowtie), Corrective Actions dengan tracking overdue, witnesses, attachments. |
| 3.4 | **Audits Module** | ⚠️ Parsial | `SafetyObservation` memiliki type `audit` dan `inspection`, namun **bukan modul audit terpisah** dengan fitur: jadwal audit, checklist audit khusus, findings management, compliance scoring, dan audit report. Yang ada saat ini adalah Audit Trail untuk log aktivitas sistem. |

### 2.4 Monitoring & Pelaporan

| # | Fitur Standar (Safetymint) | Status | Rincian Perbedaan / Catatan |
|---|---|:---:|---|
| 4.1 | **Real-time Dashboard** | ✅ Ada | DashboardHome (6 KPI cards: active permits, open incidents, overdue actions, LOTO locks, TBM, observations) + WpHseDashboard (trend charts, leading indicators, risk gauge). Library: ApexCharts + Chart.js. |
| 4.2 | **Audit Trail (presisi hingga detik)** | ✅ Ada | Model `AuditTrail` dengan `performed_at` timestamp presisi detik, `module`, `action`, `performed_by`, `old_values`/`new_values` JSON, `ip_address`, `user_agent`. UI tersedia di halaman Audit Trail. |
| 4.3 | **Consolidated Reports (Filter by Site/Date)** | ✅ Ada | Dashboard endpoints mendukung filter. Trends dan overview dengan parameter tanggal. Observations dan incidents bisa difilter per work area dan date range. |
| 4.4 | **Export to Excel & PDF** | ✅ Ada | `POST /api/wp/dashboard/export` mendukung format `pdf`, `excel`, `csv`. Async job queue (queued → processing → completed) dengan model `ReportExport`. |

### 2.5 Manajemen Pengguna

| # | Fitur Standar (Safetymint) | Status | Rincian Perbedaan / Catatan |
|---|---|:---:|---|
| 5.1 | **Contractor Management System** | ✅ Ada | Model `ContractorCompany` dengan `compliance_status` (compliant/non_compliant/blacklisted), `safety_score`, `total_violations`, `hse_cert_expiry`, `incident_count`. UI tersedia di halaman Contractor List. |
| 5.2 | **Automated Notifications (Email/In-app)** | ⚠️ Parsial | **In-app** ada: `NotificationBell` dengan polling 30 detik, tipe notifikasi: `sos_alert`, `gas_test_unsafe`, `geofence_violation`, `permit_approved/rejected/expiring`. **Email notification belum ada** — tidak ditemukan mail driver, SMTP config, atau email template di codebase. |
| 5.3 | **Role-based Access Control (RBAC)** | ✅ Ada | JWT + Middleware RBAC. 6 roles: `masyarakat`, `admin`, `pengelola`, `safety_officer`, `supervisor`, `hse_personnel`. Approval stages dikonfigurasi per role dari permit type. |

### 2.6 Teknis & Integrasi

| # | Fitur Standar (Safetymint) | Status | Rincian Perbedaan / Catatan |
|---|---|:---:|---|
| 6.1 | **Third-party REST API** | ✅ Ada | Seluruh backend adalah REST API (Laravel Lumen). 100+ endpoints dengan JSON response, JWT auth, CORS configured. Siap diintegrasi oleh sistem pihak ketiga. |
| 6.2 | **SSO (Single Sign-On)** | ❌ Tidak Ada | Hanya JWT login (email/password). **Tidak ada** OAuth2, SAML, OIDC, atau integrasi SSO provider (Google Workspace, Azure AD, Okta, dll). |
| 6.3 | **Multilingual Support** | ❌ Tidak Ada | UI menggunakan campuran Bahasa Indonesia dan Inggris secara hardcoded. **Tidak ada** i18n library (react-i18next/vue-i18n), translation files, atau language switcher. |
| 6.4 | **Mobile App (Android/iOS)** | ⚠️ Parsial | Web responsive (PrimeReact + TailwindCSS) dengan offline queue (`OfflineIndicator`, localStorage). Namun **bukan** native app atau PWA penuh — tidak ada service worker, manifest.json, atau project React Native/Flutter. |
| 6.5 | **Web Access** | ✅ Ada | React 19 + TypeScript + Vite SPA, responsive layout, touch-friendly components. |

---

## 3. Ringkasan Kesenjangan

### 3.1 Fitur Kritis yang Hilang (High Priority)

| Prioritas | Fitur Hilang | Dampak Bisnis | Kompleksitas |
|---|---|---|---|
| 🔴 **P0** | **PPE Checklist** | Wajib K3 — tanpa ini, kepatuhan terhadap standar PPE tidak bisa di-enforce sebelum kerja dimulai. Merupakan requirement regulasi K3 Indonesia dan internasional. | Medium |
| 🔴 **P0** | **Permit Transfer** | Operasional — jika supervisor/pekerja bertukar shift atau berhalangan, permit harus bisa dipindahtangankan tanpa membuat ulang. Tanpa ini, workflow terganggu. | Medium |
| 🔴 **P0** | **Permit Revoke/Pencabutan** | Safety critical — harus bisa mencabut permit secara darurat saat terjadi insiden, cuaca buruk, atau perubahan kondisi kerja yang membahayakan. | Low–Medium |
| 🔴 **P0** | **Night Work Toggle** | Regulasi K3 — pekerjaan malam memerlukan izin tambahan, kontrol keselamatan berbeda (pencahayaan, fatigue management), dan notifikasi khusus. | Low |
| 🟠 **P1** | **Email Notifications** | Banyak approver dan HSE personnel tidak selalu membuka dashboard — email kritis untuk eskalasi SOS, approval request, dan alert keselamatan. | Medium |
| 🟠 **P1** | **SSO Integration** | Enterprise requirement — perusahaan besar (Pertamina, FREEPORT, dll) memerlukan integrasi dengan Active Directory / identity provider mereka. Tanpa SSO, adopsi enterprise sulit. | Medium–High |
| 🟠 **P1** | **Closure Checklist (terstruktur)** | Audit compliance — checklist closure harus terdokumentasi sebagai daftar item yang dicek satu per satu, bukan hanya text remarks. Auditor memerlukan bukti checklist. | Low |

### 3.2 Fitur Penting yang Hilang (Medium Priority)

| Prioritas | Fitur Hilang | Dampak Bisnis |
|---|---|---|
| 🟡 **P2** | **No-Code Checklist/Form Builder** | Mengurangi ketergantungan pada developer untuk konfigurasi form baru — penting untuk scaling ke banyak klien dengan kebutuhan berbeda. |
| 🟡 **P2** | **Modul Audit Terpisah** | Audits memerlukan: jadwal periodik, checklist audit khusus, findings management, compliance scoring, laporan audit — tidak cukup hanya sebagai type di observation. |
| 🟡 **P2** | **Mobile App (PWA/Native)** | Field workers memerlukan akses offline yang robust dengan kamera, GPS, dan push notification native. PWA sebagai langkah pertama lebih realistis. |
| 🟡 **P2** | **Multilingual Support** | Diperlukan jika melayani kontraktor asing atau proyek internasional. Standar industri untuk software K3 global. |
| 🟡 **P2** | **Digital Signature — Text & Upload** | Fleksibilitas pengguna — tidak semua bisa draw di layar kecil. Text signature (ketik nama) dan upload scan tanda tangan needed. |
| 🟡 **P2** | **QR Code Generator UI** | Perlu bisa generate & cetak QR code untuk ditempel di permit fisik, equipment, dan area kerja. Saat ini hanya bisa scan/verify. |

---

## 4. Keunggulan Aplikasi Anda vs Safetymint

Aplikasi WP-HSE memiliki beberapa fitur yang **tidak disebutkan** dalam daftar fitur standar Safetymint:

| # | Fitur Unggulan | Deskripsi |
|---|---|---|
| 1 | **LOTO (Lock-Out/Tag-Out)** | Modul lengkap: prosedur isolasi energi, isolation points, lock management, verifikasi, QR/NFC scanning, force removal authorization, double-isolation untuk high-risk. |
| 2 | **Gas Testing (4-Gas Monitoring)** | Monitoring O₂/LEL/H₂S/CO real-time dengan auto-safety evaluation terhadap threshold standar, unsafe reading notification, mandatory untuk confined space permit. |
| 3 | **SIMOPS Clash Detection** | 4 tipe deteksi konflik otomatis: location (area sama), proximity (radius aman), resource (equipment sama), personnel (pekerja sama) — dengan severity grading (critical blocks approval, warning logged). |
| 4 | **Emergency SOS System** | Tombol SOS dengan GPS tracking, multi-stage resolution (triggered → acknowledged → responding → resolved), response time calculation, broadcast ke seluruh ERT/HSE. |
| 5 | **Geofence GPS Validation** | Validasi lokasi pekerja terhadap radius area kerja sebelum permit diaktifkan. Check-in/check-out logging, periodic validation, violation detection. |
| 6 | **Root Cause Analysis (5 Metode)** | Investigasi insiden dengan 5 metode RCA: 5-Why, Fishbone, Fault-Tree, TapRoot, Bowtie — sangat komprehensif dibanding standar industri. |
| 7 | **Lessons Learned + Mandatory Reading** | Repository pelajaran dari insiden dengan enforcement: pekerja HARUS membaca dan acknowledge lessons learned sebelum permit (Red Form) bisa disetujui. |
| 8 | **Offline Sync Queue** | Mekanisme antrian request saat offline menggunakan localStorage, auto-sync saat koneksi kembali — penting untuk lingkungan field dengan koneksi tidak stabil. |

---

## 5. Rekomendasi Prioritas Pengembangan

### Sprint 1 — Quick Wins (Perubahan Kecil)
- [ ] **Night Work Toggle** — Tambah field `is_night_work` (boolean) di model WorkPermit + toggle di UI form
- [ ] **Permit Revoke** — Tambah endpoint `POST /api/wp/permits/{id}/revoke` + button di PermitDetail
- [ ] **Closure Checklist** — Buat model `ClosureChecklistItem` + checklist UI di flow close permit

### Sprint 2 — Core Safety Gap
- [ ] **Permit Transfer** — Buat model `PermitTransfer` (from_personnel, to_personnel, reason, approved_by) + workflow transfer
- [ ] **PPE Checklist Module** — Buat model `PpeChecklist` + `PpeChecklistItem` + integrasi ke form permit (wajib diisi sebelum submit)

### Sprint 3 — Communication & UX
- [ ] **Email Notifications** — Konfigurasi SMTP/mail driver, buat email templates (approval request, SOS alert, permit expiring, gas test unsafe)
- [ ] **QR Code Generator UI** — Tambah library QR generator (chillerlan/php-qr-code atau frontend: qrcode.react) + UI cetak QR
- [ ] **Digital Signature — Text & Upload** — Tambah mode text (ketik nama → render font) dan upload gambar di ESignatureCanvas

### Sprint 4 — Enterprise Readiness
- [ ] **SSO Integration** — Implementasi OAuth2/SAML via Laravel Passport atau Socialite (Azure AD, Google, Okta)
- [ ] **Modul Audit Terpisah** — Buat: AuditSchedule, AuditChecklist, AuditFinding, AuditReport models + dedicated pages

### Sprint 5 — Scale & Global
- [ ] **PWA Support** — Tambah service worker, manifest.json, cache strategies, push notification (Web Push API)
- [ ] **Multilingual (i18n)** — Integrasi react-i18next, buat translation files (id/en), language switcher
- [ ] **No-Code Form Builder** — UI drag-and-drop untuk konfigurasi checklist dan custom fields per permit type

---

## 6. Statistik Keseluruhan

```
╔══════════════════════════════════════════════════╗
║           COVERAGE SUMMARY                       ║
╠══════════════════════════════════════════════════╣
║  Total Fitur Safetymint     : 26                 ║
║  ✅ Fully Implemented       : 13  (50.0%)        ║
║  ⚠️ Partially Implemented   :  7  (26.9%)        ║
║  ❌ Not Implemented          :  6  (23.1%)        ║
║──────────────────────────────────────────────────║
║  Coverage (termasuk parsial): 76.9%              ║
║  Fitur Unggulan (bonus)     :  8 fitur           ║
║──────────────────────────────────────────────────║
║  Backend Models              : 41                ║
║  API Endpoints               : 100+             ║
║  Frontend Pages              : 21               ║
║  Frontend Components         : 44               ║
╚══════════════════════════════════════════════════╝
```

---

> **Catatan:** Analisis ini berdasarkan review seluruh source code (backend models, controllers, services, routes, frontend pages, components, services, dan types) per tanggal 5 April 2026. Fitur yang statusnya "Parsial" memiliki fondasi teknis yang baik dan bisa di-upgrade dengan effort yang lebih rendah dibanding membangun dari nol.
