import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { Timeline } from 'primereact/timeline';

/* ============================================================
   TYPE DEFINITIONS
   ============================================================ */
interface KpiCard {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
  bg: string;
}

interface SubsektorRow {
  name: string;
  pelaku: string;
  growth: string;
  kontribusi: string;
}

interface ActivityEvent {
  icon: string;
  color: string;
  title: string;
  description: string;
  time: string;
}

/* ============================================================
   STATIC DATA
   ============================================================ */
const kpiCards: KpiCard[] = [
  { label: 'Total Pelaku Ekraf', value: '12,450', delta: '+8.5%', trend: 'up', icon: 'pi pi-users', color: '#6366f1', bg: '#eef2ff' },
  { label: 'Total UMKM', value: '8,234', delta: '+4.35%', trend: 'up', icon: 'pi pi-shopping-bag', color: '#14b8a6', bg: '#f0fdfa' },
  { label: 'Subsektor Aktif', value: '17', delta: '+2.59%', trend: 'up', icon: 'pi pi-th-large', color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Pengunjung Website', value: '56.8K', delta: '-1.2%', trend: 'down', icon: 'pi pi-globe', color: '#ef4444', bg: '#fef2f2' },
];

const subsektorData: SubsektorRow[] = [
  { name: 'Film & Animasi', pelaku: '1,245', growth: '+12.5%', kontribusi: '18%' },
  { name: 'Kuliner', pelaku: '3,567', growth: '+8.3%', kontribusi: '28%' },
  { name: 'Fashion', pelaku: '2,134', growth: '+6.7%', kontribusi: '16%' },
  { name: 'Musik', pelaku: '987', growth: '+15.2%', kontribusi: '12%' },
  { name: 'Kriya', pelaku: '1,456', growth: '+4.8%', kontribusi: '11%' },
];

const activityEvents: ActivityEvent[] = [
  { icon: 'pi pi-user-plus', color: '#6366f1', title: 'Pelaku UMKM baru terdaftar', description: 'PT Kreatif Indonesia — Subsektor Film', time: '5 menit lalu' },
  { icon: 'pi pi-check-circle', color: '#22c55e', title: 'Verifikasi data berhasil', description: 'Data statistik Q4 2025 telah diverifikasi', time: '1 jam lalu' },
  { icon: 'pi pi-megaphone', color: '#f59e0b', title: 'Pengumuman dipublikasi', description: 'Pendaftaran program pelatihan EKRAF 2026', time: '3 jam lalu' },
  { icon: 'pi pi-chart-bar', color: '#ef4444', title: 'Laporan statistik diunggah', description: 'Laporan bulanan Desember 2025', time: '5 jam lalu' },
  { icon: 'pi pi-file-edit', color: '#8b5cf6', title: 'Berita baru dipublikasi', description: 'Perkembangan Ekraf di Indonesia 2026', time: '8 jam lalu' },
];

/* ============================================================
   CHART OPTIONS
   ============================================================ */
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Pelaku Baru',
      data: [320, 480, 410, 690, 520, 740, 810, 650, 890, 780, 920, 1050],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
    },
    {
      label: 'UMKM Aktif',
      data: [210, 350, 290, 480, 390, 510, 590, 460, 630, 550, 680, 750],
      borderColor: '#14b8a6',
      backgroundColor: 'rgba(20,184,166,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
    },
  ],
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { usePointStyle: true, font: { family: 'Inter', size: 12 } } },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
    y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter', size: 11 } } },
  },
};

const barChartData = {
  labels: ['Film', 'Kuliner', 'Fashion', 'Musik', 'Kriya', 'Desain', 'Seni Rupa'],
  datasets: [
    {
      label: 'Jumlah Pelaku',
      data: [1245, 3567, 2134, 987, 1456, 756, 543],
      backgroundColor: ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'],
      borderRadius: 8,
      barPercentage: 0.6,
    },
  ],
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
    y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter', size: 11 } } },
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */
const DashboardHome = () => {
  const navigate = useNavigate();

  const growthBodyTemplate = (row: SubsektorRow) => (
    <Tag
      value={row.growth}
      severity={row.growth.startsWith('+') ? 'success' : 'danger'}
      className="text-xs font-semibold"
    />
  );

  const kontribusiBodyTemplate = (row: SubsektorRow) => (
    <div className="flex align-items-center gap-2">
      <div
        className="border-round-lg"
        style={{ width: `${parseInt(row.kontribusi)}%`, minWidth: '8px', height: '8px', background: '#6366f1' }}
      />
      <span className="text-sm font-medium text-700">{row.kontribusi}</span>
    </div>
  );

  const timelineMarker = (item: ActivityEvent) => (
    <span
      className="flex align-items-center justify-content-center border-circle"
      style={{ width: '2.25rem', height: '2.25rem', background: item.color + '18', color: item.color }}
    >
      <i className={item.icon} style={{ fontSize: '0.875rem' }} />
    </span>
  );

  const timelineContent = (item: ActivityEvent) => (
    <div className="mb-3">
      <span className="text-sm font-semibold text-800">{item.title}</span>
      <p className="text-xs text-500 mt-1 line-height-3">{item.description}</p>
      <span className="text-xs text-400">{item.time}</span>
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      {/* Page Header */}
      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Dashboard Ekonomi Kreatif</h2>
          <p className="text-sm text-500 mt-1 mb-0">Ringkasan data dan aktivitas terbaru</p>
        </div>
        <Button
          label="Lihat Laporan"
          icon="pi pi-file-export"
          severity="secondary"
          outlined
          className="border-round-xl"
          onClick={() => navigate('/dashboard/laporan/realisasi-anggaran')}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="col-12 md:col-6 xl:col-3">
            <div
              className="surface-card border-round-xl p-4 shadow-1 flex align-items-start justify-content-between h-full"
              style={{ borderLeft: `4px solid ${kpi.color}` }}
            >
              <div className="flex flex-column gap-2">
                <span className="text-xs font-medium text-500 uppercase letter-spacing-1">{kpi.label}</span>
                <span className="text-2xl font-bold text-900">{kpi.value}</span>
                <span
                  className={`text-xs font-semibold ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
                >
                  <i className={`pi ${kpi.trend === 'up' ? 'pi-arrow-up' : 'pi-arrow-down'} text-xs mr-1`} />
                  {kpi.delta}
                </span>
              </div>
              <div
                className="flex align-items-center justify-content-center border-round-xl"
                style={{ width: '3rem', height: '3rem', background: kpi.bg }}
              >
                <i className={kpi.icon} style={{ fontSize: '1.25rem', color: kpi.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid">
        <div className="col-12 lg:col-8">
          <Card title="Pertumbuhan Pelaku & UMKM" className="shadow-1 border-round-xl h-full">
            <div style={{ height: '320px' }}>
              <Chart type="line" data={lineChartData} options={lineChartOptions} className="h-full" />
            </div>
          </Card>
        </div>
        <div className="col-12 lg:col-4">
          <Card title="Per Subsektor" className="shadow-1 border-round-xl h-full">
            <div style={{ height: '320px' }}>
              <Chart type="bar" data={barChartData} options={barChartOptions} className="h-full" />
            </div>
          </Card>
        </div>
      </div>

      {/* Table & Activity Row */}
      <div className="grid">
        {/* Subsektor DataTable */}
        <div className="col-12 lg:col-7">
          <Card title="Statistik Subsektor" className="shadow-1 border-round-xl">
            <DataTable
              value={subsektorData}
              size="small"
              stripedRows
              responsiveLayout="scroll"
              className="border-round-lg"
            >
              <Column field="name" header="Subsektor" className="font-medium" />
              <Column field="pelaku" header="Pelaku" alignHeader="center" bodyClassName="text-center" />
              <Column header="Pertumbuhan" body={growthBodyTemplate} alignHeader="center" bodyClassName="text-center" />
              <Column header="Kontribusi" body={kontribusiBodyTemplate} />
            </DataTable>
          </Card>
        </div>

        {/* Activity Timeline */}
        <div className="col-12 lg:col-5">
          <Card title="Aktivitas Terbaru" className="shadow-1 border-round-xl h-full">
            <Timeline
              value={activityEvents}
              marker={timelineMarker}
              content={timelineContent}
              className="mt-2"
            />
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card title="Aksi Cepat" className="shadow-1 border-round-xl">
        <div className="grid">
          {[
            { label: 'Tambah Berita', icon: 'pi pi-file-edit', path: '/dashboard/cms/berita', severity: null as unknown as 'warning' },
            { label: 'Pengumuman', icon: 'pi pi-megaphone', path: '/dashboard/cms/pengumuman', severity: 'warning' as const },
            { label: 'Event Baru', icon: 'pi pi-calendar-plus', path: '/dashboard/event', severity: 'info' as const },
            { label: 'Katalog Produk', icon: 'pi pi-box', path: '/dashboard/produk/katalog', severity: 'success' as const },
            { label: 'Banner', icon: 'pi pi-images', path: '/dashboard/cms/banner', severity: 'help' as const },
            { label: 'Lihat Laporan', icon: 'pi pi-chart-line', path: '/dashboard/laporan/realisasi-anggaran', severity: 'danger' as const },
          ].map((action, idx) => (
            <div key={idx} className="col-6 md:col-4 lg:col-2">
              <Button
                label={action.label}
                icon={action.icon}
                severity={action.severity || undefined}
                outlined
                className="w-full border-round-xl p-3 flex-column gap-2"
                style={{ minHeight: '5rem' }}
                onClick={() => navigate(action.path)}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardHome;
