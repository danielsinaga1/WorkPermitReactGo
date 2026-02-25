import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Tag } from 'primereact/tag';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import accordionData from './TugasFungsiPPID.json';
import '../../profil-ppid.css';

type AccordionItem = { title: string; items: string[] };

export const TugasFungsiPPID: React.FC = () => {
  const data = accordionData as unknown as AccordionItem[];

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Tugas & Fungsi PPID"
        subtitle="Dibawah ini terdapat tingkatan dan fungsi PPID yaitu Atasan PPID, PPID Tingkat 1, PPID Utama, dan Pelayanan Informasi"
        icon="pi pi-list"
        tag="TUGAS & FUNGSI"
        breadcrumbItems={[
          { label: 'PPID', url: '/ppid' },
          { label: 'Tugas & Fungsi' },
        ]}
      />

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Tag
            value="STRUKTUR PPID"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff',
              fontSize: '0.65rem',
              padding: '4px 12px',
              borderRadius: 16,
              letterSpacing: 1,
              fontWeight: 700,
              marginBottom: 12,
            }}
          />
          <h2 className="pp-section-title" style={{ fontSize: '1.35rem', color: '#1e293b', marginTop: 12 }}>
            Tugas dan Fungsi Setiap Tingkatan PPID
          </h2>
        </div>

        <Accordion multiple style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map((section, idx) => (
            <AccordionTab
              key={idx}
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>{idx + 1}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>{section.title}</span>
                </div>
              }
              pt={{
                root: { style: { borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,0,0,.06)', marginBottom: 0 } },
                content: { style: { padding: '20px 24px', background: '#f8fafc' } },
              }}
            >
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {section.items.map((item, i) => (
                  <li key={i} style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.7 }}>
                    {item}
                  </li>
                ))}
              </ol>
            </AccordionTab>
          ))}
        </Accordion>
      </section>
    </main>
  );
};
