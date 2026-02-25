// ============================================================
// COMMON TYPES
// ============================================================
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================================
// AUTH & USER
// ============================================================
export type UserRole =
  | "admin"
  | "editor"
  | "user"
  | "masyarakat"
  | "admin_okp"
  | "pengelola";

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  role: UserRole;
  nik?: string | null;
  no_telp?: string | null;
  alamat?: string | null;
  is_active: boolean;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  user: User;
}

// ============================================================
// FASILITAS & BOOKING
// ============================================================
export type JenisFasilitas =
  | "gedung_olahraga"
  | "lapangan"
  | "kolam_renang"
  | "gedung_serbaguna"
  | "ruang_rapat"
  | "taman"
  | "lainnya";

export interface Fasilitas {
  id: number;
  nama: string;
  slug: string;
  jenis: JenisFasilitas;
  deskripsi?: string | null;
  alamat: string;
  latitude?: number | null;
  longitude?: number | null;
  kapasitas?: number | null;
  thumbnail?: string | null;
  images?: string[] | null;
  fasilitas_detail?: string[] | null;
  is_active: boolean;
  pengelola_id?: string | null;
  pengelola?: User;
  tarifs?: FasilitasTarif[];
  created_at: string;
  updated_at: string;
}

export interface FasilitasTarif {
  id: number;
  fasilitas_id: number;
  nama_tarif: string;
  harga: number; // decimal
  satuan: string;
  keterangan?: string | null;
  is_active: boolean;
}

export type SlotStatus = "tersedia" | "dipesan" | "dikonfirmasi" | "maintenance";

export interface FasilitasSlot {
  id: number;
  fasilitas_id: number;
  tanggal: string; // date
  jam_mulai: string; // time HH:mm
  jam_selesai: string; // time HH:mm
  status: SlotStatus;
}

export interface FasilitasBlackout {
  id: number;
  fasilitas_id: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  alasan?: string | null;
}

export interface KetersediaanResponse {
  slots: FasilitasSlot[];
  blackouts: FasilitasBlackout[];
}

export type BookingStatus =
  | "menunggu_bayar"
  | "bukti_dikirim"
  | "terverifikasi"
  | "ditolak"
  | "dibatalkan"
  | "selesai";

export interface Booking {
  id: number;
  kode_booking: string;
  user_id: string;
  fasilitas_id: number;
  slot_id: number;
  tarif_id: number;
  status: BookingStatus;
  total_biaya: number;
  bukti_bayar?: string | null;
  payment_method?: string | null;
  catatan?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  user?: User;
  fasilitas?: Fasilitas;
  slot?: FasilitasSlot;
  tarif?: FasilitasTarif;
  verifier?: User;
  created_at: string;
  updated_at: string;
}

export interface BookingPayload {
  fasilitas_id: number;
  slot_id: number;
  tarif_id: number;
  catatan?: string;
}

// ============================================================
// ORGANISASI / OKP
// ============================================================
export type StatusOrganisasi =
  | "draft"
  | "pending_verifikasi"
  | "terverifikasi"
  | "ditolak"
  | "nonaktif";

export interface Organisasi {
  id: number;
  nama: string;
  singkatan?: string | null;
  slug: string;
  no_sk?: string | null;
  file_sk?: string | null;
  bidang_fokus?: string | null;
  deskripsi?: string | null;
  alamat_sekretariat?: string | null;
  logo?: string | null;
  kontak?: string | null;
  email?: string | null;
  status: StatusOrganisasi;
  admin_id?: string | null;
  verified_by?: string | null;
  catatan_verifikasi?: string | null;
  admin?: User;
  pengurus?: OrgPengurus[];
  kegiatans?: OrgKegiatan[];
  created_at: string;
  updated_at: string;
}

export interface OrgPengurus {
  id: number;
  organisasi_id: number;
  user_id?: string | null;
  nama: string;
  jabatan: string;
  no_telp?: string | null;
  email?: string | null;
  periode?: string | null;
  is_active: boolean;
}

export type JenisKegiatan =
  | "rapat"
  | "pelatihan"
  | "sosial"
  | "olahraga"
  | "kebudayaan"
  | "lainnya";

export type StatusKegiatan = "draft" | "diajukan" | "disetujui" | "ditolak" | "selesai";

export interface OrgKegiatan {
  id: number;
  organisasi_id: number;
  judul: string;
  deskripsi?: string | null;
  tanggal_mulai: string;
  tanggal_selesai?: string | null;
  lokasi?: string | null;
  jenis: JenisKegiatan;
  status: StatusKegiatan;
  anggaran?: number | null;
  foto_kegiatan?: string[] | null;
  is_published: boolean;
  organisasi?: Organisasi;
  laporan?: OrgLaporan;
  created_at: string;
  updated_at: string;
}

export type StatusLaporan = "diajukan" | "diterima" | "revisi" | "ditolak";

export interface OrgLaporan {
  id: number;
  kegiatan_id: number;
  file_laporan: string;
  foto_kegiatan?: string[] | null;
  catatan?: string | null;
  status: StatusLaporan;
  reviewed_by?: string | null;
  catatan_review?: string | null;
  kegiatan?: OrgKegiatan;
  reviewer?: User;
}

export interface OrganisasiPayload {
  nama: string;
  singkatan?: string;
  no_sk?: string;
  file_sk?: File;
  bidang_fokus?: string;
  deskripsi?: string;
  alamat_sekretariat?: string;
  logo?: File;
  kontak?: string;
  email?: string;
  pengurus: PengurusPayload[];
}

export interface PengurusPayload {
  nama: string;
  jabatan: string;
  no_telp?: string;
  email?: string;
  periode?: string;
}

// ============================================================
// DESTINASI WISATA & TIKET
// ============================================================
export type KategoriWisata =
  | "alam"
  | "budaya"
  | "buatan"
  | "religi"
  | "kuliner"
  | "edukasi";

export interface DestinasiWisata {
  id: number;
  nama: string;
  slug: string;
  deskripsi?: string | null;
  alamat: string;
  latitude?: number | null;
  longitude?: number | null;
  kategori: KategoriWisata;
  thumbnail?: string | null;
  images?: string[] | null;
  virtual_tour_url?: string | null;
  fasilitas?: string[] | null;
  jam_operasional?: string | null;
  harga_tiket?: number | null;
  is_ticketed: boolean;
  is_active: boolean;
  total_pengunjung: number;
  created_at: string;
  updated_at: string;
}

export type StatusTiket =
  | "menunggu_bayar"
  | "terbayar"
  | "digunakan"
  | "dibatalkan"
  | "kadaluarsa";

export interface TiketWisata {
  id: number;
  kode_tiket: string;
  user_id: string;
  destinasi_id: number;
  jumlah_tiket: number;
  harga_satuan: number;
  total_harga: number;
  tanggal_kunjungan: string;
  status: StatusTiket;
  qr_code?: string | null;
  used_at?: string | null;
  user?: User;
  destinasi?: DestinasiWisata;
  created_at: string;
  updated_at: string;
}

export interface TiketPayload {
  destinasi_id: number;
  jumlah_tiket: number;
  tanggal_kunjungan: string;
  payment_method?: string;
}

// ============================================================
// KATALOG PRODUK EKRAF
// ============================================================
export type KategoriProduk =
  | "kerajinan"
  | "kuliner"
  | "fashion"
  | "seni"
  | "digital"
  | "lainnya";

export interface KatalogProduk {
  id: number;
  nama_produk: string;
  slug: string;
  deskripsi?: string | null;
  kategori: KategoriProduk;
  subsektor_id?: number | null;
  thumbnail?: string | null;
  images?: string[] | null;
  harga?: number | null;
  pemilik_id?: string | null;
  nama_usaha?: string | null;
  kontak?: string | null;
  alamat_usaha?: string | null;
  is_verified: boolean;
  is_active: boolean;
  pemilik?: User;
  subsektor?: Subsektor;
  created_at: string;
  updated_at: string;
}

// ============================================================
// PELATIHAN
// ============================================================
export type KategoriPelatihan =
  | "kewirausahaan"
  | "digital_marketing"
  | "desain"
  | "kuliner"
  | "kerajinan"
  | "teknologi"
  | "lainnya";

export interface Pelatihan {
  id: number;
  judul: string;
  slug: string;
  deskripsi?: string | null;
  kategori: KategoriPelatihan;
  tanggal_mulai: string;
  tanggal_selesai?: string | null;
  lokasi?: string | null;
  kuota?: number | null;
  narasumber?: string | null;
  thumbnail?: string | null;
  syarat?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// EVENT & FESTIVAL
// ============================================================
export type KategoriEvent =
  | "festival"
  | "pameran"
  | "lomba"
  | "seminar"
  | "workshop"
  | "pertunjukan"
  | "lainnya";

export interface EventFestival {
  id: number;
  nama: string;
  slug: string;
  deskripsi?: string | null;
  kategori: KategoriEvent;
  tanggal_mulai: string;
  tanggal_selesai?: string | null;
  lokasi?: string | null;
  penyelenggara?: string | null;
  thumbnail?: string | null;
  images?: string[] | null;
  harga_tiket?: number | null;
  kontak?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// DASHBOARD
// ============================================================
export interface DashboardPublik {
  okp_aktif: number;
  destinasi_wisata: number;
  fasilitas_tersedia: number;
  produk_ekraf: number;
  kegiatan_bulan_ini: number;
}

export interface RetribusiSummary {
  total_pendapatan: number;
  total_booking: number;
  booking_terverifikasi: number;
  booking_pending: number;
}

export interface TrendItem {
  bulan: string;
  total: number;
}

export interface TopItem {
  id: number;
  nama: string;
  total: number;
}

export interface DashboardEksekutif {
  summary: {
    retribusi_bulan_ini: number;
    retribusi_tahun_ini: number;
    booking_bulan_ini: number;
    okp_aktif: number;
    okp_pending: number;
    kegiatan_pemuda_bulan_ini: number;
    destinasi_aktif: number;
    pengunjung_wisata_bulan_ini: number;
    pendapatan_tiket_bulan_ini: number;
    produk_katalog: number;
  };
  trend_retribusi: TrendItem[];
  trend_wisata: TrendItem[];
  booking_per_status: Array<{ status: string; jumlah: number }>;
  top_fasilitas: TopItem[];
  top_destinasi: TopItem[];
}

export interface DashboardRetribusi {
  total_retribusi_tahun: number;
  trend_bulanan: TrendItem[];
  booking_per_status: Array<{ status: string; jumlah: number }>;
  retribusi_per_fasilitas: TopItem[];
}

export interface DashboardOKP {
  total_okp: number;
  okp_aktif: number;
  okp_pending: number;
  kegiatan_bulan_ini: number;
  status_distribusi: Array<{ status: string; jumlah: number }>;
  bidang_distribusi: Array<{ bidang_fokus: string; jumlah: number }>;
  kegiatan_per_bulan: TrendItem[];
  kegiatan_per_jenis: Array<{ jenis: string; jumlah: number }>;
  okp_paling_aktif: Array<{ id: number; nama: string; singkatan: string; kegiatans_count: number }>;
}

export interface DashboardWisata {
  total_destinasi: number;
  total_pengunjung_tahun: number;
  total_pendapatan_tahun: number;
  trend_pengunjung: TrendItem[];
  per_kategori: Array<{ kategori: string; jumlah: number }>;
  top_destinasi: TopItem[];
}

// ============================================================
// EXISTING MODELS (re-export for completeness)
// ============================================================
export interface Subsektor {
  id: number;
  nama: string;
  slug: string;
  deskripsi?: string | null;
  thumbnail?: string | null;
  is_active: boolean;
}

export interface Berita {
  id: number;
  title: string;
  content?: string | null;
  date: string;
  thumbnail?: string | null;
  images?: string[] | null;
  descriptions?: string[] | null;
  is_published: boolean;
  author_id?: string | null;
  author?: { id: string; name: string };
  created_at: string;
  updated_at?: string;
}

export interface Pengumuman {
  id: number;
  title: string;
  content?: string | null;
  date: string;
  thumbnail?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Banner {
  id: number;
  title: string;
  description?: string | null;
  image_url: string;
  link_url?: string | null;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// PAYMENT LOG
// ============================================================
export type PaymentMethod = "transfer_bank" | "qris" | "tunai" | "lainnya";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export interface PaymentLog {
  id: number;
  payable_type: string;
  payable_id: number;
  user_id?: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_number?: string | null;
  gateway_response?: Record<string, unknown> | null;
  paid_at?: string | null;
  created_at: string;
}

// ============================================================
// PROMOSI
// ============================================================
export interface Promosi {
  id: number;
  title: string;
  content?: string | null;
  date: string;
  thumbnail?: string | null;
  images?: string[] | null;
  descriptions?: string[] | null;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// RAGAM EKRAF
// ============================================================
export interface RagamEkraf {
  id: number;
  title: string;
  content?: string | null;
  date: string;
  thumbnail?: string | null;
  images?: string[] | null;
  descriptions?: string[] | null;
  subsektor_id?: number | null;
  is_published: boolean;
  subsektor?: Subsektor;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// NEWSLETTER
// ============================================================
export interface Newsletter {
  id: number;
  title: string;
  content?: string | null;
  date: string;
  thumbnail?: string | null;
  pdf_url?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// PUSTAKA
// ============================================================
export interface Pustaka {
  id: number;
  title: string;
  content?: string | null;
  date: string;
  thumbnail?: string | null;
  pdf_url?: string | null;
  category?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// TENAGA KERJA
// ============================================================
export interface TenagaKerjaData {
  id: number;
  title: string;
  content?: string | null;
  date: string;
  thumbnail?: string | null;
  pdf_url?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// PRODUK HUKUM
// ============================================================
export type KategoriProdukHukum =
  | "undang_undang"
  | "peraturan_pemerintah"
  | "peraturan_presiden"
  | "peraturan_menteri"
  | "peraturan_daerah"
  | "naskah_kerja_sama"
  | "lainnya";

export interface ProdukHukum {
  id: number;
  title: string;
  author?: string | null;
  date: string;
  hits: number;
  file_url?: string | null;
  category: KategoriProdukHukum;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// POTENSI EKONOMI
// ============================================================
export interface PotensiEkonomi {
  id: number;
  title: string;
  value?: number | null;
  unit?: string | null;
  year?: number | null;
  category?: string | null;
  description?: string | null;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// PPID
// ============================================================
export type SeksiPPID =
  | "tentang_ppid"
  | "profil"
  | "tugas_fungsi"
  | "struktur_organisasi"
  | "visi_misi"
  | "regulasi"
  | "jam_pelayanan"
  | "formulir";

export interface PPID {
  id: number;
  section: SeksiPPID;
  title: string;
  content?: string | null;
  file_url?: string | null;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// PROFIL PIMPINAN
// ============================================================
export interface ProfilPimpinan {
  id: number;
  name: string;
  position: string;
  photo?: string | null;
  biography?: string | null;
  order: number;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// REFORMASI BIROKRASI
// ============================================================
export interface ReformasiBirokrasi {
  id: number;
  title: string;
  content?: string | null;
  category?: string | null;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// REALISASI ANGGARAN
// ============================================================
export interface RealisasiAnggaran {
  id: number;
  tahun: number;
  program: string;
  anggaran: number;
  realisasi: number;
  persentase: number;
  created_at: string;
  updated_at?: string;
}

// ============================================================
// FILTER / QUERY PARAMS
// ============================================================
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface FasilitasFilters extends PaginationParams {
  jenis?: JenisFasilitas;
  search?: string;
}

export interface OrganisasiFilters extends PaginationParams {
  bidang?: string;
  search?: string;
}

export interface DestinasiFilters extends PaginationParams {
  kategori?: KategoriWisata;
  search?: string;
}

export interface KatalogFilters extends PaginationParams {
  kategori?: KategoriProduk;
  subsektor_id?: number;
  search?: string;
}

export interface PelatihanFilters extends PaginationParams {
  kategori?: KategoriPelatihan;
  upcoming?: boolean;
  search?: string;
}

export interface EventFilters extends PaginationParams {
  kategori?: KategoriEvent;
  upcoming?: boolean;
  search?: string;
}

export interface BookingFilters extends PaginationParams {
  status?: BookingStatus;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
}

// ============================================================
// YOUTH OPPORTUNITY (Bontang Youth Talent)
// ============================================================
export type JenisYouthOpportunity = "beasiswa" | "lowongan_kerja" | "magang";

export interface YouthOpportunity {
  id: number;
  judul: string;
  slug: string;
  deskripsi?: string | null;
  jenis: JenisYouthOpportunity;
  penyelenggara?: string | null;
  lokasi?: string | null;
  batas_pendaftaran?: string | null;
  link_pendaftaran?: string | null;
  kontak?: string | null;
  thumbnail?: string | null;
  persyaratan?: string[] | null;
  gaji_min?: number | null;
  gaji_max?: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface YouthFilters extends PaginationParams {
  jenis?: JenisYouthOpportunity;
  search?: string;
  active_only?: boolean;
}

// ============================================================
// SIMPORA — ATLET & PELATIH
// ============================================================
export type JenisKelamin = "L" | "P";
export type StatusAtlet = "aktif" | "nonaktif" | "pensiun";

export interface PrestasiItem {
  event: string;
  tahun: number;
  medali?: string;
  keterangan?: string;
}

export interface Atlet {
  id: number;
  nama: string;
  slug: string;
  nik?: string | null;
  tanggal_lahir?: string | null;
  jenis_kelamin: JenisKelamin;
  cabang_olahraga: string;
  klub?: string | null;
  foto?: string | null;
  alamat?: string | null;
  no_telp?: string | null;
  prestasi?: PrestasiItem[] | null;
  status: StatusAtlet;
  created_at: string;
  updated_at: string;
}

export interface PengalamanPelatih {
  klub: string;
  periode: string;
  keterangan?: string;
}

export interface Pelatih {
  id: number;
  nama: string;
  slug: string;
  nik?: string | null;
  tanggal_lahir?: string | null;
  jenis_kelamin: JenisKelamin;
  cabang_olahraga: string;
  lisensi?: string | null;
  foto?: string | null;
  alamat?: string | null;
  no_telp?: string | null;
  pengalaman?: PengalamanPelatih[] | null;
  status: "aktif" | "nonaktif";
  created_at: string;
  updated_at: string;
}

export interface SimporaFilters extends PaginationParams {
  cabang?: string;
  status?: string;
  search?: string;
}

// ============================================================
// TURNAMEN
// ============================================================
export type StatusTurnamen = "pendaftaran" | "berlangsung" | "selesai" | "dibatalkan";

export interface Turnamen {
  id: number;
  nama: string;
  slug: string;
  deskripsi?: string | null;
  cabang_olahraga: string;
  tanggal_mulai: string;
  tanggal_selesai?: string | null;
  lokasi?: string | null;
  kuota_peserta?: number | null;
  peserta_count: number;
  penyelenggara?: string | null;
  kontak?: string | null;
  thumbnail?: string | null;
  images?: string[] | null;
  batas_pendaftaran?: string | null;
  link_pendaftaran?: string | null;
  is_published: boolean;
  status: StatusTurnamen;
  peserta_count_relation?: number;
  created_at: string;
  updated_at: string;
}

export interface PesertaTurnamen {
  id: number;
  turnamen_id: number;
  user_id?: string | null;
  nama_peserta: string;
  nama_tim?: string | null;
  no_telp?: string | null;
  email?: string | null;
  status: "terdaftar" | "terverifikasi" | "didiskualifikasi";
  user?: User;
  created_at: string;
}

export interface TurnamenFilters extends PaginationParams {
  cabang?: string;
  status?: StatusTurnamen;
  upcoming?: boolean;
  search?: string;
}

// ============================================================
// PELAKU EKRAF
// ============================================================
export type SkalaUsaha = "mikro" | "kecil" | "menengah" | "besar";
export type StatusPelakuEkraf = "draft" | "pending" | "terverifikasi" | "ditolak";

export interface PelakuEkraf {
  id: number;
  user_id?: string | null;
  nama: string;
  slug: string;
  nik?: string | null;
  nama_usaha?: string | null;
  subsektor_id?: number | null;
  deskripsi_usaha?: string | null;
  alamat?: string | null;
  kelurahan?: string | null;
  kecamatan?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  no_telp?: string | null;
  email?: string | null;
  website?: string | null;
  sosial_media?: Record<string, string> | null;
  foto?: string | null;
  logo_usaha?: string | null;
  tahun_mulai?: number | null;
  jumlah_karyawan?: number | null;
  skala_usaha: SkalaUsaha;
  omzet_tahunan?: number | null;
  status: StatusPelakuEkraf;
  verified_by?: string | null;
  verified_at?: string | null;
  catatan_verifikasi?: string | null;
  user?: User;
  subsektor?: Subsektor;
  verifier?: User;
  created_at: string;
  updated_at: string;
}

export interface PelakuEkrafFilters extends PaginationParams {
  subsektor_id?: number;
  status?: StatusPelakuEkraf;
  skala_usaha?: SkalaUsaha;
  search?: string;
}

// ============================================================
// HAKI
// ============================================================
export type JenisHaki = "merek" | "paten" | "hak_cipta" | "desain_industri" | "indikasi_geografis";
export type StatusHaki = "draft" | "diajukan" | "proses" | "terdaftar" | "ditolak";

export interface Haki {
  id: number;
  user_id?: string | null;
  pelaku_ekraf_id?: number | null;
  nama_produk: string;
  slug: string;
  jenis_haki: JenisHaki;
  nomor_permohonan?: string | null;
  nomor_sertifikat?: string | null;
  tanggal_permohonan?: string | null;
  tanggal_terbit?: string | null;
  file_sertifikat?: string | null;
  file_permohonan?: string | null;
  deskripsi?: string | null;
  status: StatusHaki;
  catatan?: string | null;
  user?: User;
  pelaku_ekraf?: PelakuEkraf;
  created_at: string;
  updated_at: string;
}

export interface HakiFilters extends PaginationParams {
  jenis_haki?: JenisHaki;
  status?: StatusHaki;
  search?: string;
}

// ============================================================
// PENGADUAN
// ============================================================
export type KategoriPengaduan = "fasilitas" | "pelayanan" | "saran" | "lainnya";
export type StatusPengaduan = "baru" | "diproses" | "ditanggapi" | "selesai" | "ditolak";

export interface Pengaduan {
  id: number;
  kode_pengaduan: string;
  user_id?: string | null;
  nama_pelapor: string;
  email_pelapor?: string | null;
  no_telp_pelapor?: string | null;
  kategori: KategoriPengaduan;
  judul: string;
  deskripsi: string;
  lokasi?: string | null;
  foto_lampiran?: string[] | null;
  status: StatusPengaduan;
  tanggapan?: string | null;
  ditanggapi_oleh?: string | null;
  ditanggapi_at?: string | null;
  user?: User;
  penanggap?: User;
  created_at: string;
  updated_at: string;
}

export interface PengaduanPayload {
  nama_pelapor: string;
  email_pelapor?: string;
  no_telp_pelapor?: string;
  kategori: KategoriPengaduan;
  judul: string;
  deskripsi: string;
  lokasi?: string;
  foto_lampiran?: string[];
}

export interface PengaduanFilters extends PaginationParams {
  status?: StatusPengaduan;
  kategori?: KategoriPengaduan;
  search?: string;
}
