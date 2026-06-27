import type { ReactNode, CSSProperties } from 'react';

/* ============================================================
   METRIC CARD — Used on all list/dashboard pages
   ============================================================ */
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  gradient: string;
  sub?: string;
  onClick?: () => void;
}

export const MetricCard = ({ label, value, icon, gradient, sub, onClick }: MetricCardProps) => (
  <div
    onClick={onClick}
    style={{
      background: '#fff',
      borderRadius: 14,
      padding: '18px 20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.15s, box-shadow 0.15s',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
    }}
  >
    <div style={{
      width: 42, height: 42, borderRadius: 10,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    }}>
      <i className={`pi ${icon}`} style={{ color: '#fff', fontSize: 18 }} />
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

/* ============================================================
   PAGE HEADER — Dark gradient banner with icon and actions
   ============================================================ */
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: string;
  accentGradient: string;
  actions?: ReactNode;
  style?: CSSProperties;
}

export const PageHeader = ({
  title, subtitle, icon, accentGradient, actions, style,
}: PageHeaderProps) => (
  <div style={{
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    borderRadius: 16,
    padding: '22px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    ...style,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: accentGradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}>
        <i className={icon} style={{ color: '#fff', fontSize: 21 }} />
      </div>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{subtitle}</p>}
      </div>
    </div>
    {actions && (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {actions}
      </div>
    )}
  </div>
);

/* ============================================================
   TABLE CARD — White card wrapper for filter+table
   ============================================================ */
interface TableCardProps {
  children: ReactNode;
  style?: CSSProperties;
}

export const TableCard = ({ children, style }: TableCardProps) => (
  <div style={{
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);

/* ============================================================
   FILTER BAR — Light grey top bar inside TableCard
   ============================================================ */
export const FilterBar = ({ children }: { children: ReactNode }) => (
  <div style={{
    padding: '14px 20px',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  }}>
    {children}
  </div>
);

/* ============================================================
   METRICS GRID — Responsive auto-fit grid for MetricCards
   ============================================================ */
export const MetricsGrid = ({ children }: { children: ReactNode }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 14,
  }}>
    {children}
  </div>
);
