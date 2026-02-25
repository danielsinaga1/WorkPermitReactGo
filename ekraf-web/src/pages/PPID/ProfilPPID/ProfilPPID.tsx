import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const profiles = [
  { icon: 'pi pi-user', title: 'Atasan PPID', desc: 'Bertanggung jawab atas kebijakan pelayanan informasi publik di lingkungan Kementerian.' },
  { icon: 'pi pi-users', title: 'PPID Utama', desc: 'Mengoordinasikan pengumpulan, pendokumentasian, dan penyediaan informasi publik.' },
  { icon: 'pi pi-id-card', title: 'PPID Tingkat 1', desc: 'Mengumpulkan dan menyediakan informasi publik di lingkungan Deputi.' },
  { icon: 'pi pi-inbox', title: 'Pelayanan Informasi', desc: 'Memberikan pelayanan langsung atas permintaan informasi dari masyarakat.' },
];

const ProfilPPID: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Profil PPID"
        subtitle="Profil Pejabat Pengelola Informasi dan Dokumentasi Dinas DISPOPAR Bontang"
        icon="pi pi-id-card"
        tag="PROFIL PPID"
        breadcrumbItems={[
          { label: 'PPID', url: '/ppid' },
          { label: 'Profil PPID' },
        ]}
      />

      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 className="pp-section-title" style={{ fontSize: '1.35rem', color: '#1e293b' }}>
            Struktur Pengelola Informasi
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: 600, margin: '16px auto 0', lineHeight: 1.6 }}>
            PPID DISPOPAR Bontang terdiri dari beberapa tingkatan yang saling berkoordinasi dalam pengelolaan dan pelayanan informasi publik.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {profiles.map((p, i) => (
            <div key={i} className="pp-func-card" style={{ textAlign: 'center', padding: 28 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <i className={p.icon} style={{ fontSize: '1.3rem', color: '#fff' }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>{p.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfilPPID;
