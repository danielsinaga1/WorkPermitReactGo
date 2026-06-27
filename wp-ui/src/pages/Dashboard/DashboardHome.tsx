import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
import { MetricCard, MetricsGrid } from '../../components/ui';
import { hseDashboardService } from '../../services/hseDashboardService';
import {
  dashboardWidgetsService,
  kpiArsheService,
  type ActivityFeedItem,
  type DocumentItem,
  type IncidentByClass,
} from '../../services/arsheService';
import type {
  DashboardOverview,
  LeadingIndicatorsResponse,
  TrendDataPoint,
  RiskLevel,
} from '../../types/workPermitTypes';

/* ============================================================
   HELPERS
   ============================================================ */
const riskColor = (level: RiskLevel) => {
  switch (level) {
    case 'low': return '#22c55e';
    case 'medium': return '#f59e0b';
    case 'high': return '#ef4444';
    case 'extreme': return '#7c3aed';
    default: return '#64748b';
  }
};

const riskSeverity = (level: RiskLevel) => {
  switch (level) {
    case 'low': return 'success';
    case 'medium': return 'warning';
    case 'high': return 'danger';
    case 'extreme': return 'danger';
    default: return 'info';
  }
};

const PERIOD_OPTIONS = [
  { label: 'Last 6 Months', value: 6 },
  { label: 'Last 12 Months', value: 12 },
  { label: 'Last 18 Months', value: 18 },
  { label: 'Last 24 Months', value: 24 },
];

/* ============================================================
   KPI DATA TYPE
   ============================================================ */
interface KpiData {
  label: string;
  value: number | string;
  icon: string;
  gradient: string;
  route?: string;
  subtitle?: string;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const DashboardHome = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [indicators, setIndicators] = useState<LeadingIndicatorsResponse | null>(null);
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [months, setMonths] = useState(12);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [recentDocs, setRecentDocs] = useState<DocumentItem[]>([]);
  const [incidentByClass, setIncidentByClass] = useState<IncidentByClass | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, ind, tr, feed, docs, byClass] = await Promise.all([
        hseDashboardService.overview(),
        hseDashboardService.leadingIndicators(),
        hseDashboardService.trends({ months }),
        dashboardWidgetsService.activityFeed(8).catch(() => []),
        dashboardWidgetsService.recentDocuments(5).catch(() => []),
        kpiArsheService.incidentByClass().catch(() => null),
      ]);
      setOverview(ov);
      setIndicators(ind);
      setTrends(tr);
      setActivityFeed(feed);
      setRecentDocs(docs);
      setIncidentByClass(byClass);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load dashboard data', life: 4000 });
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  /* ---- KPI data ---- */
  const kpiCards: KpiData[] = overview
    ? [
        { label: 'Active Permits', value: overview.permits.active, icon: 'pi-file-edit', gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)', route: '/dashboard/work-permits', subtitle: `${overview.permits.total} total` },
        { label: 'Open Incidents', value: overview.incidents.open, icon: 'pi-exclamation-triangle', gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', route: '/dashboard/hse/incidents', subtitle: `${overview.incidents.total} total` },
        { label: 'Overdue Actions', value: overview.corrective_actions.overdue, icon: 'pi-clock', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', route: '/dashboard/hse/corrective-actions', subtitle: `${overview.corrective_actions.total} total` },
        { label: 'Active LOTO', value: overview.loto.active_locks, icon: 'pi-lock', gradient: 'linear-gradient(135deg,#14b8a6,#0d9488)', route: '/dashboard/loto' },
        { label: 'TBM Completed', value: overview.toolbox_meetings.completed, icon: 'pi-users', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', route: '/dashboard/hse/toolbox-meetings', subtitle: `${overview.toolbox_meetings.total} total` },
        { label: 'Open Observations', value: overview.observations.open, icon: 'pi-eye', gradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)', route: '/dashboard/hse/observations', subtitle: `${overview.observations.total} total` },
      ]
    : [];

  /* ---- Trend Chart ---- */
  const trendChartData = {
    labels: trends.map((t) => t.period),
    datasets: [
      { label: 'Permits', data: trends.map((t) => t.permits), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6 },
      { label: 'Incidents', data: trends.map((t) => t.incidents), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6 },
      { label: 'Near Misses', data: trends.map((t) => t.near_misses), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6 },
      { label: 'Observations', data: trends.map((t) => t.observations), borderColor: '#14b8a6', backgroundColor: 'rgba(20,184,166,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6 },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true, font: { family: 'Inter', size: 12 } } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter', size: 11 } } },
    },
  };

  /* ---- Permit Priority Doughnut ---- */
  const permitPieData = overview
    ? {
        labels: overview.permits.by_priority.map((p) => p.priority.charAt(0).toUpperCase() + p.priority.slice(1)),
        datasets: [{
          data: overview.permits.by_priority.map((p) => p.total),
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#7c3aed'],
          borderWidth: 0,
          hoverOffset: 8,
        }],
      }
    : { labels: [], datasets: [] };

  /* ---- Incident Severity Bar ---- */
  const incidentBarData = overview
    ? {
        labels: overview.incidents.by_severity.map((s) => s.severity.charAt(0).toUpperCase() + s.severity.slice(1)),
        datasets: [{
          label: 'Incidents',
          data: overview.incidents.by_severity.map((s) => s.total),
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#7c3aed'],
          borderRadius: 6,
          barPercentage: 0.6,
        }],
      }
    : { labels: [], datasets: [] };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const result = await hseDashboardService.exportReport({ report_type: 'dashboard_summary', format });
      toast.current?.show({ severity: 'info', summary: 'Export Queued', detail: `Report #${result.id} is being generated (${format.toUpperCase()})`, life: 4000 });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to queue export' });
    }
  };

  /* ---- Skeleton loading ---- */
  const renderSkeleton = () => (
    <div className="flex flex-column gap-4">
      <div className="grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="col-12 md:col-6 lg:col-4 xl:col-2">
            <Skeleton width="100%" height="110px" borderRadius="12px" />
          </div>
        ))}
      </div>
      <div className="grid">
        <div className="col-12 lg:col-8"><Skeleton width="100%" height="400px" borderRadius="12px" /></div>
        <div className="col-12 lg:col-4"><Skeleton width="100%" height="400px" borderRadius="12px" /></div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      {/* ============ PAGE HEADER ============ */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 16,
        padding: '22px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            <i className="pi pi-shield" style={{ color: '#fff', fontSize: 21 }} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
              Work Permit &amp; HSE Dashboard
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Safety performance overview and leading indicators
            </p>
          </div>
        </div>
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
      </div>

      {loading ? renderSkeleton() : (
        <>
          {/* ============ KPI CARDS ============ */}
          <MetricsGrid>
            {kpiCards.map((kpi, i) => (
              <MetricCard
                key={i}
                label={kpi.label}
                value={kpi.value}
                icon={kpi.icon}
                gradient={kpi.gradient}
                sub={kpi.subtitle}
                onClick={kpi.route ? () => navigate(kpi.route!) : undefined}
              />
            ))}
          </MetricsGrid>

          {/* ============ RISK SCORE + LEADING INDICATORS ============ */}
          {indicators && (
            <div className="grid">
              <div className="col-12 lg:col-4">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, height: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Risk Score</span>
                    <div style={{ margin: '12px 0 8px' }}>
                      <span style={{ fontSize: 56, fontWeight: 800, color: riskColor(indicators.risk_level), lineHeight: 1 }}>
                        {indicators.risk_score}
                      </span>
                      <span style={{ fontSize: 18, color: '#94a3b8' }}>/100</span>
                    </div>
                    <Tag value={indicators.risk_level.toUpperCase()} severity={riskSeverity(indicators.risk_level)} />
                  </div>
                  {indicators.recommendations.length > 0 && (
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Rekomendasi</span>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {indicators.recommendations.slice(0, 3).map((r, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <i className="pi pi-info-circle" style={{ color: '#3b82f6', fontSize: 12, marginTop: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 lg:col-8">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, height: '100%' }}>
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
                          style={{ height: '8px', borderRadius: '4px' }}
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

          {/* ============ CHARTS ROW ============ */}
          <div className="grid">
            <div className="col-12 lg:col-8">
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, height: '100%' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Monthly Trends</div>
                <div style={{ height: '350px' }}>
                  <Chart type="line" data={trendChartData} options={trendChartOptions} style={{ height: '100%' }} />
                </div>
              </div>
            </div>
            <div className="col-12 lg:col-4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Permits by Priority</div>
                  <Chart type="doughnut" data={permitPieData} options={{ maintainAspectRatio: true, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 11 } } } } }} />
                </div>
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Incidents by Severity</div>
                  <Chart type="bar" data={incidentBarData} options={{ maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f1f5f9' } } } }} />
                </div>
              </div>
            </div>
          </div>

          {/* ============ ALERTS ============ */}
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

          {/* ============ ARSHE GAP CLOSURE WIDGETS ============ */}
          <div className="grid">
            <div className="col-12 lg:col-4">
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, height: '100%' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Incident Berdasarkan Kelas</div>
                {incidentByClass && incidentByClass.total > 0 ? (
                  <div>
                    <div style={{ position: 'relative', height: 240 }}>
                      <Chart
                        type="doughnut"
                        data={{
                          labels: incidentByClass.breakdown.map((b) => b.class),
                          datasets: [{
                            data: incidentByClass.breakdown.map((b) => b.value),
                            backgroundColor: incidentByClass.breakdown.map((b) => b.color),
                            borderWidth: 0,
                          }],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          cutout: '65%',
                          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
                        }}
                      />
                      <div style={{
                        position: 'absolute', top: '40%', left: '50%',
                        transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none',
                      }}>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Total</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{incidentByClass.total}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, fontSize: 12 }}>
                      {incidentByClass.breakdown.map((b) => (
                        <div key={b.class} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: b.color, borderRadius: 2, marginRight: 6 }} />{b.class}</span>
                          <span style={{ color: '#64748b' }}>{b.value} ({b.percent}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 13 }}>
                    Belum ada data insiden 6 bulan terakhir
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 lg:col-4">
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, height: '100%' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Aktivitas Terbaru</div>
                {activityFeed.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 13 }}>
                    Belum ada aktivitas
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 360, overflowY: 'auto' }}>
                    {activityFeed.map((ev, i) => (
                      <button
                        key={i}
                        onClick={() => navigate(ev.reference)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: 10,
                          border: '1px solid #f1f5f9', borderRadius: 8, background: '#fff',
                          cursor: 'pointer', textAlign: 'left', width: '100%',
                        }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: `${ev.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <i className={`pi ${ev.icon}`} style={{ color: ev.color, fontSize: 14 }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                          <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.subtitle}</div>
                        </div>
                        <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>{ev.relative}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 lg:col-4">
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, height: '100%' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Dokumen Terbaru</div>
                {recentDocs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 13 }}>
                    Belum ada dokumen
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {recentDocs.map((d) => {
                      const t = (d.file_type ?? '').toLowerCase();
                      const icon = t === 'pdf' ? 'pi-file-pdf' : ['xls', 'xlsx', 'csv'].includes(t) ? 'pi-file-excel' : ['doc', 'docx'].includes(t) ? 'pi-file-word' : 'pi-file';
                      const color = t === 'pdf' ? '#dc2626' : ['xls', 'xlsx', 'csv'].includes(t) ? '#16a34a' : ['doc', 'docx'].includes(t) ? '#2563eb' : '#64748b';
                      return (
                        <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid #f1f5f9', borderRadius: 8 }}>
                          <i className={`pi ${icon}`} style={{ color, fontSize: 18, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{d.category.replace(/_/g, ' ').toUpperCase()} • v{d.version}</div>
                          </div>
                          <Button
                            icon="pi pi-download"
                            rounded text size="small"
                            onClick={() => d.file_path && window.open(d.file_path, '_blank')}
                          />
                        </div>
                      );
                    })}
                    <Button label="Lihat Semua" text size="small" icon="pi pi-arrow-right" iconPos="right" onClick={() => navigate('/dashboard/documents')} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============ PERMIT TABLE + QUICK ACTIONS ============ */}
          {overview && (
            <div className="grid">
              <div className="col-12 lg:col-7">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Distribusi Status Permit</div>
                  <DataTable
                    value={overview.permits.by_priority.map((p) => ({
                      priority: p.priority.charAt(0).toUpperCase() + p.priority.slice(1),
                      total: p.total,
                    }))}
                    stripedRows size="small"
                  >
                    <Column field="priority" header="Priority" body={(r) => (
                      <Tag value={r.priority} severity={r.priority === 'Critical' ? 'danger' : r.priority === 'High' ? 'danger' : r.priority === 'Medium' ? 'warning' : 'success'} />
                    )} />
                    <Column field="total" header="Total Permits" />
                  </DataTable>
                  {overview.incidents.by_severity.length > 0 && (
                    <>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', margin: '16px 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Incident Severity Breakdown</div>
                      <DataTable
                        value={overview.incidents.by_severity.map((s) => ({
                          severity: s.severity.charAt(0).toUpperCase() + s.severity.slice(1),
                          total: s.total,
                        }))}
                        stripedRows size="small"
                      >
                        <Column field="severity" header="Severity" body={(r) => (
                          <Tag value={r.severity} severity={r.severity === 'Catastrophic' || r.severity === 'Major' ? 'danger' : r.severity === 'Moderate' ? 'warning' : 'success'} />
                        )} />
                        <Column field="total" header="Count" />
                      </DataTable>
                    </>
                  )}
                </div>
              </div>
              <div className="col-12 lg:col-5">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, height: '100%' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Quick Actions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Create New Permit', icon: 'pi pi-plus', path: '/dashboard/work-permits/create', color: '#6366f1' },
                      { label: 'Report Incident', icon: 'pi pi-exclamation-triangle', path: '/dashboard/hse/incidents', color: '#ef4444' },
                      { label: 'Log Observation', icon: 'pi pi-eye', path: '/dashboard/hse/observations', color: '#0ea5e9' },
                      { label: 'Schedule TBM', icon: 'pi pi-calendar', path: '/dashboard/hse/toolbox-meetings', color: '#8b5cf6' },
                      { label: 'View LOTO', icon: 'pi pi-lock', path: '/dashboard/loto', color: '#14b8a6' },
                      { label: 'Corrective Actions', icon: 'pi pi-check-square', path: '/dashboard/hse/corrective-actions', color: '#f59e0b' },
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate(action.path)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                          borderRadius: 10, border: '1px solid #e2e8f0', background: '#ffffff',
                          cursor: 'pointer', textAlign: 'left', width: '100%',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = action.color; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${action.color}15` }}>
                          <i className={action.icon} style={{ color: action.color, fontSize: 15 }} />
                        </div>
                        <span style={{ fontWeight: 500, color: '#334155', fontSize: 14 }}>{action.label}</span>
                        <i className="pi pi-chevron-right" style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 11 }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardHome;
