import React from 'react';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const regulasiItems = [
  { title: 'UU No. 14 Tahun 2008', desc: 'Undang-Undang tentang Keterbukaan Informasi Publik.', type: 'UU' },
  { title: 'PP No. 61 Tahun 2010', desc: 'Peraturan Pemerintah tentang Pelaksanaan UU Keterbukaan Informasi Publik.', type: 'PP' },
  { title: 'Perki No. 1 Tahun 2010', desc: 'Peraturan Komisi Informasi tentang Standar Layanan Informasi Publik.', type: 'PERKI' },
  { title: 'Permenpan RB No. 35 Tahun 2012', desc: 'Pedoman Penyusunan Standar Operasional Prosedur Administrasi Pemerintahan.', type: 'PERMEN' },
];

const RegulasiPPID: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Regulasi PPID"
        subtitle="Dasar Hukum dan Regulasi Pengelolaan Informasi Publik"
        icon="pi pi-book"
        tag="REGULASI"
        breadcrumbItems={[
          { label: 'PPID', url: '/ppid' },
          { label: 'Regulasi' },
        ]}
      />

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 className="pp-section-title" style={{ fontSize: '1.35rem', color: '#1e293b' }}>
            Dasar Hukum
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: 600, margin: '16px auto 0', lineHeight: 1.6 }}>
            Regulasi yang menjadi landasan pelayanan informasi publik di lingkungan DISPOPAR Bontang.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {regulasiItems.map((item, i) => (
            <div key={i} className="pp-regulasi-card">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <i className="pi pi-file-pdf" style={{ fontSize: '1.2rem', color: '#6366f1' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Tag
                    value={item.type}
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                      color: '#fff',
                      fontSize: '0.6rem',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  />
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: '4px 0' }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
              <Button
                icon="pi pi-download"
                rounded
                text
                severity="secondary"
                style={{ flexShrink: 0 }}
                tooltip="Unduh dokumen"
                tooltipOptions={{ position: 'left' }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RegulasiPPID;
