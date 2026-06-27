import { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';

const banners = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1754430544039-9da4dc746d2a?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Selamat Datang di DISPOPAR',
    subtitle: 'Dinas Pemuda, Olahraga dan Pariwisata Kota Bontang',
    tag: 'PORTAL RESMI',
    cta: { label: 'Jelajahi Sekarang', path: '/profil/lembaga' },
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1753920053405-33896b09e94b?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Ekonomi Kreatif Bontang',
    subtitle: 'Membangun ekosistem kreatif yang berdaya saing dan berkelanjutan',
    tag: 'EKONOMI KREATIF',
    cta: { label: 'Lihat Statistik', path: '/stat/potensi-ekonomi-kreatif-indonesia' },
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1753454116483-417bbc0a975c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Wisata & Budaya Bontang',
    subtitle: 'Jelajahi keindahan alam dan kekayaan budaya Kota Bontang',
    tag: 'PARIWISATA',
    cta: { label: 'Baca Selengkapnya', path: '/news' },
  },
];

export const BannerSlider = () => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const bannerTemplate = (banner: (typeof banners)[0]) => (
    <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
      <img
        src={banner.src}
        alt={banner.title}
        style={{
          width: '100%',
          height: isDesktop ? 500 : 240,
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 8s ease',
        }}
      />
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(30,27,75,0.7) 0%, rgba(30,27,75,0.3) 40%, transparent 70%)',
        }}
      />
      {/* Text content */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: isDesktop ? '0 56px 48px' : '0 20px 24px',
        }}
      >
        <Tag
          value={banner.tag}
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '0.68rem',
            padding: '4px 12px',
            marginBottom: 14,
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(10px)',
            letterSpacing: 1,
          }}
        />
        <h2
          style={{
            color: '#fff',
            fontSize: isDesktop ? '2.5rem' : '1.3rem',
            fontWeight: 800,
            margin: '0 0 10px',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            maxWidth: isDesktop ? 600 : '100%',
          }}
        >
          {banner.title}
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: isDesktop ? '1.1rem' : '0.85rem',
            marginTop: 0,
            marginBottom: isDesktop ? 24 : 16,
            maxWidth: isDesktop ? 500 : '100%',
            lineHeight: 1.6,
          }}
        >
          {banner.subtitle}
        </p>
        {isDesktop && (
          <Button
            label={banner.cta.label}
            icon="pi pi-arrow-right"
            iconPos="right"
            rounded
            onClick={() => navigate(banner.cta.path)}
            style={{
              background: 'rgba(255,255,255,0.95)',
              color: '#4338ca',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '12px 28px',
              backdropFilter: 'blur(10px)',
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <Carousel
      value={banners}
      itemTemplate={bannerTemplate}
      numVisible={1}
      numScroll={1}
      autoplayInterval={6000}
      circular
      showIndicators
      showNavigators={isDesktop}
      style={{ border: 'none' }}
      pt={{
        indicator: { className: 'mx-1' },
      }}
    />
  );
};
