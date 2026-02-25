import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const jenisPermohonan = [
  { label: 'Permohonan Informasi', value: 'permohonan' },
  { label: 'Pengajuan Keberatan', value: 'keberatan' },
  { label: 'Pengaduan', value: 'pengaduan' },
];

const FormulirPPID: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Formulir PPID"
        subtitle="Formulir Permohonan Informasi Publik"
        icon="pi pi-file-edit"
        tag="FORMULIR"
        breadcrumbItems={[
          { label: 'PPID', url: '/ppid' },
          { label: 'Formulir' },
        ]}
      />

      <section style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="pp-section-title" style={{ fontSize: '1.35rem', color: '#1e293b' }}>
            Ajukan Permohonan
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: 500, margin: '16px auto 0', lineHeight: 1.6 }}>
            Silakan isi formulir di bawah ini untuk mengajukan permohonan informasi publik.
          </p>
        </div>

        <Card
          style={{
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,.04)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                Nama Lengkap <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <InputText
                placeholder="Masukkan nama lengkap"
                style={{ width: '100%', borderRadius: 10, padding: '10px 14px', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <InputText
                type="email"
                placeholder="contoh@email.com"
                style={{ width: '100%', borderRadius: 10, padding: '10px 14px', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                No. Telepon
              </label>
              <InputText
                placeholder="08xxxxxxxxxx"
                style={{ width: '100%', borderRadius: 10, padding: '10px 14px', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                Jenis Permohonan <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Dropdown
                options={jenisPermohonan}
                placeholder="Pilih jenis permohonan"
                style={{ width: '100%', borderRadius: 10 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                Rincian Informasi yang Diminta <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <InputTextarea
                rows={5}
                placeholder="Jelaskan informasi yang Anda butuhkan..."
                style={{ width: '100%', borderRadius: 10, padding: '10px 14px', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                Tujuan Penggunaan Informasi
              </label>
              <InputTextarea
                rows={3}
                placeholder="Jelaskan tujuan penggunaan informasi..."
                style={{ width: '100%', borderRadius: 10, padding: '10px 14px', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>

            <Button
              label="Kirim Permohonan"
              icon="pi pi-send"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
                border: 'none',
                borderRadius: 12,
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginTop: 8,
              }}
            />
          </div>
        </Card>
      </section>
    </div>
  );
};

export default FormulirPPID;
