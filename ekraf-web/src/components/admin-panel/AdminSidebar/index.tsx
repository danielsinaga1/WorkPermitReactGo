import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import LogoEkraf from '../../../assets/logoekraf.png';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface SubMenuItem {
  title: string;
  path: string;
}

interface MenuItem {
  title: string;
  path?: string;
  icon: JSX.Element;
  submenu?: SubMenuItem[];
}

interface MenuSection {
  sectionTitle: string;
  items: MenuItem[];
}

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const menuSections: MenuSection[] = [
    {
      sectionTitle: 'MAIN MENU',
      items: [
        {
          title: 'Dashboard',
          path: '/dashboard',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          ),
        },
      ],
    },
    {
      sectionTitle: 'MANAJEMEN DATA',
      items: [
        {
          title: 'Pelaku Ekraf',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          submenu: [
            { title: 'Semua Pelaku', path: '/dashboard/pelaku-ekraf' },
            { title: 'Tambah Pelaku', path: '/dashboard/pelaku-ekraf/tambah' },
            { title: 'Verifikasi Data', path: '/dashboard/pelaku-ekraf/verifikasi' },
            { title: 'Sub-sektor', path: '/dashboard/pelaku-ekraf/subsektor' },
          ],
        },
        {
          title: 'Produk & Karya',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          submenu: [
            { title: 'Galeri Produk', path: '/dashboard/produk/galeri' },
            { title: 'Katalog Digital', path: '/dashboard/produk/katalog' },
            { title: 'Produk Unggulan', path: '/dashboard/produk/unggulan' },
          ],
        },
      ],
    },
    {
      sectionTitle: 'FASILITASI & PROGRAM',
      items: [
        {
          title: 'Event & Pelatihan',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          submenu: [
            { title: 'Daftar Event', path: '/dashboard/event' },
            { title: 'Pelatihan', path: '/dashboard/event/pelatihan' },
            { title: 'Peserta', path: '/dashboard/event/peserta' },
          ],
        },
        {
          title: 'Bantuan & Hibah',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          submenu: [
            { title: 'Bantuan Modal', path: '/dashboard/bantuan/modal' },
            { title: 'Bantuan Alat', path: '/dashboard/bantuan/alat' },
            { title: 'Riwayat Penerima', path: '/dashboard/bantuan/riwayat' },
          ],
        },
        {
          title: 'HAKI & Kurasi',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          submenu: [
            { title: 'Fasilitasi HAKI', path: '/dashboard/haki' },
            { title: 'Kurasi Produk', path: '/dashboard/haki/kurasi' },
          ],
        },
      ],
    },
    {
      sectionTitle: 'LAPORAN',
      items: [
        {
          title: 'Laporan & Ekspor',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          submenu: [
            { title: 'Ekspor Data', path: '/dashboard/laporan/ekspor' },
            { title: 'Laporan Omzet', path: '/dashboard/laporan/omzet' },
            { title: 'Serapan Tenaga Kerja', path: '/dashboard/laporan/tenaga-kerja' },
            { title: 'Statistik Wilayah', path: '/dashboard/laporan/wilayah' },
          ],
        },
      ],
    },
    {
      sectionTitle: 'CMS',
      items: [
        {
          title: 'Konten Website',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          ),
          submenu: [
            { title: 'Berita & Artikel', path: '/dashboard/cms/berita' },
            { title: 'Pengumuman', path: '/dashboard/cms/pengumuman' },
            { title: 'Slider/Banner', path: '/dashboard/cms/banner' },
          ],
        },
        {
          title: 'Dokumen & Regulasi',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          submenu: [
            { title: 'Regulasi', path: '/dashboard/cms/regulasi' },
            { title: 'Agenda Event', path: '/dashboard/cms/agenda' },
          ],
        },
      ],
    },
    {
      sectionTitle: 'PENGATURAN',
      items: [
        {
          title: 'Manajemen User',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
          submenu: [
            { title: 'Daftar User', path: '/dashboard/settings/users' },
            { title: 'Role & Permission', path: '/dashboard/settings/roles' },
          ],
        },
        {
          title: 'Master Data',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          ),
          submenu: [
            { title: 'Wilayah', path: '/dashboard/settings/wilayah' },
            { title: 'Sub-sektor Ekraf', path: '/dashboard/settings/subsektor' },
            { title: 'Skala Usaha', path: '/dashboard/settings/skala-usaha' },
          ],
        },
        {
          title: 'Sistem',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          submenu: [
            { title: 'Pengaturan Umum', path: '/dashboard/settings/general' },
            { title: 'Audit Log', path: '/dashboard/settings/audit-log' },
            { title: 'Backup Data', path: '/dashboard/settings/backup' },
          ],
        },
      ],
    },
  ];

  // Auto-open submenu that contains the active route on mount and path changes
  useEffect(() => {
    for (const section of menuSections) {
      for (const item of section.items) {
        if (item.submenu?.some(sub => pathname === sub.path || pathname.startsWith(sub.path + '/'))) {
          setOpenSubmenu(item.title);
          return;
        }
      }
    }
  }, [pathname]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5 border-b border-gray-700/50">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={LogoEkraf} alt="Logo" className="w-40 h-auto" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="py-4 px-3">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {section.sectionTitle}
              </h3>
              <ul className="flex flex-col gap-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.submenu ? (
                      // Menu with submenu
                      <div>
                        <button
                          onClick={() => toggleSubmenu(item.title)}
                          className={`w-full group relative flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 font-medium transition-all duration-200 ${
                            openSubmenu === item.title || item.submenu.some(sub => pathname === sub.path)
                              ? 'bg-gray-700/50 text-white'
                              : 'text-gray-400 hover:bg-gray-700/30 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-sm">{item.title}</span>
                          </div>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openSubmenu === item.title ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {/* Submenu */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            openSubmenu === item.title ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <ul className="mt-1 ml-4 pl-4 border-l border-gray-700/50">
                            {item.submenu.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <NavLink
                                  to={subItem.path}
                                  className={({ isActive }) =>
                                    `block py-2 px-3 text-sm rounded-lg transition-all duration-200 ${
                                      isActive
                                        ? 'text-primary font-medium bg-primary/10'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                                    }`
                                  }
                                >
                                  {subItem.title}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      // Single menu item
                      <NavLink
                        to={item.path!}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-white shadow-lg shadow-primary/30'
                              : 'text-gray-400 hover:bg-gray-700/30 hover:text-white'
                          }`
                        }
                      >
                        {item.icon}
                        <span className="text-sm">{item.title}</span>
                        {pathname === item.path && (
                          <span className="absolute right-3 w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Back to Website Button */}
        <div className="mt-auto px-3 pb-4">
          <NavLink
            to="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-700/50 px-4 py-3 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Website</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
