import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Galleria } from 'primereact/galleria';
import { destinasiWisataService } from '../../services';
import type { DestinasiWisata } from '../../types';

const KATEGORI_COLORS: Record<string, string> = {
  alam: '#22c55e', budaya: '#f59e0b', buatan: '#6366f1',
  religi: '#8b5cf6', kuliner: '#ef4444', edukasi: '#06b6d4',
};

const WisataDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<DestinasiWisata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    destinasiWisataService.detail(Number(id))
      .then(setItem)
      .catch(() => navigate('/wisata'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2.5rem', color: '#6366f1' }} />
      </div>
    );
  }

  if (!item) return null;

  const mapSrc = item.latitude && item.longitude
    ? `https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=15&output=embed`
    : null;

  const allImages = [
    ...(item.thumbnail ? [item.thumbnail] : []),
    ...(item.images || []),
  ];

  const galleriaItemTemplate = (img: string) => (
    <img src={img} alt={item.nama} style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', borderRadius: '12px' }} />
  );

  const galleriaThumbnailTemplate = (img: string) => (
    <img src={img} alt="" style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '8px' }} />
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
          <Link to="/" style={{ color: '#6366f1', textDecoration: 'none' }}>Beranda</Link>
          <i className="pi pi-angle-right" style={{ fontSize: '0.7rem' }} />
          <Link to="/wisata" style={{ color: '#6366f1', textDecoration: 'none' }}>Wisata</Link>
          <i className="pi pi-angle-right" style={{ fontSize: '0.7rem' }} />
          <span style={{ color: '#1e293b', fontWeight: 500 }}>{item.nama}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Back button */}
        <Button
          label="Kembali"
          icon="pi pi-arrow-left"
          text
          className="mb-4"
          style={{ color: '#6366f1' }}
          onClick={() => navigate('/wisata')}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
          {/* Main Content */}
          <div>
            {/* Gallery */}
            {allImages.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                {allImages.length > 1 ? (
                  <Galleria
                    value={allImages}
                    numVisible={5}
                    item={galleriaItemTemplate}
                    thumbnail={galleriaThumbnailTemplate}
                    style={{ maxWidth: '100%' }}
                    showThumbnails
                    showItemNavigators
                    circular
                  />
                ) : (
                  <img src={allImages[0]} alt={item.nama} style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', borderRadius: '12px' }} />
                )}
              </div>
            )}

            {/* Title & Info */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{item.nama}</h1>
                <Tag
                  value={item.kategori}
                  style={{
                    background: KATEGORI_COLORS[item.kategori] || '#6366f1',
                    color: '#fff',
                    textTransform: 'capitalize',
                    fontSize: '0.75rem',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem' }}>
                <i className="pi pi-map-marker" style={{ fontSize: '0.85rem' }} />
                <span>{item.alamat}</span>
              </div>
            </div>

            {/* Description */}
            {item.deskripsi && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Tentang Destinasi</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{item.deskripsi}</p>
              </div>
            )}

            {/* Virtual Tour */}
            {item.virtual_tour_url && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                  <i className="pi pi-eye mr-2" />Virtual Tour 360°
                </h3>
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '400px' }}>
                  <iframe
                    src={item.virtual_tour_url}
                    style={{ width: '100%', height: '100%', border: 0 }}
                    allowFullScreen
                    title="Virtual Tour"
                  />
                </div>
              </div>
            )}

            {/* Google Maps */}
            {mapSrc && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                  <i className="pi pi-map mr-2" />Lokasi di Google Maps
                </h3>
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '350px' }}>
                  <iframe
                    src={mapSrc}
                    style={{ width: '100%', height: '100%', border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    title="Google Maps"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: '#6366f1', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}
                >
                  <i className="pi pi-directions" style={{ fontSize: '0.85rem' }} /> Dapatkan Petunjuk Arah
                </a>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '100px' }}>
            {/* Info Card */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Informasi</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {item.jam_operasional && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <i className="pi pi-clock" style={{ color: '#6366f1', marginTop: '2px', fontSize: '0.9rem' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginBottom: '2px' }}>JAM OPERASIONAL</div>
                      <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>{item.jam_operasional}</div>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <i className="pi pi-wallet" style={{ color: '#6366f1', marginTop: '2px', fontSize: '0.9rem' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginBottom: '2px' }}>TIKET MASUK</div>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                      {item.harga_tiket ? `Rp ${item.harga_tiket.toLocaleString('id-ID')}` : 'Gratis'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <i className="pi pi-users" style={{ color: '#6366f1', marginTop: '2px', fontSize: '0.9rem' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginBottom: '2px' }}>TOTAL PENGUNJUNG</div>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>{item.total_pengunjung.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fasilitas */}
            {item.fasilitas && item.fasilitas.length > 0 && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Fasilitas</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {item.fasilitas.map((f, i) => (
                    <Tag key={i} value={f} style={{ background: '#eef2ff', color: '#6366f1', fontWeight: 500, fontSize: '0.75rem' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Buy Ticket CTA */}
            {item.is_ticketed && (
              <Button
                label="Beli Tiket Online"
                icon="pi pi-ticket"
                className="w-full border-round-xl"
                style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', border: 'none', padding: '14px', fontSize: '1rem', fontWeight: 600 }}
                onClick={() => navigate(`/tiket?destinasi=${item.id}`)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WisataDetail;
