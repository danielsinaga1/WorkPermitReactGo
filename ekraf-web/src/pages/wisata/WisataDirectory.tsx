import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { PageHeroBanner } from '../../components/shared/PageHeroBanner';
import { destinasiWisataService } from '../../services';
import type { DestinasiWisata, KategoriWisata } from '../../types';
import '../berita-publikasi.css';

const KATEGORI_OPTIONS = [
  { label: 'Semua Kategori', value: '' },
  { label: 'Alam', value: 'alam' },
  { label: 'Budaya', value: 'budaya' },
  { label: 'Buatan', value: 'buatan' },
  { label: 'Religi', value: 'religi' },
  { label: 'Kuliner', value: 'kuliner' },
  { label: 'Edukasi', value: 'edukasi' },
];

const KATEGORI_COLORS: Record<string, string> = {
  alam: '#22c55e',
  budaya: '#f59e0b',
  buatan: '#6366f1',
  religi: '#8b5cf6',
  kuliner: '#ef4444',
  edukasi: '#06b6d4',
};

const WisataDirectory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<DestinasiWisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState<KategoriWisata | ''>('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 9;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await destinasiWisataService.list({
        search: search || undefined,
        kategori: kategori || undefined,
        page: Math.floor(page / PER_PAGE) + 1,
        per_page: PER_PAGE,
      });
      setItems(resp.data);
      setTotal(resp.meta.total);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, kategori, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const mapSrc = (d: DestinasiWisata) =>
    d.latitude && d.longitude
      ? `https://maps.google.com/maps?q=${d.latitude},${d.longitude}&z=15&output=embed`
      : null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <PageHeroBanner
        title="Direktori Wisata Pintar"
        subtitle="Jelajahi destinasi unggulan Kota Bontang — Beras Basah, Mangrove, dan lainnya"
        icon="pi pi-map-marker"
        tag="PARIWISATA"
        breadcrumbItems={[{ label: 'Beranda', url: '/' }, { label: 'Wisata' }]}
      />

      <div className="bp-content-section">
        {/* Search & Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px', justifyContent: 'center' }}>
          <span className="p-input-icon-left" style={{ minWidth: '280px', flex: 1, maxWidth: '420px' }}>
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari destinasi wisata..."
              style={{ width: '100%', borderRadius: 25, paddingLeft: 42 }}
            />
          </span>
          <Dropdown
            value={kategori}
            options={KATEGORI_OPTIONS}
            onChange={(e) => { setKategori(e.value); setPage(0); }}
            style={{ borderRadius: 25, minWidth: '180px' }}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#6366f1' }} />
          </div>
        ) : items.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {items.map((d) => (
              <div
                key={d.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/wisata/${d.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                }}
              >
                {/* Image / Map embed */}
                <div style={{ width: '100%', height: '200px', position: 'relative', background: '#e2e8f0' }}>
                  {d.thumbnail ? (
                    <img src={d.thumbnail} alt={d.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : mapSrc(d) ? (
                    <iframe
                      src={mapSrc(d)!}
                      style={{ width: '100%', height: '100%', border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      title={d.nama}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <i className="pi pi-map-marker" style={{ fontSize: '3rem', color: '#94a3b8' }} />
                    </div>
                  )}
                  <Tag
                    value={d.kategori}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: KATEGORI_COLORS[d.kategori] || '#6366f1',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  />
                  {d.is_ticketed && (
                    <Tag
                      value="E-Ticket"
                      icon="pi pi-ticket"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#6366f1',
                        color: '#fff',
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '16px 20px 20px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                    {d.nama}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem', marginBottom: '8px' }}>
                    <i className="pi pi-map-marker" style={{ fontSize: '0.75rem' }} />
                    <span>{d.alamat}</span>
                  </div>
                  {d.deskripsi && (
                    <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {d.deskripsi}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#64748b' }}>
                      {d.harga_tiket != null && (
                        <span><i className="pi pi-wallet mr-1" style={{ fontSize: '0.75rem' }} />Rp {d.harga_tiket.toLocaleString('id-ID')}</span>
                      )}
                      <span><i className="pi pi-eye mr-1" style={{ fontSize: '0.75rem' }} />{d.total_pengunjung.toLocaleString('id-ID')}</span>
                    </div>
                    <Button
                      icon="pi pi-arrow-right"
                      text
                      rounded
                      severity="info"
                      style={{ width: '32px', height: '32px' }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/wisata/${d.id}`); }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <i className="pi pi-map" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '12px', display: 'block' }} />
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Tidak ada destinasi wisata ditemukan.</p>
          </div>
        )}

        {/* Pagination */}
        {total > PER_PAGE && (
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
            <Paginator
              first={page}
              rows={PER_PAGE}
              totalRecords={total}
              onPageChange={(e) => { setPage(e.first); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WisataDirectory;
