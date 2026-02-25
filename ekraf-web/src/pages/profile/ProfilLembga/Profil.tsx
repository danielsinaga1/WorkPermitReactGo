import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const fungsiUtama = [
  { icon: 'pi pi-file-edit', text: 'Perumusan dan penetapan kebijakan di bidang ekonomi kreatif.' },
  { icon: 'pi pi-sync', text: 'Koordinasi dan sinkronisasi pelaksanaan kebijakan di bidang ekonomi kreatif.' },
  { icon: 'pi pi-users', text: 'Koordinasi pelaksanaan tugas, pembinaan, dan dukungan administrasi.' },
  { icon: 'pi pi-box', text: 'Pengelolaan barang milik/kekayaan negara.' },
  { icon: 'pi pi-eye', text: 'Pengawasan pelaksanaan tugas di lingkungan Kementerian.' },
  { icon: 'pi pi-star', text: 'Pelaksanaan fungsi lain yang diberikan oleh Presiden.' },
];

const tugasTambahan = [
  { icon: 'pi pi-clipboard', text: 'Perumusan dan penetapan kebijakan tambahan di bidang ekonomi kreatif.' },
  { icon: 'pi pi-sitemap', text: 'Koordinasi lintas sektor dalam mendukung ekonomi kreatif.' },
  { icon: 'pi pi-briefcase', text: 'Pembinaan dan dukungan administrasi tingkat lanjut.' },
  { icon: 'pi pi-database', text: 'Pengelolaan aset dan kekayaan negara secara inovatif.' },
  { icon: 'pi pi-shield', text: 'Pengawasan ketat atas pelaksanaan program.' },
  { icon: 'pi pi-bolt', text: 'Fungsi lain yang diberikan oleh Presiden sesuai kebutuhan.' },
];

const Profil: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Profil Lembaga"
        subtitle="Profil Dinas DISPOPAR Bontang"
        icon="pi pi-building"
        tag="PROFIL"
        breadcrumbItems={[
          { label: 'Profil', url: '/profil' },
          { label: 'Profil Lembaga' },
        ]}
      />

      {/* Intro section */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 0', textAlign: 'center' }} className="pp-page-content">
        <Tag
          value="DISPOPAR BONTANG"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            color: '#fff',
            fontSize: '0.7rem',
            padding: '4px 14px',
            borderRadius: 20,
            letterSpacing: 1,
            fontWeight: 700,
            marginBottom: 16,
          }}
        />
        <h2 className="pp-section-title" style={{ fontSize: '1.75rem', color: '#1e293b', marginTop: 12 }}>
          Profil Dinas DISPOPAR Bontang
        </h2>
        <p style={{ color: '#64748b', maxWidth: 700, margin: '16px auto 0', lineHeight: 1.7, fontSize: '0.95rem' }}>
          Dinas DISPOPAR Bontang merupakan lembaga yang berperan penting dalam mengembangkan potensi
          ekonomi kreatif daerah, memperkuat daya saing, serta mendukung kontribusi sektor kreatif
          terhadap perekonomian Indonesia.
        </p>
      </section>

      {/* Description card */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }} className="pp-page-content">
        <Card style={{ borderRadius: 16, border: '1px solid rgba(0,0,0,.06)', boxShadow: '0 4px 20px rgba(0,0,0,.04)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: '#475569', lineHeight: 1.8 }}>
            <p>
              <span style={{ fontWeight: 600, color: '#6366f1' }}>Dinas DISPOPAR Bontang</span>{' '}
              dibentuk berdasarkan Peraturan Presiden Nomor 199 Tahun 2024 tentang Kementerian Ekonomi
              Kreatif, dan Peraturan Presiden Nomor 200 Tahun 2024 tentang Badan Ekonomi Kreatif.
            </p>
            <p>
              <span style={{ fontWeight: 600, color: '#6366f1' }}>Dinas DISPOPAR Bontang</span>{' '}
              adalah kementerian yang menyelenggarakan sub-urusan pemerintahan ekonomi kreatif yang
              merupakan lingkup urusan pemerintahan di bidang pariwisata.
            </p>
            <p>
              <span style={{ fontWeight: 600, color: '#6366f1' }}>Dinas DISPOPAR Bontang</span>{' '}
              mempunyai tugas membantu Presiden dalam menyelenggarakan pemerintahan negara di bidang
              ekonomi kreatif.
            </p>
          </div>
        </Card>
      </section>

      {/* Fungsi Utama */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 24px 48px' }} className="pp-page-content">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="pp-section-title" style={{ fontSize: '1.5rem', color: '#1e293b' }}>
            Fungsi Utama Dinas DISPOPAR Bontang
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {fungsiUtama.map((item, i) => (
            <div key={i} className="pp-func-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={item.icon} style={{ fontSize: '1rem', color: '#6366f1' }} />
              </div>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Info box */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 48px' }} className="pp-page-content">
        <div className="pp-info-box">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Tag
              value="INFORMASI"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.65rem', padding: '4px 12px', borderRadius: 16, letterSpacing: 1, fontWeight: 700, marginBottom: 16, border: '1px solid rgba(255,255,255,.2)' }}
            />
            <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: 16, marginTop: 8 }}>
              Dinas DISPOPAR Bontang
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: 12 }}>
              <strong style={{ color: '#fff' }}>Dinas DISPOPAR Bontang</strong> adalah Lembaga
              Pemerintah Non Kementerian yang menyelenggarakan tugas pemerintahan di bidang ekonomi
              kreatif dan bertanggung jawab langsung kepada Presiden.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
              Dinas DISPOPAR Bontang memiliki peran penting dalam melaksanakan kebijakan, mengawasi
              pelaksanaan tugas, serta memastikan perkembangan ekonomi kreatif berjalan sesuai regulasi.
            </p>
          </div>
        </div>
      </section>

      {/* Tugas Tambahan */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }} className="pp-page-content">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="pp-section-title" style={{ fontSize: '1.5rem', color: '#1e293b' }}>
            Tugas dan Fungsi Tambahan
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {tugasTambahan.map((item, i) => (
            <div key={i} className="pp-func-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={item.icon} style={{ fontSize: '1rem', color: '#6366f1' }} />
              </div>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profil;
