import LogoEkraf from '../../assets/logoekraf.png';

const menuItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil/lembaga' },
  { label: 'Berita', href: '/news' },
  { label: 'Pengumuman', href: '/announcement' },
  { label: 'Newsletter', href: '/publisher/newsletter' },
];

const ppidItems = [
  { label: 'Tentang PPID', href: '/ppid/tentang-ppid' },
  { label: 'Profil PPID', href: '/ppid/profil-ppid' },
  { label: 'Tugas & Fungsi', href: '/ppid/tugas-fungsi-ppid' },
];

const socialIcons = [
  { icon: 'pi pi-facebook', label: 'Facebook' },
  { icon: 'pi pi-twitter', label: 'Twitter' },
  { icon: 'pi pi-instagram', label: 'Instagram' },
  { icon: 'pi pi-youtube', label: 'YouTube' },
  { icon: 'pi pi-linkedin', label: 'LinkedIn' },
];

const linkStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' };

const Footer = () => {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <img src={LogoEkraf} alt="DISPOPAR" style={{ height: 48, filter: 'brightness(0) invert(1)' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>DISPOPAR</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>Kota Bontang</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
              Dinas Pemuda, Olahraga dan Pariwisata Kota Bontang. Mendorong pengembangan ekonomi kreatif dan pariwisata yang berkelanjutan.
            </p>
          </div>

          {/* Kontak */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, marginTop: 0 }}>Kontak Kami</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <i className="pi pi-map-marker" style={{ color: '#a5b4fc', marginTop: 3, flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Jl. Jendral Sudirman RT06, Kel. Tj. Laut, Kec. Bontang Sel., Kota Bontang, Kaltim 75325
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="pi pi-phone" style={{ color: '#a5b4fc' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>(021) 383 8303</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="pi pi-envelope" style={{ color: '#a5b4fc' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>info@dispopar-bontang.go.id</span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, marginTop: 0 }}>Menu Utama</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {menuItems.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                >
                  {m.label}
                </a>
              ))}
            </div>
          </div>

          {/* PPID + Social */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, marginTop: 0 }}>PPID</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {ppidItems.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                >
                  {m.label}
                </a>
              ))}
            </div>
            <h5 style={{ fontWeight: 600, marginBottom: 12, marginTop: 0, fontSize: '0.95rem' }}>Ikuti Kami</h5>
            <div style={{ display: 'flex', gap: 10 }}>
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s', color: '#fff', textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                >
                  <i className={s.icon} style={{ fontSize: '0.9rem' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            &copy; 2026 Dinas DISPOPAR Kota Bontang. Semua hak dilindungi.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Sitemap'].map((t) => (
              <a
                key={t}
                href="#"
                style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
