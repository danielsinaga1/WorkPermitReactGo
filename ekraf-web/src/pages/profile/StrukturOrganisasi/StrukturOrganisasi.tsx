import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const StrukturOrganisasi: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Struktur Organisasi"
        subtitle="Struktur Organisasi Dinas DISPOPAR Bontang"
        icon="pi pi-sitemap"
        tag="ORGANISASI"
        breadcrumbItems={[
          { label: 'Profil', url: '/profil' },
          { label: 'Struktur Organisasi' },
        ]}
      />

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Tag
            value="BAGAN ORGANISASI"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff',
              fontSize: '0.68rem',
              padding: '4px 14px',
              borderRadius: 20,
              letterSpacing: 1,
              fontWeight: 700,
              marginBottom: 12,
            }}
          />
          <h2 className="pp-section-title" style={{ fontSize: '1.5rem', color: '#1e293b', marginTop: 12 }}>
            Hierarki & Struktur Jabatan
          </h2>
          <p style={{ color: '#64748b', maxWidth: 600, margin: '16px auto 0', lineHeight: 1.6, fontSize: '0.9rem' }}>
            Berikut adalah bagan struktur organisasi Dinas DISPOPAR Kota Bontang yang menunjukkan
            hierarki jabatan dan alur koordinasi antar unit kerja.
          </p>
        </div>

        <Card
          style={{
            borderRadius: 20,
            border: '1px solid rgba(0,0,0,.06)',
            boxShadow: '0 8px 32px rgba(0,0,0,.06)',
            overflow: 'hidden',
            padding: 0,
          }}
        >
          <div style={{ position: 'relative', background: '#fff', padding: 24 }}>
            <img
              src="https://media.istockphoto.com/id/1434499785/id/vektor/bagan-organisasi-perusahaan-dengan-ikon-avatar-bisnis-elemen-infografis-hierarki-bisnis.jpg?s=2048x2048&w=is&k=20&c=qlrnxu_sjN_qOnJf1ECMjx2e-B3i0BHJ13hpnu9SPBg="
              alt="Struktur Organisasi"
              style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 12 }}
            />
          </div>
        </Card>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,.06)', fontSize: '0.82rem', color: '#64748b' }}>
            <i className="pi pi-info-circle" style={{ color: '#6366f1' }} />
            Klik gambar untuk memperbesar
          </div>
        </div>
      </section>
    </div>
  );
};

export default StrukturOrganisasi;
