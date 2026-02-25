import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const DataKepegawaian: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Data Kepegawaian"
        subtitle="Seputar Informasi Data Kepegawaian Dinas DISPOPAR Bontang"
        icon="pi pi-id-card"
        tag="KEPEGAWAIAN"
        breadcrumbItems={[
          { label: 'Profil', url: '/profil' },
          { label: 'Data Kepegawaian' },
        ]}
      />

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }} className="pp-page-content">
        {/* Search */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <span className="p-input-icon-left" style={{ width: '100%', maxWidth: 500 }}>
            <i className="pi pi-search" />
            <InputText
              placeholder="Cari data kepegawaian..."
              style={{
                width: '100%',
                borderRadius: 12,
                padding: '12px 16px 12px 44px',
                border: '1px solid rgba(0,0,0,.1)',
                fontSize: '0.9rem',
              }}
            />
          </span>
        </div>

        {/* Placeholder content */}
        <div className="pp-placeholder">
          <div className="placeholder-icon">
            <i className="pi pi-id-card" style={{ fontSize: '2rem', color: '#6366f1' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Data Kepegawaian Segera Hadir
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: 500, lineHeight: 1.6 }}>
            Halaman ini sedang dalam proses pengembangan. Data kepegawaian Dinas DISPOPAR Bontang
            akan segera tersedia untuk publik.
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

export default DataKepegawaian;
