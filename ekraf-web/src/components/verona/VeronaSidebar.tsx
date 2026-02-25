import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/* ============================================================
   TYPE DEFINITIONS
   ============================================================ */
interface SubMenuItem {
  label: string;
  to: string;
}

interface MenuItem {
  label: string;
  icon: string;          // PrimeIcon class (e.g. "pi pi-home")
  to?: string;           // direct link – no submenu
  items?: SubMenuItem[];  // submenu children
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

interface VeronaSidebarProps {
  open: boolean;
  onClose: () => void;
  isDesktop: boolean;
}

/* ============================================================
   MENU DATA
   ============================================================ */
const menuModel: MenuSection[] = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', icon: 'pi pi-th-large', to: '/dashboard' },
    ],
  },
  {
    label: 'MANAJEMEN DATA',
    items: [
      {
        label: 'Pelaku DISPOPAR',
        icon: 'pi pi-users',
        items: [
          { label: 'Semua Pelaku', to: '/dashboard/pelaku-ekraf' },
          { label: 'Tambah Pelaku', to: '/dashboard/pelaku-ekraf/tambah' },
          { label: 'Verifikasi Data', to: '/dashboard/pelaku-ekraf/verifikasi' },
          { label: 'Sub-sektor', to: '/dashboard/pelaku-ekraf/subsektor' },
        ],
      },
      {
        label: 'Produk & Karya',
        icon: 'pi pi-images',
        items: [
          { label: 'Galeri Produk', to: '/dashboard/produk/galeri' },
          { label: 'Katalog Digital', to: '/dashboard/produk/katalog' },
          { label: 'Produk Unggulan', to: '/dashboard/produk/unggulan' },
        ],
      },
    ],
  },
  {
    label: 'KEPEMUDAAN',
    items: [
      {
        label: 'Youth Talent',
        icon: 'pi pi-star',
        items: [
          { label: 'Daftar Peluang', to: '/dashboard/youth-opportunity' },
        ],
      },
    ],
  },
  {
    label: 'OLAHRAGA',
    items: [
      {
        label: 'Database Simpora',
        icon: 'pi pi-id-card',
        items: [
          { label: 'Data Atlet', to: '/dashboard/atlet' },
          { label: 'Data Pelatih', to: '/dashboard/pelatih' },
        ],
      },
      {
        label: 'Manajemen Turnamen',
        icon: 'pi pi-trophy',
        items: [
          { label: 'Daftar Turnamen', to: '/dashboard/turnamen' },
        ],
      },
    ],
  },
  {
    label: 'FASILITASI & PROGRAM',
    items: [
      {
        label: 'Event & Pelatihan',
        icon: 'pi pi-calendar',
        items: [
          { label: 'Daftar Event', to: '/dashboard/event' },
          { label: 'Pelatihan', to: '/dashboard/event/pelatihan' },
          { label: 'Peserta', to: '/dashboard/event/peserta' },
        ],
      },
      {
        label: 'Bantuan & Hibah',
        icon: 'pi pi-wallet',
        items: [
          { label: 'Bantuan Modal', to: '/dashboard/bantuan/modal' },
          { label: 'Bantuan Alat', to: '/dashboard/bantuan/alat' },
          { label: 'Riwayat Penerima', to: '/dashboard/bantuan/riwayat' },
        ],
      },
      {
        label: 'HAKI & Kurasi',
        icon: 'pi pi-shield',
        items: [
          { label: 'Fasilitasi HAKI', to: '/dashboard/haki' },
          { label: 'Kurasi Produk', to: '/dashboard/haki/kurasi' },
        ],
      },
    ],
  },
  {
    label: 'LAPORAN',
    items: [
      {
        label: 'Laporan & Ekspor',
        icon: 'pi pi-chart-bar',
        items: [
          { label: 'Ekspor Data', to: '/dashboard/laporan/ekspor' },
          { label: 'Laporan Omzet', to: '/dashboard/laporan/omzet' },
          { label: 'Serapan TK', to: '/dashboard/laporan/tenaga-kerja' },
          { label: 'Statistik Wilayah', to: '/dashboard/laporan/wilayah' },
        ],
      },
    ],
  },
  {
    label: 'CMS',
    items: [
      {
        label: 'Konten Website',
        icon: 'pi pi-file-edit',
        items: [
          { label: 'Berita & Artikel', to: '/dashboard/cms/berita' },
          { label: 'Pengumuman', to: '/dashboard/cms/pengumuman' },
          { label: 'Slider/Banner', to: '/dashboard/cms/banner' },
          { label: 'Promosi', to: '/dashboard/cms/promosi' },
          { label: 'Ragam Ekraf', to: '/dashboard/cms/ragam-ekraf' },
        ],
      },
      {
        label: 'Publikasi',
        icon: 'pi pi-book',
        items: [
          { label: 'Newsletter', to: '/dashboard/cms/newsletter' },
          { label: 'Pustaka', to: '/dashboard/cms/pustaka' },
          { label: 'Tenaga Kerja', to: '/dashboard/cms/tenaga-kerja' },
        ],
      },
      {
        label: 'Dokumen & Regulasi',
        icon: 'pi pi-file',
        items: [
          { label: 'Regulasi', to: '/dashboard/cms/regulasi' },
          { label: 'Agenda Event', to: '/dashboard/cms/agenda' },
          { label: 'Produk Hukum', to: '/dashboard/cms/produk-hukum' },
        ],
      },
      {
        label: 'Data & Statistik',
        icon: 'pi pi-chart-line',
        items: [
          { label: 'Potensi Ekonomi', to: '/dashboard/cms/potensi-ekonomi' },
          { label: 'Realisasi Anggaran', to: '/dashboard/cms/realisasi-anggaran' },
        ],
      },
      {
        label: 'Profil & Kelembagaan',
        icon: 'pi pi-building',
        items: [
          { label: 'Profil Pimpinan', to: '/dashboard/cms/profil-pimpinan' },
          { label: 'Reformasi Birokrasi', to: '/dashboard/cms/reformasi-birokrasi' },
          { label: 'PPID', to: '/dashboard/cms/ppid' },
        ],
      },
    ],
  },
  {
    label: 'PENGADUAN',
    items: [
      {
        label: 'Sistem Pengaduan',
        icon: 'pi pi-comments',
        items: [
          { label: 'Daftar Pengaduan', to: '/dashboard/pengaduan' },
        ],
      },
    ],
  },
  {
    label: 'PARIWISATA',
    items: [
      {
        label: 'Destinasi Wisata',
        icon: 'pi pi-map-marker',
        items: [
          { label: 'Daftar Destinasi', to: '/dashboard/destinasi-wisata' },
        ],
      },
      {
        label: 'E-Ticketing',
        icon: 'pi pi-ticket',
        items: [
          { label: 'Daftar Tiket', to: '/dashboard/tiket-wisata' },
        ],
      },
    ],
  },
  {
    label: 'PENGATURAN',
    items: [
      {
        label: 'Manajemen User',
        icon: 'pi pi-user-edit',
        items: [
          { label: 'Daftar User', to: '/dashboard/settings/users' },
          { label: 'Role & Permission', to: '/dashboard/settings/roles' },
        ],
      },
      {
        label: 'Master Data',
        icon: 'pi pi-database',
        items: [
          { label: 'Wilayah', to: '/dashboard/settings/wilayah' },
          { label: 'Sub-sektor DISPOPAR', to: '/dashboard/settings/subsektor' },
          { label: 'Skala Usaha', to: '/dashboard/settings/skala-usaha' },
        ],
      },
      {
        label: 'Sistem',
        icon: 'pi pi-cog',
        items: [
          { label: 'Pengaturan Umum', to: '/dashboard/settings/general' },
          { label: 'Audit Log', to: '/dashboard/settings/audit-log' },
          { label: 'Backup Data', to: '/dashboard/settings/backup' },
        ],
      },
    ],
  },
];

/* ============================================================
   COMPONENT
   ============================================================ */
const VeronaSidebar = ({ open, onClose, isDesktop }: VeronaSidebarProps) => {
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Auto-expand the section whose submenu contains the active path
  useEffect(() => {
    for (const section of menuModel) {
      for (const item of section.items) {
        if (item.items?.some((sub) => location.pathname === sub.to)) {
          setExpanded(item.label);
          return;
        }
      }
    }
  }, [location.pathname]);

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  const toggle = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  const linkStyle = (active: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
    fontWeight: active ? 600 : 400,
    color: active ? '#ffffff' : 'rgba(199,210,254,0.85)',
    background: active ? 'rgba(129,140,248,0.25)' : 'transparent',
  });

  const renderIcon = (icon: string): ReactNode => (
    <i className={icon} style={{ fontSize: '1rem' }} />
  );

  return (
    <>
      {/* Mobile overlay */}
      {!isDesktop && open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 4,
            background: 'rgba(0,0,0,0.5)',
          }}
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        style={{
          position: isDesktop ? 'static' : 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: isDesktop ? 'auto' : 5,
          flexShrink: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '260px',
          minWidth: '260px',
          transform: isDesktop ? 'none' : (open ? 'translateX(0)' : 'translateX(-100%)'),
          transition: 'transform 0.3s ease',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            height: '64px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #818cf8, #6366f1)',
              }}
            >
              <i className="pi pi-building" style={{ color: '#ffffff', fontSize: '1.125rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '1rem', letterSpacing: '0.05em' }}>
                DISPOPAR
              </span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(199,210,254,0.7)' }}>
                Kota Bontang
              </span>
            </div>
          </NavLink>
          {!isDesktop && (
            <button
              onClick={onClose}
              style={{
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                color: 'rgba(199,210,254,0.7)',
                padding: '6px',
                borderRadius: '8px',
              }}
            >
              <i className="pi pi-times" style={{ fontSize: '1.125rem' }} />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav style={{ padding: '16px 12px' }}>
          {menuModel.map((section) => (
            <div key={section.label} style={{ marginBottom: '20px' }}>
              {/* Section label */}
              <div
                style={{
                  padding: '0 12px',
                  marginBottom: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'rgba(165,180,252,0.6)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {section.label}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {section.items.map((item) => {
                  if (item.to && !item.items) {
                    // Direct link
                    const active = location.pathname === item.to;
                    return (
                      <li key={item.label}>
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          style={linkStyle(active)}
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                              e.currentTarget.style.color = '#ffffff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'rgba(199,210,254,0.85)';
                            }
                          }}
                        >
                          {renderIcon(item.icon)}
                          <span>{item.label}</span>
                          {active && (
                            <span
                              style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8' }}
                            />
                          )}
                        </NavLink>
                      </li>
                    );
                  }

                  // Expandable
                  const isExpanded = expanded === item.label;
                  const childActive = item.items?.some((sub) => location.pathname === sub.to) ?? false;

                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => toggle(item.label)}
                        style={{
                          width: '100%',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          padding: '8px 12px',
                          fontSize: '0.875rem',
                          color: childActive || isExpanded ? '#ffffff' : 'rgba(199,210,254,0.85)',
                          background: childActive || isExpanded ? 'rgba(255,255,255,0.1)' : 'transparent',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (!childActive && !isExpanded) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.color = '#ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!childActive && !isExpanded) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(199,210,254,0.85)';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {renderIcon(item.icon)}
                          <span>{item.label}</span>
                        </div>
                        <i
                          className="pi pi-chevron-down"
                          style={{
                            fontSize: '0.7rem',
                            transition: 'transform 0.2s',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </button>
                      {/* Submenu */}
                      <div
                        style={{
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease, opacity 0.3s ease',
                          maxHeight: isExpanded ? `${(item.items?.length ?? 0) * 40}px` : '0px',
                          opacity: isExpanded ? 1 : 0,
                        }}
                      >
                        <ul
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            marginLeft: '16px',
                            paddingLeft: '12px',
                            marginTop: '4px',
                            borderLeft: '2px solid rgba(129,140,248,0.25)',
                          }}
                        >
                          {item.items?.map((sub) => {
                            const active = location.pathname === sub.to;
                            return (
                              <li key={sub.to}>
                                <NavLink
                                  to={sub.to}
                                  onClick={onClose}
                                  style={{
                                    display: 'block',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    padding: '7px 12px',
                                    fontSize: '0.8125rem',
                                    color: active ? '#ffffff' : 'rgba(199,210,254,0.7)',
                                    fontWeight: active ? 500 : 400,
                                    background: active ? 'rgba(129,140,248,0.2)' : 'transparent',
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!active) {
                                      e.currentTarget.style.color = '#ffffff';
                                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!active) {
                                      e.currentTarget.style.color = 'rgba(199,210,254,0.7)';
                                      e.currentTarget.style.background = 'transparent';
                                    }
                                  }}
                                >
                                  {sub.label}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0 12px 16px' }}>
          <NavLink
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'rgba(199,210,254,0.8)',
              background: 'rgba(255,255,255,0.06)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'rgba(199,210,254,0.8)';
            }}
          >
            <i className="pi pi-arrow-left" />
            <span>Kembali ke Website</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default VeronaSidebar;
