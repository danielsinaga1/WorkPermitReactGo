import React from 'react';
import { Tag } from 'primereact/tag';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const misi = [
  'Menjamin keterbukaan informasi publik sesuai peraturan perundang-undangan.',
  'Meningkatkan kualitas pelayanan informasi yang cepat, mudah, dan akurat.',
  'Mengembangkan sistem informasi dan dokumentasi yang terintegrasi.',
  'Meningkatkan partisipasi masyarakat dalam pengawasan penyelenggaraan pemerintahan.',
];

const VisiMisiPPID: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Visi & Misi PPID"
        subtitle="Visi dan Misi Pejabat Pengelola Informasi dan Dokumentasi"
        icon="pi pi-compass"
        tag="VISI & MISI"
        breadcrumbItems={[
          { label: 'PPID', url: '/ppid' },
          { label: 'Visi & Misi' },
        ]}
      />

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        {/* Visi */}
        <div className="pp-info-box" style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Tag
              value="VISI"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '0.65rem',
                padding: '4px 14px',
                borderRadius: 20,
                letterSpacing: 1.5,
                fontWeight: 700,
                border: '1px solid rgba(255,255,255,.2)',
              }}
            />
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginTop: 16, lineHeight: 1.4 }}>
              Mewujudkan Pelayanan Informasi Publik yang Transparan, Akuntabel, dan Profesional
              di Lingkungan Dinas DISPOPAR Bontang
            </h2>
          </div>
        </div>

        {/* Misi */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Tag
            value="MISI"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff',
              fontSize: '0.65rem',
              padding: '4px 14px',
              borderRadius: 20,
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 12,
            }}
          />
          <h2 className="pp-section-title" style={{ fontSize: '1.35rem', color: '#1e293b', marginTop: 12 }}>
            Misi PPID DISPOPAR Bontang
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {misi.map((item, i) => (
            <div key={i} className="pp-commitment-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div className="commitment-number">{i + 1}</div>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VisiMisiPPID;
