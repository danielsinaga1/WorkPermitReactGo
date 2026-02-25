import { useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import Logo1 from '../../assets/logoekraf.png';
import type { MenuItem } from 'primereact/menuitem';

export const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items: MenuItem[] = [
    { label: 'Beranda', icon: 'pi pi-home', command: () => navigate('/') },
    {
      label: 'Berita',
      icon: 'pi pi-file',
      items: [
        { label: 'Berita', icon: 'pi pi-file', command: () => navigate('/news') },
        { label: 'Pengumuman', icon: 'pi pi-megaphone', command: () => navigate('/announcement') },
        { label: 'Ragam DISPOPAR', icon: 'pi pi-palette', command: () => navigate('/ragam-ekraf') },
        { label: 'Promosi', icon: 'pi pi-tags', command: () => navigate('/promosi') },
      ],
    },
    {
      label: 'Profil',
      icon: 'pi pi-building',
      items: [
        { label: 'Profil Lembaga', icon: 'pi pi-building', command: () => navigate('/profil/lembaga') },
        { label: 'Struktur Organisasi', icon: 'pi pi-sitemap', command: () => navigate('/profil/struktur-organisasi') },
        { label: 'Profil Pimpinan', icon: 'pi pi-user', command: () => navigate('/profil/profil-pimpinan') },
        { label: 'Agenda Kegiatan Pimpinan', icon: 'pi pi-calendar', command: () => navigate('/profil/agenda-kegiatan-pimpinan') },
        { label: 'Data Kepegawaian', icon: 'pi pi-users', command: () => navigate('/profil/data-kepegawaian') },
        { label: 'Realisasi Anggaran', icon: 'pi pi-chart-bar', command: () => navigate('/profil/realisasi-anggaran') },
        { label: 'e-Announcement LHKPN', icon: 'pi pi-file-pdf', command: () => navigate('/profil/wamen') },
      ],
    },
    {
      label: 'Publikasi',
      icon: 'pi pi-book',
      items: [
        { label: 'Newsletter', icon: 'pi pi-envelope', command: () => navigate('/publisher/newsletter') },
        { label: 'Publikasi Digital', icon: 'pi pi-globe', command: () => navigate('/publisher/digital') },
        { label: 'Pustaka', icon: 'pi pi-bookmark', command: () => navigate('/publisher/pustaka') },
        { label: 'Tenaga Kerja', icon: 'pi pi-briefcase', command: () => navigate('/publisher/tenaga-kerja') },
      ],
    },
    {
      label: 'Statistik',
      icon: 'pi pi-chart-line',
      items: [
        { label: 'Potensi Ekonomi Kreatif', icon: 'pi pi-chart-line', command: () => navigate('/stat/potensi-ekonomi-kreatif-indonesia') },
      ],
    },
    {
      label: 'Reformasi Birokrasi',
      icon: 'pi pi-shield',
      items: [
        { label: 'Profil Reformasi Birokrasi', icon: 'pi pi-shield', command: () => navigate('/profil-reformasi-birokrasi') },
      ],
    },
    {
      label: 'Produk Hukum',
      icon: 'pi pi-book',
      items: [
        { label: 'Undang-Undang', icon: 'pi pi-file', command: () => navigate('/produk-hukum/undang-undang') },
        { label: 'Peraturan Pemerintah', icon: 'pi pi-file', command: () => navigate('/produk-hukum/peraturan-pemerintah') },
        { label: 'Peraturan Presiden', icon: 'pi pi-file', command: () => navigate('/produk-hukum/peraturan-presiden') },
        { label: 'Peraturan Menteri', icon: 'pi pi-file', command: () => navigate('/produk-hukum/peraturan-mentri') },
        { label: 'Naskah Kerja Sama', icon: 'pi pi-file', command: () => navigate('/produk-hukum/naskah-kerja-sama') },
        { label: 'Rancangan Produk Hukum', icon: 'pi pi-file', command: () => navigate('/produk-hukum/rancangan-produk-hukum') },
        { label: 'Produk Hukum Lainnya', icon: 'pi pi-file', command: () => navigate('/produk-hukum/produk-hukum-lainnya') },
      ],
    },
    {
      label: 'PPID',
      icon: 'pi pi-info-circle',
      items: [
        { label: 'Tentang PPID', icon: 'pi pi-info-circle', command: () => navigate('/ppid/tentang-ppid') },
        { label: 'Profil PPID', icon: 'pi pi-user', command: () => navigate('/ppid/profil-ppid') },
        { label: 'Tugas & Fungsi', icon: 'pi pi-list', command: () => navigate('/ppid/tugas-fungsi-ppid') },
        { label: 'Struktur Organisasi', icon: 'pi pi-sitemap', command: () => navigate('/ppid/struktur-organisasi-ppid') },
        { label: 'Visi & Misi', icon: 'pi pi-flag', command: () => navigate('/ppid/visi-dan-misi-ppid') },
        { label: 'Regulasi PPID', icon: 'pi pi-book', command: () => navigate('/ppid/regulasi-ppid') },
        { label: 'Jam Pelayanan', icon: 'pi pi-clock', command: () => navigate('/ppid/jam-pelayanan-ppid') },
        { label: 'Formulir PPID', icon: 'pi pi-file-edit', command: () => navigate('/ppid/formulir-ppid') },
      ],
    },
    { label: 'Hubungi', icon: 'pi pi-phone', command: () => navigate('/hubungi') },
  ];

  const start = (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginRight: 20 }}
      onClick={() => navigate('/')}
    >
      <img src={Logo1} alt="DISPOPAR" style={{ height: 38 }} />
      <div>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e1b4b', lineHeight: 1.2, letterSpacing: 0.5 }}>DISPOPAR</div>
        <div style={{ fontSize: '0.65rem', color: '#6b7280', lineHeight: 1.2 }}>Kota Bontang</div>
      </div>
    </div>
  );

  const end = (
    <Button
      label="Dashboard"
      icon="pi pi-th-large"
      onClick={() => navigate('/login')}
      rounded
      style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)', border: 'none', fontSize: '0.85rem', padding: '8px 20px' }}
    />
  );

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
        background: isScrolled ? 'rgba(255,255,255,0.92)' : '#ffffff',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>
        <Menubar
          model={items}
          start={start}
          end={end}
          style={{ border: 'none', background: 'transparent', padding: '6px 0', borderRadius: 0 }}
        />
      </div>
    </div>
  );
};
