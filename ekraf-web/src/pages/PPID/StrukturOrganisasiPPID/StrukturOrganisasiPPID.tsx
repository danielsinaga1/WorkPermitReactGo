import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const StrukturOrganisasiPPID: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Struktur Organisasi PPID"
        subtitle="Struktur Organisasi Pejabat Pengelola Informasi dan Dokumentasi"
        icon="pi pi-sitemap"
        tag="STRUKTUR PPID"
        breadcrumbItems={[
          { label: 'PPID', url: '/ppid' },
          { label: 'Struktur Organisasi' },
        ]}
      />

      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        <div className="pp-placeholder">
          <div className="placeholder-icon">
            <i className="pi pi-sitemap" style={{ fontSize: '2rem', color: '#6366f1' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Struktur Organisasi Segera Hadir
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: 500, lineHeight: 1.6 }}>
            Bagan struktur organisasi PPID Dinas DISPOPAR Bontang sedang dalam proses penyusunan
            dan akan segera ditampilkan di halaman ini.
          </p>
          <Tag
            value="DALAM PENGEMBANGAN"
            style={{
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              color: '#92400e',
              fontSize: '0.7rem',
              padding: '5px 14px',
              borderRadius: 20,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default StrukturOrganisasiPPID;
