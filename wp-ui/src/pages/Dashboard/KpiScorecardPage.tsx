import { useState, useEffect, useCallback, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PageHeader } from '../../components/ui';
import {
  kpiArsheService,
  scorecardService,
  type ComplianceMetricsResponse,
  type KpiOverallScore,
  type ScorecardComputeResult,
} from '../../services/arsheService';

const statusBg = (s: string) =>
  s === 'baik' ? '#dcfce7' : s === 'cukup' ? '#fef3c7' : '#fee2e2';
const statusFg = (s: string) =>
  s === 'baik' ? '#166534' : s === 'cukup' ? '#92400e' : '#991b1b';
const statusLabel = (s: string) =>
  s === 'baik' ? 'Baik' : s === 'cukup' ? 'Cukup' : 'Kurang';

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 14,
  border: '1px solid #e2e8f0',
  padding: 20,
};

const cardTitle = (title: string) => (
  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{title}</div>
);

const KpiCard = ({
  title, value, unit, target, status, trend,
}: { title: string; value: number | string; unit?: string; target?: number; status?: string; trend?: number }) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 18, border: '1px solid #e2e8f0', flex: '1 1 200px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>{title}</div>
      {status && (
        <span style={{ background: statusBg(status), color: statusFg(status), padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
          {statusLabel(status)}
        </span>
      )}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
      <span style={{ fontSize: 30, fontWeight: 800, color: '#0f172a' }}>{value}</span>
      {unit && <span style={{ fontSize: 14, color: '#64748b' }}>{unit}</span>}
    </div>
    {target != null && (
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Target: {target}{unit ?? ''}</div>
    )}
    {trend != null && (
      <div style={{ fontSize: 12, color: trend >= 0 ? '#10b981' : '#ef4444', marginTop: 4 }}>
        <i className={`pi pi-arrow-${trend >= 0 ? 'up' : 'down'}`} /> {Math.abs(trend)}% vs prev
      </div>
    )}
  </div>
);

const KpiScorecardPage = () => {
  const toast = useRef<Toast>(null);
  const [periodStart, setPeriodStart] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date());
  const [compliance, setCompliance] = useState<ComplianceMetricsResponse | null>(null);
  const [overall, setOverall] = useState<KpiOverallScore | null>(null);
  const [scorecard, setScorecard] = useState<ScorecardComputeResult | null>(null);
  const [trends, setTrends] = useState<{ labels: string[]; ltifr: number[]; trifr: number[] } | null>(null);

  const fmtDate = (d: Date) => d.toISOString().split('T')[0];

  const loadAll = useCallback(async () => {
    const ps = fmtDate(periodStart), pe = fmtDate(periodEnd);
    try {
      const [c, o, s] = await Promise.all([
        kpiArsheService.compliance(ps, pe),
        kpiArsheService.overall(ps, pe),
        scorecardService.compute(ps, pe),
      ]);
      setCompliance(c); setOverall(o); setScorecard(s);
      const trend = await kpiArsheService.trends(6);
      setTrends({ labels: trend.map((t) => t.label), ltifr: trend.map((t) => t.ltifr), trifr: trend.map((t) => t.trifr) });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat KPI' });
    }
  }, [periodStart, periodEnd]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const donutData = overall ? {
    labels: overall.breakdown.map((b) => b.label),
    datasets: [{ data: overall.breakdown.map((b) => b.value), backgroundColor: overall.breakdown.map((b) => b.color), borderWidth: 0 }],
  } : null;

  const donutOptions = { cutout: '70%', plugins: { legend: { position: 'right' as const } }, maintainAspectRatio: false };

  const trendData = trends ? {
    labels: trends.labels,
    datasets: [
      { label: 'TRIFR', data: trends.trifr, borderColor: '#3b82f6', backgroundColor: '#3b82f633', tension: 0.4, fill: false },
      { label: 'LTIFR', data: trends.ltifr, borderColor: '#10b981', backgroundColor: '#10b98133', tension: 0.4, fill: false },
    ],
  } : null;

  const trendOptions = { maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const } }, scales: { y: { beginAtZero: true } } };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="KPI & Scorecard"
        subtitle="Monitor performa keselamatan kerja melalui indikator TRIFR, LTIFR, kepatuhan inspeksi, dan pelatihan"
        icon="pi pi-chart-bar"
        accentGradient="linear-gradient(135deg, #3b82f6, #1d4ed8)"
        actions={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Periode:</span>
            <Calendar
              value={periodStart} onChange={(e) => setPeriodStart(e.value as Date)}
              dateFormat="yy-mm-dd" className="w-9rem"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>—</span>
            <Calendar
              value={periodEnd} onChange={(e) => setPeriodEnd(e.value as Date)}
              dateFormat="yy-mm-dd" className="w-9rem"
            />
            <Button
              icon="pi pi-refresh" onClick={loadAll} rounded
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            />
          </div>
        }
      />

      <TabView>
        {/* ===== OVERVIEW TAB ===== */}
        <TabPanel header="Overview">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <KpiCard title="TRIFR" value={overall?.kpis.find((k) => k.code === 'TRIFR')?.value ?? '-'} target={0.5}
                status={overall && overall.kpis.find((k) => k.code === 'TRIFR')
                  ? (overall.kpis.find((k) => k.code === 'TRIFR')!.normalized >= 90 ? 'baik' : overall.kpis.find((k) => k.code === 'TRIFR')!.normalized >= 70 ? 'cukup' : 'kurang')
                  : undefined} />
              <KpiCard title="LTIFR" value={overall?.kpis.find((k) => k.code === 'LTIFR')?.value ?? '-'} target={0.25}
                status={overall && overall.kpis.find((k) => k.code === 'LTIFR')
                  ? (overall.kpis.find((k) => k.code === 'LTIFR')!.normalized >= 90 ? 'baik' : overall.kpis.find((k) => k.code === 'LTIFR')!.normalized >= 70 ? 'cukup' : 'kurang')
                  : undefined} />
              <KpiCard title="Hazard Closure" value={compliance?.hazard_closure.value ?? '-'} unit="%" target={90} status={compliance?.hazard_closure.status} />
              <KpiCard title="CAR Closure" value={compliance?.car_closure.value ?? '-'} unit="%" target={90} status={compliance?.car_closure.status} />
              <KpiCard title="Inspection Compliance" value={compliance?.inspection_compliance.value ?? '-'} unit="%" target={95} status={compliance?.inspection_compliance.status} />
              <KpiCard title="Safety Training" value={compliance?.training_compliance.value ?? '-'} unit="%" target={90} status={compliance?.training_compliance.status} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ ...cardStyle, flex: '2 1 540px' }}>
                {cardTitle('Trend KPI Utama (6 Bulan)')}
                <div style={{ height: 280 }}>
                  {trendData && <Chart type="line" data={trendData} options={trendOptions} style={{ height: '100%' }} />}
                </div>
              </div>
              <div style={{ ...cardStyle, flex: '1 1 300px' }}>
                {cardTitle('KPI Overall Score')}
                {overall && donutData ? (
                  <div>
                    <div style={{ position: 'relative', height: 220 }}>
                      <Chart type="doughnut" data={donutData} options={donutOptions} />
                      <div style={{ position: 'absolute', top: '50%', left: '42%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>{overall.overall_score}%</div>
                        <span style={{ background: statusBg(overall.overall_status), color: statusFg(overall.overall_status), padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                          {statusLabel(overall.overall_status)}
                        </span>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginTop: 12, fontSize: 13, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total KPI</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{overall.kpi_count} KPI</span>
                    </div>
                  </div>
                ) : <div style={{ height: 220 }} />}
              </div>
            </div>
          </div>
        </TabPanel>

        {/* ===== SCORECARD TAB ===== */}
        <TabPanel header="Scorecard">
          {scorecard && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ ...cardStyle, flex: '1 1 480px' }}>
                {cardTitle('Scorecard KPI per Perspektif')}
                <DataTable value={scorecard.perspectives} stripedRows size="small">
                  <Column field="name" header="Perspektif" style={{ width: '30%' }} />
                  <Column header="Bobot" body={(r) => `${r.weight}%`} style={{ width: '12%' }} />
                  <Column header="Skor" body={(r) => `${r.score}%`} style={{ width: '12%' }} />
                  <Column header="Pencapaian" body={(r) => (
                    <ProgressBar value={r.score} showValue={false} color={r.score >= 90 ? '#10b981' : r.score >= 70 ? '#f59e0b' : '#ef4444'} style={{ height: 10, borderRadius: 5 }} />
                  )} style={{ width: '30%' }} />
                  <Column header="Status" body={(r) => (
                    <Tag value={statusLabel(r.status)} style={{ background: statusBg(r.status), color: statusFg(r.status) }} />
                  )} style={{ width: '16%' }} />
                </DataTable>
                <div style={{ borderTop: '2px solid #0f172a', marginTop: 14, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 13 }}>
                  <span>Total Overall Score</span>
                  <span>{scorecard.overall}% — {statusLabel(scorecard.overall_status)}</span>
                </div>
              </div>

              <div style={{ ...cardStyle, flex: '1 1 480px' }}>
                {cardTitle('KPI Detail')}
                <DataTable
                  value={scorecard.perspectives.flatMap((p) => p.kpis.map((k) => ({ ...k, perspective: p.name })))}
                  stripedRows size="small"
                >
                  <Column field="metric_name" header="KPI" style={{ width: '28%' }} />
                  <Column header="Target" body={(r) => `${r.target ?? '-'} ${r.unit ?? ''}`} style={{ width: '14%' }} />
                  <Column header="Realisasi" body={(r) => `${r.value ?? '-'} ${r.unit ?? ''}`} style={{ width: '14%' }} />
                  <Column header="Pencapaian" body={(r) => `${Math.round(r.score)}%`} style={{ width: '14%' }} />
                  <Column header="Status" body={(r) => {
                    const st = r.score >= 90 ? 'baik' : r.score >= 70 ? 'cukup' : 'kurang';
                    return <Tag value={statusLabel(st)} style={{ background: statusBg(st), color: statusFg(st) }} />;
                  }} style={{ width: '14%' }} />
                  <Column header="Bobot" body={(r) => `${r.weight}%`} style={{ width: '12%' }} />
                </DataTable>
              </div>
            </div>
          )}
        </TabPanel>

        {/* ===== TREND ANALYSIS TAB ===== */}
        <TabPanel header="Trend Analysis">
          <div style={cardStyle}>
            {cardTitle('Trend KPI Lagging Indicators (6 Bulan)')}
            <div style={{ height: 360 }}>
              {trendData && <Chart type="line" data={trendData} options={trendOptions} style={{ height: '100%' }} />}
            </div>
          </div>
        </TabPanel>

        {/* ===== BENCHMARK TAB ===== */}
        <TabPanel header="Benchmark">
          <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#e2e8f0,#cbd5e1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="pi pi-chart-bar" style={{ fontSize: 28, color: '#94a3b8' }} />
            </div>
            <h3 style={{ margin: '0 0 8px', color: '#334155', fontSize: 18 }}>Benchmark Module</h3>
            <p style={{ maxWidth: 400, margin: '0 auto', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
              Bandingkan kinerja KPI antar lokasi, departemen, atau periode. Modul ini akan tersedia di Phase 3.
            </p>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default KpiScorecardPage;
