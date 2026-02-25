import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Beranda from "./pages/beranda";
import Berita from "./pages/berita/Berita/Berita";
import BeritaDetail from "./pages/berita/Berita/BeritaDetail";
import Pengumuman from "./pages/berita/Pengumuman/Pengumuman";
import PengumumanDetail from "./pages/berita/Pengumuman/PengumumanDetail";
import Profil from "./pages/profile/ProfilLembga/Profil";
import Newsletter from "./pages/publikasi/Newsletter/Newsletter";
import NewsletterDetail from "./pages/publikasi/Newsletter/NewsletterDetail";
import AboutPPID from "./pages/PPID/TentangPPID/AboutPPID";
import ProfilPPID from "./pages/PPID/ProfilPPID/ProfilPPID";
import { TugasFungsiPPID } from "./pages/PPID/Tugas&FungsiPPID/TugasFungsiPPID";
import Promosi from "./pages/berita/promosi/Promosi";
import PromosiDetail from "./pages/berita/promosi/PromosiDetail";
import RagamEkraf from "./pages/berita/ragamEkraf/RagamEkraf";
import RagamEkrafDetail from "./pages/berita/ragamEkraf/RagamEkrafDetail";
import Pustaka from "./pages/publikasi/Pustaka/Pustaka";
import PustakaDetail from "./pages/publikasi/Pustaka/PustakaDetail";
import PotensiEkonomiDetail from "./pages/statistik/PotensiEkonomi.jsx/PotensiEkonomiDetail";
import PotensiEkonomi from "./pages/statistik/PotensiEkonomi.jsx/PotensiEkonomi";
import ProfilReformasiBirokrasi from "./pages/reformasiBirokrasi/Profil/ProfilReformasiBirokrasi";
import UndangUndang from "./pages/produkHukum/UndangUndang/UndangUndang";
import PeraturanPem from "./pages/produkHukum/PeraturanPemerintah/PeraturanPem";
import PeraturanPres from "./pages/produkHukum/PeraturanPresiden/PeraturanPres";
import PeraturanMentri from "./pages/produkHukum/Peraturan Mentri/PeraturanMentri";
import NaskahKerjaSama from "./pages/produkHukum/NaskahKerjaSama/NaskahKerjaSama";
import RancanganProdukHukum from "./pages/produkHukum/RancanganProdukHukum/RancanganProdukHukum";
import ProdukHukumLainnya from "./pages/produkHukum/ProdukHukumLainnya/ProdukHukumLainnya";
import StrukturOrganisasiPPID from "./pages/PPID/StrukturOrganisasiPPID/StrukturOrganisasiPPID";
import VisiMisiPPID from "./pages/PPID/VisiMisiPPID/VisiMisiPPID";
import RegulasiPPID from "./pages/PPID/RegulasiPPID/RegulasiPPID";
import FormulirPPID from "./pages/PPID/FormulirPPID/FormulirPPID";
import JamPelayananPPID from "./pages/PPID/JamPelayananPPID/JamPelayananPPID";
import TenagaKerja from "./pages/publikasi/TenagaKerja/TenagaKerja";
import TenagaKerjaDetail from "./pages/publikasi/TenagaKerja/TenagaKerjaDetail";
import { ScrollTop } from "./components/scrolltop/ScrollTop";

// Auth & Dashboard imports
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboard Sub-pages
import PelakuEkrafList from "./pages/Dashboard/pelakuEkraf/PelakuEkrafList";
import PelakuEkrafTambah from "./pages/Dashboard/pelakuEkraf/PelakuEkrafTambah";
import PelakuEkrafVerifikasi from "./pages/Dashboard/pelakuEkraf/PelakuEkrafVerifikasi";
import PelakuEkrafSubsektor from "./pages/Dashboard/pelakuEkraf/PelakuEkrafSubsektor";
import ProdukGaleri from "./pages/Dashboard/produk/ProdukGaleri";
import ProdukKatalog from "./pages/Dashboard/produk/ProdukKatalog";
import ProdukUnggulan from "./pages/Dashboard/produk/ProdukUnggulan";
import EventList from "./pages/Dashboard/event/EventList";
import EventPelatihan from "./pages/Dashboard/event/EventPelatihan";
import EventPeserta from "./pages/Dashboard/event/EventPeserta";
import BantuanModal from "./pages/Dashboard/bantuan/BantuanModal";
import BantuanAlat from "./pages/Dashboard/bantuan/BantuanAlat";
import BantuanRiwayat from "./pages/Dashboard/bantuan/BantuanRiwayat";
import HakiList from "./pages/Dashboard/haki/HakiList";
import HakiKurasi from "./pages/Dashboard/haki/HakiKurasi";
import LaporanEkspor from "./pages/Dashboard/laporan/LaporanEkspor";
import LaporanOmzet from "./pages/Dashboard/laporan/LaporanOmzet";
import LaporanTenagaKerja from "./pages/Dashboard/laporan/LaporanTenagaKerja";
import LaporanWilayah from "./pages/Dashboard/laporan/LaporanWilayah";
import CmsBerita from "./pages/Dashboard/cms/CmsBerita";
import CmsPengumuman from "./pages/Dashboard/cms/CmsPengumuman";
import CmsBanner from "./pages/Dashboard/cms/CmsBanner";
import CmsRegulasi from "./pages/Dashboard/cms/CmsRegulasi";
import CmsAgenda from "./pages/Dashboard/cms/CmsAgenda";
import SettingsUsers from "./pages/Dashboard/settings/SettingsUsers";
import SettingsRoles from "./pages/Dashboard/settings/SettingsRoles";
import SettingsWilayah from "./pages/Dashboard/settings/SettingsWilayah";
import SettingsSubsektor from "./pages/Dashboard/settings/SettingsSubsektor";
import SettingsSkalaUsaha from "./pages/Dashboard/settings/SettingsSkalaUsaha";
import SettingsGeneral from "./pages/Dashboard/settings/SettingsGeneral";
import SettingsAuditLog from "./pages/Dashboard/settings/SettingsAuditLog";
import SettingsBackup from "./pages/Dashboard/settings/SettingsBackup";

// New Feature Dashboard pages
import YouthOpportunityList from "./pages/Dashboard/youth/YouthOpportunityList";
import AtletList from "./pages/Dashboard/simpora/AtletList";
import PelatihList from "./pages/Dashboard/simpora/PelatihList";
import TurnamenList from "./pages/Dashboard/turnamen/TurnamenList";
import TurnamenPeserta from "./pages/Dashboard/turnamen/TurnamenPeserta";
import PengaduanList from "./pages/Dashboard/pengaduan/PengaduanList";

// Pariwisata — Public pages
import WisataDirectory from "./pages/wisata/WisataDirectory";
import WisataDetail from "./pages/wisata/WisataDetail";
import EventsCalendar from "./pages/events/EventsCalendar";
import TiketPurchase from "./pages/tiket/TiketPurchase";

// Pariwisata — Dashboard pages
import DestinasiList from "./pages/Dashboard/wisata/DestinasiList";
import TiketWisataList from "./pages/Dashboard/wisata/TiketWisataList";

// CMS Additional pages
import CmsPromosi from "./pages/Dashboard/cms/CmsPromosi";
import CmsRagamEkraf from "./pages/Dashboard/cms/CmsRagamEkraf";
import CmsNewsletter from "./pages/Dashboard/cms/CmsNewsletter";
import CmsPustaka from "./pages/Dashboard/cms/CmsPustaka";
import CmsTenagaKerja from "./pages/Dashboard/cms/CmsTenagaKerja";
import CmsProdukHukum from "./pages/Dashboard/cms/CmsProdukHukum";
import CmsPotensiEkonomi from "./pages/Dashboard/cms/CmsPotensiEkonomi";
import CmsPPID from "./pages/Dashboard/cms/CmsPPID";
import CmsProfilPimpinan from "./pages/Dashboard/cms/CmsProfilPimpinan";
import CmsReformasiBirokrasi from "./pages/Dashboard/cms/CmsReformasiBirokrasi";
import CmsRealisasiAnggaran from "./pages/Dashboard/cms/CmsRealisasiAnggaran";

// Layout component for public pages
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

function AppContent() {
  const location = useLocation();

  return (
    <>
      <ScrollTop />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          {/* Pelaku Ekraf */}
          <Route path="pelaku-ekraf" element={<PelakuEkrafList />} />
          <Route path="pelaku-ekraf/tambah" element={<PelakuEkrafTambah />} />
          <Route path="pelaku-ekraf/verifikasi" element={<PelakuEkrafVerifikasi />} />
          <Route path="pelaku-ekraf/subsektor" element={<PelakuEkrafSubsektor />} />
          {/* Produk & Karya */}
          <Route path="produk/galeri" element={<ProdukGaleri />} />
          <Route path="produk/katalog" element={<ProdukKatalog />} />
          <Route path="produk/unggulan" element={<ProdukUnggulan />} />
          {/* Event & Pelatihan */}
          <Route path="event" element={<EventList />} />
          <Route path="event/pelatihan" element={<EventPelatihan />} />
          <Route path="event/peserta" element={<EventPeserta />} />
          {/* Bantuan & Hibah */}
          <Route path="bantuan/modal" element={<BantuanModal />} />
          <Route path="bantuan/alat" element={<BantuanAlat />} />
          <Route path="bantuan/riwayat" element={<BantuanRiwayat />} />
          {/* HAKI & Kurasi */}
          <Route path="haki" element={<HakiList />} />
          <Route path="haki/kurasi" element={<HakiKurasi />} />
          {/* Laporan */}
          <Route path="laporan/ekspor" element={<LaporanEkspor />} />
          <Route path="laporan/omzet" element={<LaporanOmzet />} />
          <Route path="laporan/tenaga-kerja" element={<LaporanTenagaKerja />} />
          <Route path="laporan/wilayah" element={<LaporanWilayah />} />
          {/* CMS */}
          <Route path="cms/berita" element={<CmsBerita />} />
          <Route path="cms/pengumuman" element={<CmsPengumuman />} />
          <Route path="cms/banner" element={<CmsBanner />} />
          <Route path="cms/regulasi" element={<CmsRegulasi />} />
          <Route path="cms/agenda" element={<CmsAgenda />} />
          <Route path="cms/promosi" element={<CmsPromosi />} />
          <Route path="cms/ragam-ekraf" element={<CmsRagamEkraf />} />
          <Route path="cms/newsletter" element={<CmsNewsletter />} />
          <Route path="cms/pustaka" element={<CmsPustaka />} />
          <Route path="cms/tenaga-kerja" element={<CmsTenagaKerja />} />
          <Route path="cms/produk-hukum" element={<CmsProdukHukum />} />
          <Route path="cms/potensi-ekonomi" element={<CmsPotensiEkonomi />} />
          <Route path="cms/ppid" element={<CmsPPID />} />
          <Route path="cms/profil-pimpinan" element={<CmsProfilPimpinan />} />
          <Route path="cms/reformasi-birokrasi" element={<CmsReformasiBirokrasi />} />
          <Route path="cms/realisasi-anggaran" element={<CmsRealisasiAnggaran />} />
          {/* Settings */}
          <Route path="settings/users" element={<SettingsUsers />} />
          <Route path="settings/roles" element={<SettingsRoles />} />
          <Route path="settings/wilayah" element={<SettingsWilayah />} />
          <Route path="settings/subsektor" element={<SettingsSubsektor />} />
          <Route path="settings/skala-usaha" element={<SettingsSkalaUsaha />} />
          <Route path="settings/general" element={<SettingsGeneral />} />
          <Route path="settings/audit-log" element={<SettingsAuditLog />} />
          <Route path="settings/backup" element={<SettingsBackup />} />
          {/* Kepemudaan */}
          <Route path="youth-opportunity" element={<YouthOpportunityList />} />
          {/* Olahraga / Simpora */}
          <Route path="atlet" element={<AtletList />} />
          <Route path="pelatih" element={<PelatihList />} />
          <Route path="turnamen" element={<TurnamenList />} />
          <Route path="turnamen/:id/peserta" element={<TurnamenPeserta />} />
          {/* Pengaduan */}
          <Route path="pengaduan" element={<PengaduanList />} />
          {/* Pariwisata */}
          <Route path="destinasi-wisata" element={<DestinasiList />} />
          <Route path="tiket-wisata" element={<TiketWisataList />} />
        </Route>
        
        {/* Public Routes with Layout */}
        <Route path="/" element={<PublicLayout><Beranda /></PublicLayout>} />
        <Route path="/news" element={<PublicLayout><Berita /></PublicLayout>} />
        <Route path="/news/:id" element={<PublicLayout><BeritaDetail /></PublicLayout>} />
        <Route path="/announcement" element={<PublicLayout><Pengumuman /></PublicLayout>} />
        <Route path="/announcement/:id" element={<PublicLayout><PengumumanDetail /></PublicLayout>} />
        <Route path="/ragam-ekraf" element={<PublicLayout><RagamEkraf /></PublicLayout>} />
        <Route path="/ragam-ekraf/:id" element={<PublicLayout><RagamEkrafDetail /></PublicLayout>} />
        <Route path="/promosi" element={<PublicLayout><Promosi /></PublicLayout>} />
        <Route path="/promosi/:id" element={<PublicLayout><PromosiDetail /></PublicLayout>} />
        <Route path="/profil/lembaga" element={<PublicLayout><Profil /></PublicLayout>} />
        <Route path="/publisher/newsletter" element={<PublicLayout><Newsletter /></PublicLayout>} />
        <Route path="/publisher/newsletter/:id" element={<PublicLayout><NewsletterDetail /></PublicLayout>} />
        <Route path="/publisher/pustaka" element={<PublicLayout><Pustaka /></PublicLayout>} />
        <Route path="/publisher/pustaka/:id" element={<PublicLayout><PustakaDetail /></PublicLayout>} />
        <Route path="/publisher/tenaga-kerja" element={<PublicLayout><TenagaKerja /></PublicLayout>} />
        <Route path="/publisher/tenaga-kerja/:id" element={<PublicLayout><TenagaKerjaDetail /></PublicLayout>} />
        <Route path="/stat/potensi-ekonomi-kreatif-indonesia" element={<PublicLayout><PotensiEkonomi /></PublicLayout>} />
        <Route path="/stat/potensi-ekonomi-kreatif-indonesia/detail" element={<PublicLayout><PotensiEkonomiDetail /></PublicLayout>} />
        <Route path="/profil-reformasi-birokrasi" element={<PublicLayout><ProfilReformasiBirokrasi /></PublicLayout>} />
        <Route path="/produk-hukum/undang-undang" element={<PublicLayout><UndangUndang /></PublicLayout>} />
        <Route path="/produk-hukum/peraturan-pemerintah" element={<PublicLayout><PeraturanPem /></PublicLayout>} />
        <Route path="/produk-hukum/peraturan-presiden" element={<PublicLayout><PeraturanPres /></PublicLayout>} />
        <Route path="/produk-hukum/peraturan-mentri" element={<PublicLayout><PeraturanMentri /></PublicLayout>} />
        <Route path="/produk-hukum/naskah-kerja-sama" element={<PublicLayout><NaskahKerjaSama /></PublicLayout>} />
        <Route path="/produk-hukum/rancangan-produk-hukum" element={<PublicLayout><RancanganProdukHukum /></PublicLayout>} />
        <Route path="/produk-hukum/produk-hukum-lainnya" element={<PublicLayout><ProdukHukumLainnya /></PublicLayout>} />
        <Route path="/ppid/tentang-ppid" element={<PublicLayout><AboutPPID /></PublicLayout>} />
        <Route path="/ppid/profil-ppid" element={<PublicLayout><ProfilPPID /></PublicLayout>} />
        <Route path="/ppid/tugas-fungsi-ppid" element={<PublicLayout><TugasFungsiPPID /></PublicLayout>} />
        <Route path="/ppid/struktur-organisasi-ppid" element={<PublicLayout><StrukturOrganisasiPPID /></PublicLayout>} />
        <Route path="/ppid/visi-dan-misi-ppid" element={<PublicLayout><VisiMisiPPID /></PublicLayout>} />
        <Route path="/ppid/regulasi-ppid" element={<PublicLayout><RegulasiPPID /></PublicLayout>} />
        <Route path="/ppid/jam-pelayanan-ppid" element={<PublicLayout><JamPelayananPPID /></PublicLayout>} />
        <Route path="/ppid/formulir-ppid" element={<PublicLayout><FormulirPPID /></PublicLayout>} />
        {/* Pariwisata Public */}
        <Route path="/wisata" element={<PublicLayout><WisataDirectory /></PublicLayout>} />
        <Route path="/wisata/:id" element={<PublicLayout><WisataDetail /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><EventsCalendar /></PublicLayout>} />
        <Route path="/tiket" element={<PublicLayout><TiketPurchase /></PublicLayout>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
