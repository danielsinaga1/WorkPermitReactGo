import { useState, useEffect, useCallback, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { MetricCard, MetricsGrid, PageHeader } from '../../../components/ui';
import { hseDashboardService } from '../../../services/hseDashboardService';
import type {
  DashboardOverview,
  LeadingIndicatorsResponse,
  TrendDataPoint,
  RiskLevel,
} from '../../../types/workPermitTypes';

const riskLevelColor = (level: RiskLevel) => {
  switch (level) {
    case 'low': return 'success';
    case 'medium': return 'warning';
    case 'high': return 'danger';
    case 'extreme': return 'danger';
    default: return 'info';
  }
};

const riskScoreColor = (level: RiskLevel) => {
  switch (level) {
    case 'low': return '#22c55e';
    case 'medium': return '#f59e0b';
    case 'high': return '#ef4444';
    case 'extreme': return '#7c3aed';
    default: return '#64748b';
  }
};

const PERIOD_OPTIONS = [
  { label: 'Last 6 Months', value: 6 },
  { label: 'Last 12 Months', value: 12 },
  { label: 'Last 18 Months', value: 18 },
];

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  border: '1px solid #e2e8f0',
  padding: 20,
};

const WpHseDashboard = () => {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [indicators, setIndicators] = useState<LeadingIndicatorsResponse | null>(null);
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [months, setMonths] = useState(12);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, ind, tr] = await Promise.all([
        hseDashboardService.overview(),
        hseDashboardService.leadingIndicators(),
        hseDashboardService.trends({ months }),
      ]);
      setOverview(ov);
      setIndicators(ind);
      setTrends(tr);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const kpiCards = overview
    ? [
        { label: 'Active Permits', value: overview.permits.active, icon: 'pi-file-edit', gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)', sub: `${overview.permits.total} total` },
        { label: 'Open Incidents', value: overview.incidents.open, icon: 'pi-exclamation-triangle', gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', sub: `${overview.incidents.total} total` },
        { label: 'Overdue Actions', value: overview.corrective_actions.overdue, icon: 'pi-clock', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', sub: `${overview.corrective_actions.total} total` },
        { label: 'Active LOTO', value: overview.loto.active_locks, icon: 'pi-lock', gradient: 'linear-gradient(135deg,#14b8a6,#0d9488)' },
        { label: 'TBM Completed', value: overview.toolbox_meetings.completed, icon: 'pi-users', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', sub: `${overview.toolbox_meetings.total} total` },
        { label: 'Open Observations', value: overview.observations.open, icon: 'pi-eye', gradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)', sub: `${overview.observations.total} total` },
      ]
    : [];

  const trendChartData = {
    labels: trends.map((t) => t.period),
    datasets: [
      { label: 'Permits', data: trends.map((t) => t.permits), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', fill: true, tension: 0.4, pointRadius: 3 },
      { label: 'Incidents', data: trends.map((t) => t.incidents), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', fill: true, tension: 0.4, pointRadius: 3 },
      { label: 'Near Misses', data: trends.map((t) => t.near_misses), borderColor: '#f59e0b', fill: false, tension: 0.4 },
      { label: 'Observations', data: trends.map((t) => t.observations), borderColor: '#14b8a6', fill: false, tension: 0.4 },
    ],
  };

  const trendChartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { font: { size: 12 } } } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f1f5f9' } } },
  };

  const permitPieData = overview
    ? {
        labels: overview.permits.by_priority.map((p) => p.priority.toUpperCase()),
        datasets: [{ data: overview.permits.by_priority.map((p) => p.total), backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#7c3aed'], borderWidth: 0, hoverOffset: 6 }],
      }
    : { labels: [], datasets: [] };

  const incidentBarData = overview
    ? {
        labels: overview.incidents.by_severity.map((s) => s.severity),
        datasets: [{ label: 'Incidents', data: overview.incidents.by_severity.map((s) => s.total), backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#7c3aed'], borderRadius: 6, barPercentage: 0.6 }],
      }
    : { labels: [], datasets: [] };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const result = await hseDashboardService.exportReport({ report_type: 'dashboard_summary', format });
      toast.current?.show({ severity: 'info', summary: 'Export Queued', detail: `Report #${result.id} is being generated (${format.toUpperCase()})` });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to queue export' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Work Permit & HSE Dashboard"
        subtitle="Safety performance overview and leading indicators"
        icon="pi pi-shield"
        accentGradient="linear-gradient(135deg, #f59e0b, #ef4444)"
        actions={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Dropdown value={months} options={PERIOD_OPTIONS} onChange={(e) => setMonths(e.value)}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              className="w-11rem"
            />
            <Button icon="pi pi-file-pdf" label="PDF" size="small"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              onClick={() => handleExport('pdf')} />
            <Button icon="pi pi-file-excel" label="Excel" size="small"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
              onClick={() => handleExport('excel')} />
            <Button icon="pi pi-refresh" size="small"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
              onClick={loadDashboard} loading={loading} tooltip="Refresh" />
          </div>
        }
      />

      <MetricsGrid>
        {kpiCards.map((kpi, i) => (
          <MetricCard key={i} label={kpi.label} value={kpi.value} icon={kpi.icon} gradient={kpi.gradient} sub={kpi.sub} />
        ))}
      </MetricsGrid>

      {indicators && (
        <div className="grid">
          <div className="col-12 lg:col-4">
            <div style={{ ...cardStyle, height: '100%' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Overall Risk Score</div>
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <span style={{ fontSize: 56, fontWeight: 800, color: riskScoreColor(indicators.risk_level), lineHeight: 1 }}>
                  {indicators.risk_score}
                </span>
                <span style={{ fontSize: 18, color: '#94a3b8' }}>/100</span>
                <div style={{ marginTop: 10 }}>
                  <Tag value={indicators.risk_level.toUpperCase()} severity={riskLevelColor(indicators.risk_level)} />
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Recommendations</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {indicators.recommendations.map((r, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <i className="pi pi-info-circle" style={{ color: '#3b82f6', fontSize: 12, marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 lg:col-8">
            <div style={{ ...cardStyle, height: '100%' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Safety Leading Indicators</div>
              <div className="grid">
                {indicators.indicators.map((ind, i) => (
                  <div key={i} className="col-12 md:col-6" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{ind.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{ind.value}{ind.unit === '%' ? '%' : ` ${ind.unit}`}</span>
                        <i
                          className={`pi pi-arrow-${ind.trend === 'up' ? 'up' : ind.trend === 'down' ? 'down' : 'right'}`}
                          style={{ fontSize: 10, color: ind.trend === 'up' ? '#22c55e' : ind.trend === 'down' ? '#ef4444' : '#64748b' }}
                        />
                      </div>
                    </div>
                    <ProgressBar
                      value={Math.min(100, (ind.value / ind.target) * 100)}
                      showValue={false}
                      style={{ height: 8, borderRadius: 4 }}
                      color={ind.value >= ind.target ? '#22c55e' : ind.value >= ind.target * 0.7 ? '#f59e0b' : '#ef4444'}
                    />
                    <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' }}>Target: {ind.target}{ind.unit === '%' ? '%' : ` ${ind.unit}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid">
        <div className="col-12 lg:col-8">
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Monthly Trends</div>
            <div style={{ height: 350 }}>
              <Chart type="line" data={trendChartData} options={trendChartOptions} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
        <div className="col-12 lg:col-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
            <div style={{ ...cardStyle, flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Permits by Priority</div>
              <Chart type="doughnut" data={permitPieData} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom' as const } } }} />
            </div>
            <div style={{ ...cardStyle, flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Incidents by Severity</div>
              <Chart type="bar" data={incidentBarData} options={{ maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f1f5f9' } } } }} />
            </div>
          </div>
        </div>
      </div>

      {overview && (overview.alerts.expiring_personnel_certs > 0 || overview.alerts.expiring_equipment_certs > 0 || overview.alerts.expired_personnel_certs > 0) && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <i className="pi pi-exclamation-triangle" style={{ color: '#f97316' }} />
            <span style={{ fontWeight: 700, color: '#9a3412', fontSize: 14 }}>Alerts &amp; Warnings</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {overview.alerts.expired_personnel_certs > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="pi pi-exclamation-circle" style={{ color: '#ef4444', fontSize: 13 }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{overview.alerts.expired_personnel_certs} sertifikasi personel kedaluwarsa</span>
              </div>
            )}
            {overview.alerts.expiring_personnel_certs > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="pi pi-exclamation-triangle" style={{ color: '#f97316', fontSize: 13 }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{overview.alerts.expiring_personnel_certs} sertifikasi personel akan segera berakhir</span>
              </div>
            )}
            {overview.alerts.expiring_equipment_certs > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="pi pi-exclamation-triangle" style={{ color: '#f97316', fontSize: 13 }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{overview.alerts.expiring_equipment_certs} sertifikasi peralatan akan segera berakhir</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WpHseDashboard;
