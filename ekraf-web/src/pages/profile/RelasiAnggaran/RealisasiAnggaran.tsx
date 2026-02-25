import React, { useMemo, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Tag } from 'primereact/tag';
import realisasiData from './RealisasiAnggaran.json';
import { CardRelasiAnggaran } from '../../../components/profilcomponents/realisasicomponents/CardRelasiAnggaran';
import { PageHeroBanner } from '../../../components/shared/PageHeroBanner';
import '../../profil-ppid.css';

type RealisasiItem = {
  id: number | string;
  title: string;
  content: string;
  date: string;
  thumbnail?: string;
};

const ITEMS_PER_PAGE = 6;

const RealisasiAnggaran: React.FC = () => {
  const [first, setFirst] = useState(0);
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search.trim()) return realisasiData as RealisasiItem[];
    const q = search.toLowerCase();
    return (realisasiData as RealisasiItem[]).filter(
      (d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)
    );
  }, [search]);

  const currentData = useMemo(
    () => filteredData.slice(first, first + ITEMS_PER_PAGE),
    [filteredData, first]
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Realisasi Anggaran"
        subtitle="Seputar Informasi Realisasi Anggaran Dinas DISPOPAR Bontang"
        icon="pi pi-chart-bar"
        tag="ANGGARAN"
        breadcrumbItems={[
          { label: 'Profil', url: '/profil' },
          { label: 'Realisasi Anggaran' },
        ]}
      />

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 16px' }} className="pp-page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0 0 4px' }}>
              Daftar Realisasi Anggaran
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              Menampilkan {filteredData.length} data realisasi anggaran
            </p>
          </div>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => { setSearch(e.target.value); setFirst(0); }}
              placeholder="Cari realisasi..."
              style={{
                borderRadius: 12,
                padding: '10px 16px 10px 40px',
                border: '1px solid rgba(0,0,0,.1)',
                fontSize: '0.85rem',
                width: 280,
              }}
            />
          </span>
        </div>

        {currentData.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {currentData.map((news) => (
              <CardRelasiAnggaran
                key={news.id}
                id={news.id}
                title={news.title}
                content={news.content}
                date={news.date}
                image={news.thumbnail || ''}
              />
            ))}
          </div>
        ) : (
          <div className="pp-placeholder" style={{ padding: '60px 20px' }}>
            <div className="placeholder-icon">
              <i className="pi pi-search" style={{ fontSize: '2rem', color: '#6366f1' }} />
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Tidak ada data yang ditemukan.</p>
          </div>
        )}
      </section>

      {filteredData.length > ITEMS_PER_PAGE && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 24px 48px', display: 'flex', justifyContent: 'center' }}>
          <Paginator
            first={first}
            rows={ITEMS_PER_PAGE}
            totalRecords={filteredData.length}
            onPageChange={(e) => {
              setFirst(e.first);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            template="PrevPageLink PageLinks NextPageLink"
            style={{ background: 'transparent', border: 'none' }}
          />
        </section>
      )}
    </div>
  );
};

export default RealisasiAnggaran;
