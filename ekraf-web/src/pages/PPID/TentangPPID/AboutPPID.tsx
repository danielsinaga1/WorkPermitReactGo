import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

const commitments = [
  { icon: 'pi pi-heart', text: 'Mendukung dan memfasilitasi pelaku ekonomi kreatif lokal.' },
  { icon: 'pi pi-chart-line', text: 'Meningkatkan kualitas dan daya saing produk kreatif Bontang.' },
  { icon: 'pi pi-link', text: 'Menjadi penghubung antara kreator, pasar, dan investor.' },
  { icon: 'pi pi-globe', text: 'Menjadikan Bontang sebagai kota kreatif yang inklusif dan berkelanjutan.' },
];

const AboutPPID: React.FC = () => {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Tentang PPID"
        subtitle="Seputar Informasi PPID Dinas DISPOPAR Bontang"
        icon="pi pi-info-circle"
        tag="PPID"
        breadcrumbItems={[
          { label: 'PPID', url: '/ppid' },
          { label: 'Tentang PPID' },
        ]}
      />

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 64px' }} className="pp-page-content">
        {/* Main article */}
        <Card
          style={{
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,.04)',
            marginBottom: 48,
          }}
        >
          <Tag
            value="PELAYANAN PUBLIK"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff',
              fontSize: '0.65rem',
              padding: '4px 12px',
              borderRadius: 16,
              letterSpacing: 1,
              fontWeight: 700,
              marginBottom: 16,
            }}
          />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '12px 0 20px', lineHeight: 1.3 }}>
            Pelayanan Publik di Lingkungan Dinas DISPOPAR Bontang
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: '#475569', lineHeight: 1.9, fontSize: '0.93rem' }}>
            <p style={{ margin: 0 }}>
              PPID Dinas DISPOPAR Bontang merupakan layanan informasi satu pintu untuk membangun
              mekanisme layanan informasi melalui interkoneksi dan sinergi data dari masing-masing
              unit kerja.
            </p>
            <p style={{ margin: 0 }}>
              Kami percaya bahwa kreativitas adalah salah satu kekuatan utama dalam mendorong
              pertumbuhan ekonomi dan membuka lapangan kerja di masa depan. Karena itu, DISPOPAR
              Bontang aktif menyelenggarakan pelatihan, pendampingan, promosi, serta kolaborasi antara
              komunitas, pelaku usaha, dan pemerintah. Contoh kegiatan nyata meliputi pelatihan desain
              produk untuk UMKM, festival seni lokal, dan inkubasi bisnis kreatif.
            </p>
            <p style={{ margin: 0 }}>
              Tak hanya untuk pelaku usaha yang telah berjalan, DISPOPAR Bontang juga terbuka bagi
              generasi muda dan pemula yang ingin mulai berkarya dan berinovasi.
            </p>
          </div>
        </Card>

        {/* Commitments */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="pp-section-title" style={{ fontSize: '1.25rem', color: '#1e293b' }}>
            Komitmen DISPOPAR Bontang
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: 600, margin: '16px auto 0', lineHeight: 1.6 }}>
            Melalui semangat kolaborasi dan inovasi, DISPOPAR Bontang berkomitmen untuk:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
          {commitments.map((item, i) => (
            <div key={i} className="pp-commitment-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div className="commitment-number">{i + 1}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <i className={item.icon} style={{ color: '#6366f1', fontSize: '0.9rem' }} />
                </div>
                <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.88rem', margin: 0 }}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA info box */}
        <div className="pp-info-box">
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, fontSize: '0.93rem', marginBottom: 12 }}>
              Dengan dukungan semua pihak, DISPOPAR Bontang terus bergerak menuju ekosistem kreatif
              yang mandiri, adaptif terhadap teknologi, dan mampu bersaing di tingkat regional maupun
              nasional.
            </p>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>
              Mari tumbuh bersama, ciptakan karya, dan wujudkan Bontang yang lebih kreatif! 🚀
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPPID;
