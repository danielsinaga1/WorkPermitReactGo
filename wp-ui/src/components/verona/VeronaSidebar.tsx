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
      { label: 'KPI & Scorecard', icon: 'pi pi-chart-line', to: '/dashboard/kpi-scorecard' },
    ],
  },
  {
    label: 'PERMIT TO WORK',
    items: [
      {
        label: 'Work Permits',
        icon: 'pi pi-file-edit',
        items: [
          { label: 'All Permits', to: '/dashboard/work-permits' },
          { label: 'Create New', to: '/dashboard/work-permits/create' },
        ],
      },
    ],
  },
  {
    label: 'HSE OPERATIONS',
    items: [
      {
        label: 'Incidents',
        icon: 'pi pi-exclamation-triangle',
        items: [
          { label: 'Incident Register', to: '/dashboard/hse/incidents' },
        ],
      },
      {
        label: 'Emergency SOS',
        icon: 'pi pi-megaphone',
        items: [
          { label: 'SOS Dashboard', to: '/dashboard/hse/emergency-sos' },
        ],
      },
      {
        label: 'Hazard Observation',
        icon: 'pi pi-flag-fill',
        items: [
          { label: 'Hazard Register', to: '/dashboard/hse/hazard-observations' },
          { label: 'All Observations', to: '/dashboard/hse/observations' },
        ],
      },
      {
        label: 'B-Sharp (BBS)',
        icon: 'pi pi-users',
        items: [
          { label: 'Behavior Observations', to: '/dashboard/hse/bsharp' },
        ],
      },
      {
        label: 'Audit',
        icon: 'pi pi-shield',
        items: [
          { label: 'Audit Plans', to: '/dashboard/hse/audits' },
        ],
      },
      {
        label: 'Toolbox Meetings',
        icon: 'pi pi-users',
        items: [
          { label: 'TBM Schedule', to: '/dashboard/hse/toolbox-meetings' },
        ],
      },
      {
        label: 'Corrective Actions',
        icon: 'pi pi-check-square',
        items: [
          { label: 'Action Tracker', to: '/dashboard/hse/corrective-actions' },
        ],
      },
      {
        label: 'Lessons Learned',
        icon: 'pi pi-book',
        items: [
          { label: 'All Lessons', to: '/dashboard/hse/lessons-learned' },
        ],
      },
      {
        label: 'JSA Templates',
        icon: 'pi pi-list-check',
        items: [
          { label: 'Template Library', to: '/dashboard/hse/jsa-templates' },
        ],
      },
    ],
  },
  {
    label: 'LOTO & ASSETS',
    items: [
      {
        label: 'LOTO Procedures',
        icon: 'pi pi-lock',
        items: [
          { label: 'All Procedures', to: '/dashboard/loto' },
        ],
      },
    ],
  },
  {
    label: 'MASTER DATA',
    items: [
      {
        label: 'Resources',
        icon: 'pi pi-id-card',
        items: [
          { label: 'Personnel', to: '/dashboard/personnel' },
          { label: 'Equipment', to: '/dashboard/equipment' },
          { label: 'Contractors', to: '/dashboard/contractors' },
        ],
      },
      {
        label: 'Configuration',
        icon: 'pi pi-database',
        items: [
          { label: 'Work Areas', to: '/dashboard/master/work-areas' },
          { label: 'Permit Types', to: '/dashboard/master/permit-types' },
        ],
      },
    ],
  },
  {
    label: 'DOCUMENT',
    items: [
      { label: 'Documents', icon: 'pi pi-folder-open', to: '/dashboard/documents' },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      {
        label: 'System',
        icon: 'pi pi-cog',
        items: [
          { label: 'Audit Trail', to: '/dashboard/admin/audit-trail' },
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
    color: active ? '#ffffff' : 'rgba(203,213,225,0.8)',
    background: active ? 'rgba(249,115,22,0.2)' : 'transparent',
    borderLeft: active ? '3px solid #f97316' : '3px solid transparent',
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
          background: 'linear-gradient(180deg, #08111f 0%, #0d1e38 45%, #071629 100%)',
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
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <NavLink to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              }}
            >
              <i className="pi pi-shield" style={{ color: '#ffffff', fontSize: '1.125rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                WP & HSE
              </span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(199,210,254,0.7)' }}>
                Digital Work Permit
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
                  color: 'rgba(249,115,22,0.7)',
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
                              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                              e.currentTarget.style.color = '#ffffff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'rgba(203,213,225,0.8)';
                            }
                          }}
                        >
                          {renderIcon(item.icon)}
                          <span>{item.label}</span>
                          {active && (
                            <span
                              style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#f97316' }}
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
                          color: childActive || isExpanded ? '#ffffff' : 'rgba(203,213,225,0.8)',
                          background: childActive || isExpanded ? 'rgba(249,115,22,0.15)' : 'transparent',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (!childActive && !isExpanded) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.color = '#ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!childActive && !isExpanded) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(203,213,225,0.8)';
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
                            borderLeft: '2px solid rgba(249,115,22,0.25)',
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
                                    color: active ? '#fdba74' : 'rgba(203,213,225,0.7)',
                                    fontWeight: active ? 600 : 400,
                                    background: active ? 'rgba(249,115,22,0.15)' : 'transparent',
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
                                      e.currentTarget.style.color = 'rgba(203,213,225,0.7)';
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
        <div style={{ padding: '16px 12px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <i className="pi pi-shield" style={{ color: '#f59e0b', fontSize: '0.875rem' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fbbf24' }}>Safety First</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'rgba(199,210,254,0.6)', lineHeight: '1.4' }}>
              Zero incidents is our goal. Report all hazards immediately.
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default VeronaSidebar;
