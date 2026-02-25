import React from 'react';
import { Tag } from 'primereact/tag';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const jadwal = [
  { hari: 'Senin – Kamis', jam: '08:00 – 16:00 WIB', status: 'Buka' },
  { hari: 'Jumat', jam: '08:00 – 16:30 WIB', status: 'Buka' },
  { hari: 'Sabtu', jam: 'Tutup', status: 'Tutup' },
  { hari: 'Minggu', jam: 'Tutup', status: 'Tutup' },
  { hari: 'Hari Libur Nasional', jam: 'Tutup', status: 'Tutup' },
];

const JamPelayananPPID: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Jam Pelayanan PPID"
        subtitle="Jadwal dan Jam Operasional Pelayanan Informasi Publik"
        icon="pi pi-clock"
        tag="JAM PELAYANAN"
        breadcrumbItems={[
          { label: 'PPID', url: '/ppid' },
          { label: 'Jam Pelayanan' },
        ]}
      />

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 className="pp-section-title" style={{ fontSize: '1.35rem', color: '#1e293b' }}>
            Jadwal Pelayanan
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: 500, margin: '16px auto 0', lineHeight: 1.6 }}>
            Berikut adalah jadwal pelayanan informasi publik di kantor PPID DISPOPAR Bontang.
          </p>
        </div>

        <table className="pp-schedule-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Hari</th>
              <th style={{ textAlign: 'left' }}>Jam Pelayanan</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: '#1e293b' }}>{row.hari}</td>
                <td style={{ color: '#475569' }}>{row.jam}</td>
                <td style={{ textAlign: 'center' }}>
                  <Tag
                    value={row.status}
                    severity={row.status === 'Buka' ? 'success' : 'danger'}
                    style={{ fontSize: '0.7rem', padding: '3px 12px', borderRadius: 6, fontWeight: 600 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: 32,
            padding: '20px 24px',
            background: '#fff',
            borderRadius: 14,
            border: '1px solid rgba(0,0,0,.06)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
          }}
        >
          <i className="pi pi-info-circle" style={{ color: '#6366f1', fontSize: '1.1rem', marginTop: 2 }} />
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', margin: '0 0 4px' }}>Catatan</p>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              Jam istirahat pukul 12:00 – 13:00 WIB (Senin–Kamis) dan 11:30 – 13:00 WIB (Jumat).
              Pelayanan informasi juga dapat diakses melalui email dan formulir online.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JamPelayananPPID;
