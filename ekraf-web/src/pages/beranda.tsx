import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { Ripple } from 'primereact/ripple';
import { AnnouncementCard } from '../components/berandacomponents/AnnouncementCard';
import { BannerSlider } from '../components/berandacomponents/BannerSlider';
import { NewsCard } from '../components/berandacomponents/NewsCard';
import { NewsletterCard } from '../components/berandacomponents/NewsletterCard';
import { SubsektorItem } from '../components/berandacomponents/SubsektorItem';
import { PromosiCard } from '../components/berandacomponents/PromosiCard';
import newsletterData from '../pages/publikasi/Newsletter/newsletter.json';
import newsData from '../pages/berita/Berita/berita.json';
import announcementData from '../pages/berita/Pengumuman/pengumuman.json';
import promosiData from '../pages/berita/promosi/promosi.json';

import './beranda.css';

import aplikasiImage from '../assets/sektor-ekraf/aplikasi.jpg';
import penerbitanImage from '../assets/sektor-ekraf/penerbitan.jpg';
import gameImage from '../assets/sektor-ekraf/game-development.jpg';
import arsitekturImage from '../assets/sektor-ekraf/arsitektur.jpg';
import desainInteriorImage from '../assets/sektor-ekraf/desain-interior.jpg';
import musikImage from '../assets/sektor-ekraf/musik.jpg';
import seniRupaImage from '../assets/sektor-ekraf/seni-rupa.jpg';
import desainProdukImage from '../assets/sektor-ekraf/desain-produk.jpg';
import fashionImage from '../assets/sektor-ekraf/fashion.jpg';
import kulinerImage from '../assets/sektor-ekraf/kuliner.jpg';
import filmImage from '../assets/sektor-ekraf/film.jpg';
import fotografiImage from '../assets/sektor-ekraf/fotografi.jpg';
import kriyaImage from '../assets/sektor-ekraf/kriya.jpg';
import tvDanRadioImage from '../assets/sektor-ekraf/tv-radio.jpg';
import periklananImage from '../assets/sektor-ekraf/periklanan.jpg';
import seniPertunjukanImage from '../assets/sektor-ekraf/seni-pertunjukan.jpg';
import desainKomunikasiVisualImage from '../assets/sektor-ekraf/dkv.jpg';

interface Subsektor {
  id: number;
  name: string;
  image: string;
}

const subsektorList: Subsektor[] = [
  { id: 1, name: 'Aplikasi', image: aplikasiImage },
  { id: 2, name: 'Penerbitan', image: penerbitanImage },
  { id: 3, name: 'Seni Pertunjukan', image: seniPertunjukanImage },
  { id: 4, name: 'Periklanan', image: periklananImage },
  { id: 5, name: 'Arsitektur', image: arsitekturImage },
  { id: 6, name: 'TV & Radio', image: tvDanRadioImage },
  { id: 7, name: 'Desain Komunikasi Visual', image: desainKomunikasiVisualImage },
  { id: 8, name: 'Fotografi', image: fotografiImage },
  { id: 9, name: 'Film, Animasi & Video', image: filmImage },
  { id: 10, name: 'Kuliner', image: kulinerImage },
  { id: 11, name: 'Fashion', image: fashionImage },
  { id: 12, name: 'Desain Produk', image: desainProdukImage },
  { id: 13, name: 'Seni Rupa', image: seniRupaImage },
  { id: 14, name: 'Musik', image: musikImage },
  { id: 15, name: 'Desain Interior', image: desainInteriorImage },
  { id: 16, name: 'Kriya', image: kriyaImage },
  { id: 17, name: 'Game', image: gameImage },
];

const STATS = [
  { label: 'Pelaku Ekraf', value: '3,475', icon: 'pi pi-users', color: '#3B82F6', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
  { label: 'Subsektor Aktif', value: '17', icon: 'pi pi-th-large', color: '#10B981', bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' },
  { label: 'Event Tahunan', value: '156', icon: 'pi pi-calendar', color: '#F59E0B', bg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' },
  { label: 'Produk UMKM', value: '2,840', icon: 'pi pi-shopping-bag', color: '#6366F1', bg: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)' },
];

const QUICK_LINKS = [
  { label: 'Berita Terbaru', icon: 'pi pi-file', path: '/news' },
  { label: 'Pengumuman', icon: 'pi pi-megaphone', path: '/announcement' },
  { label: 'Newsletter', icon: 'pi pi-envelope', path: '/publisher/newsletter' },
  { label: 'Produk Hukum', icon: 'pi pi-book', path: '/produk-hukum/undang-undang' },
  { label: 'PPID', icon: 'pi pi-info-circle', path: '/ppid/tentang-ppid' },
  { label: 'Statistik', icon: 'pi pi-chart-line', path: '/stat/potensi-ekonomi-kreatif-indonesia' },
];

const Beranda: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* ===== HERO BANNER ===== */}
      <section className="beranda-section" style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 0' }}>
        <BannerSlider />
      </section>

      {/* ===== QUICK LINKS BAR ===== */}
      <section className="beranda-section" style={{ maxWidth: 1200, margin: '20px auto 0', padding: '0 24px' }}>
        <div className="quick-links-bar">
          <i className="pi pi-bolt" style={{ color: '#fbbf24', fontSize: '1.1rem', flexShrink: 0 }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600, flexShrink: 0 }}>Akses Cepat:</span>
          {QUICK_LINKS.map((link) => (
            <Chip
              key={link.label}
              label={link.label}
              icon={link.icon}
              className="quick-link-chip"
              onClick={() => navigate(link.path)}
            />
          ))}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="beranda-section" style={{ maxWidth: 1200, margin: '24px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {STATS.map((s) => (
            <Card
              key={s.label}
              className="stat-card p-ripple"
              style={{ '--stat-color': s.color, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' } as React.CSSProperties}
            >
              <Ripple />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: s.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i className={s.icon} style={{ fontSize: '1.4rem', color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e1b4b', lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== BERITA & PENGUMUMAN ===== */}
      <section className="beranda-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
          {/* Berita */}
          <div style={{ flex: '2 1 500px' }}>
            <div className="section-header" style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Tag value="TERBARU" severity="info" style={{ fontSize: '0.65rem', padding: '2px 8px' }} />
              </div>
              <h2>Berita Ekonomi Kreatif</h2>
              <p>Informasi terbaru seputar ekonomi kreatif dan pariwisata Kota Bontang</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {newsData.slice(0, 2).map((item: any) => (
                <NewsCard key={item.id} {...item} />
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Button
                label="Lihat Semua Berita"
                icon="pi pi-arrow-right"
                iconPos="right"
                outlined
                className="view-more-btn"
                onClick={() => navigate('/news')}
              />
            </div>
          </div>

          {/* Pengumuman */}
          <div style={{ flex: '1 1 300px' }}>
            <div className="section-header" style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Tag value="RESMI" severity="warning" style={{ fontSize: '0.65rem', padding: '2px 8px' }} />
              </div>
              <h2>Pengumuman</h2>
              <p>Info penting & pengumuman resmi</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {announcementData.slice(0, 4).map((item: any) => (
                <AnnouncementCard key={item.id} {...item} />
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Button
                label="Lihat Semua Pengumuman"
                icon="pi pi-arrow-right"
                iconPos="right"
                outlined
                className="view-more-btn"
                onClick={() => navigate('/announcement')}
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="beranda-divider" />

      {/* ===== SUBSEKTOR ===== */}
      <section className="beranda-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="section-header center" style={{ textAlign: 'center', marginBottom: 40 }}>
          <Tag value="EKOSISTEM KREATIF" severity="success" style={{ fontSize: '0.65rem', padding: '2px 10px', marginBottom: 10 }} />
          <h2>{subsektorList.length} Subsektor Ekonomi Kreatif</h2>
          <p>Beragam sektor kreatif yang dikembangkan di Kota Bontang</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 16,
          maxWidth: 1000,
          margin: '0 auto',
        }}>
          {subsektorList.map((item) => (
            <SubsektorItem key={item.id} {...item} />
          ))}
        </div>
      </section>

      <hr className="beranda-divider" />

      {/* ===== NEWSLETTER ===== */}
      <section className="beranda-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="section-header" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Tag value="PUBLIKASI" style={{ fontSize: '0.65rem', padding: '2px 8px', background: '#6366f1' }} />
          </div>
          <h2>Newsletter</h2>
          <p>Informasi berkala dari DISPOPAR Kota Bontang</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {newsletterData.slice(0, 4).map((item: any) => (
            <NewsletterCard key={item.id} {...item} />
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <Button
            label="Lihat Semua Newsletter"
            icon="pi pi-arrow-right"
            iconPos="right"
            outlined
            className="view-more-btn"
            onClick={() => navigate('/publisher/newsletter')}
          />
        </div>
      </section>

      <hr className="beranda-divider" />

      {/* ===== PROMOSI ===== */}
      <section className="beranda-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="section-header" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Tag value="PROMO" severity="danger" style={{ fontSize: '0.65rem', padding: '2px 8px' }} />
          </div>
          <h2>Promosi</h2>
          <p>Program promosi dan penawaran menarik untuk pelaku ekonomi kreatif</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
          {promosiData.slice(0, 3).map((item: any) => (
            <PromosiCard key={item.id} {...item} />
          ))}
        </div>
        <div style={{ marginTop: 28 }}>
          <Button
            label="Lihat Semua Promosi"
            icon="pi pi-arrow-right"
            iconPos="right"
            outlined
            className="view-more-btn"
            onClick={() => navigate('/promosi')}
          />
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="beranda-section" style={{ maxWidth: 1200, margin: '56px auto 0', padding: '0 24px 64px' }}>
        <div className="cta-section">
          {/* Decorative dots */}
          <div className="dots-pattern" style={{ top: 20, right: 40, opacity: 0.5 }} />
          <div className="dots-pattern" style={{ bottom: 20, left: 40, opacity: 0.3 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Tag
              value="BERGABUNG SEKARANG"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '4px 14px',
                marginBottom: 20,
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
            <h2 style={{
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 800,
              margin: '16px 0 16px',
              letterSpacing: '-0.02em',
            }}>
              Bergabung dengan Ekonomi Kreatif Bontang
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '1.05rem',
              margin: '0 auto 36px',
              maxWidth: 560,
              lineHeight: 1.7,
            }}>
              Daftarkan usaha kreatif Anda dan jadilah bagian dari ekosistem ekonomi kreatif Kota Bontang yang berkembang pesat.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                label="Daftar Sekarang"
                icon="pi pi-arrow-right"
                iconPos="right"
                rounded
                onClick={() => navigate('/login')}
                style={{
                  background: '#fff',
                  color: '#4338ca',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '14px 36px',
                }}
              />
              <Button
                label="Pelajari Lebih Lanjut"
                icon="pi pi-info-circle"
                rounded
                outlined
                onClick={() => navigate('/profil/lembaga')}
                style={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '14px 36px',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Beranda;
