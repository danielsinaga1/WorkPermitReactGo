import React from 'react';
import { Tag } from 'primereact/tag';
import { CardProfilPimpinan } from '../../../components/profilcomponents/profilpimpinancomponents/CardProfilPimpinan';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import profilpimpinandata from './profilPimpinan.json';
import '../../profil-ppid.css';

type Leader = {
  img: string;
  name: string;
  role: string;
};

type ProfilPimpinanJSON = {
  pimpinan: Leader[];
  sekretariat: Leader[];
  deputi: Leader[];
  stafAhli: Leader[];
  inspektorat: Leader[];
};

const sectionConfig = [
  { key: 'pimpinan', label: 'Pimpinan', icon: 'pi pi-crown', desc: 'Dinas DISPOPAR Bontang dipimpin oleh seorang Menteri dan dibantu seorang Wakil Menteri.' },
  { key: 'sekretariat', label: 'Sekretariat', icon: 'pi pi-building', desc: 'Sekretariat bertanggung jawab atas administrasi dan koordinasi internal lembaga.' },
  { key: 'deputi', label: 'Deputi', icon: 'pi pi-users', desc: 'Para Deputi memimpin bidang-bidang strategis dalam pengembangan ekonomi kreatif.' },
  { key: 'stafAhli', label: 'Staf Ahli', icon: 'pi pi-star', desc: 'Staf Ahli memberikan masukan dan rekomendasi kebijakan kepada pimpinan.' },
  { key: 'inspektorat', label: 'Inspektorat', icon: 'pi pi-shield', desc: 'Inspektorat bertanggung jawab atas pengawasan dan audit internal.' },
] as const;

const ProfilPimpinan: React.FC = () => {
  const data = profilpimpinandata as ProfilPimpinanJSON;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Profil Pimpinan"
        subtitle="Profil Pimpinan Dinas DISPOPAR Bontang"
        icon="pi pi-users"
        tag="PIMPINAN"
        breadcrumbItems={[
          { label: 'Profil', url: '/profil' },
          { label: 'Profil Pimpinan' },
        ]}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        {sectionConfig.map((section) => {
          const leaders = data[section.key];
          if (!leaders || leaders.length === 0) return null;
          return (
            <section key={section.key} style={{ marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i className={section.icon} style={{ fontSize: '1.1rem', color: '#fff' }} />
                </div>
                <div>
                  <Tag
                    value={section.label.toUpperCase()}
                    style={{
                      background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                      color: '#6366f1',
                      fontSize: '0.65rem',
                      padding: '3px 10px',
                      borderRadius: 6,
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e293b', margin: '6px 0 0' }}>
                    {section.label}
                  </h2>
                </div>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 24, marginLeft: 58 }}>
                {section.desc}
              </p>
              <hr className="pp-divider" style={{ margin: '0 0 24px' }} />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 24,
                  justifyItems: 'center',
                }}
              >
                {leaders.map((p, idx) => (
                  <div key={idx} style={{ width: '100%', maxWidth: 280 }}>
                    <CardProfilPimpinan {...p} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilPimpinan;
