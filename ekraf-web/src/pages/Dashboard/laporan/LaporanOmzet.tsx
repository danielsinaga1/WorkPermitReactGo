import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';

const DEMO_DATA = [
  { id: 1, subsektor: 'Kuliner', pelaku: 3210, omzet: 5200000000, rataRata: 1619315, pertumbuhan: 15.2, icon: '🍽️' },
  { id: 2, subsektor: 'Kriya', pelaku: 1845, omzet: 3100000000, rataRata: 1680217, pertumbuhan: 8.7, icon: '🎨' },
  { id: 3, subsektor: 'Fashion', pelaku: 1520, omzet: 2800000000, rataRata: 1842105, pertumbuhan: 12.1, icon: '👗' },
  { id: 4, subsektor: 'DKV', pelaku: 890, omzet: 1650000000, rataRata: 1853933, pertumbuhan: 22.5, icon: '🖌️' },
  { id: 5, subsektor: 'Musik', pelaku: 680, omzet: 980000000, rataRata: 1441176, pertumbuhan: -3.2, icon: '🎵' },
  { id: 6, subsektor: 'Fotografi', pelaku: 420, omzet: 720000000, rataRata: 1714286, pertumbuhan: 9.8, icon: '📷' },
  { id: 7, subsektor: 'Seni Pertunjukan', pelaku: 350, omzet: 450000000, rataRata: 1285714, pertumbuhan: 5.3, icon: '🎭' },
  { id: 8, subsektor: 'Arsitektur', pelaku: 210, omzet: 380000000, rataRata: 1809524, pertumbuhan: 18.6, icon: '🏛️' },
  { id: 9, subsektor: 'Aplikasi & Game', pelaku: 185, omzet: 520000000, rataRata: 2810811, pertumbuhan: 35.0, icon: '🎮' },
  { id: 10, subsektor: 'Film & Animasi', pelaku: 145, omzet: 280000000, rataRata: 1931034, pertumbuhan: 14.2, icon: '🎬' },
];

const TAHUN_OPTIONS = [
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
];

const rupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

const LaporanOmzet = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [tahun, setTahun] = useState('2025');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Laporan & Ekspor' }, { label: 'Laporan Omzet' }];

  const filtered = data.filter((d) => d.subsektor.toLowerCase().includes(globalFilter.toLowerCase()));

  const totalOmzet = data.reduce((a, b) => a + b.omzet, 0);
  const totalPelaku = data.reduce((a, b) => a + b.pelaku, 0);
  const avgPertumbuhan = (data.reduce((a, b) => a + b.pertumbuhan, 0) / data.length).toFixed(1);
  const maxSubsektor = data.reduce((a, b) => (a.omzet > b.omzet ? a : b));

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: `Total Omzet ${tahun}`, value: rupiah(totalOmzet), icon: 'pi pi-wallet', color: '#3B82F6' },
    { label: 'Omzet Bulan Ini', value: rupiah(1800000000), icon: 'pi pi-chart-line', color: '#10B981' },
    { label: 'Pertumbuhan YoY', value: `+${avgPertumbuhan}%`, icon: 'pi pi-arrow-up-right', color: '#F59E0B' },
    { label: 'Pelaku Pelapor', value: totalPelaku.toLocaleString(), icon: 'pi pi-users', color: '#6366F1' },
  ];

  /* ---------- Column Templates ---------- */
  const subsektorTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: '1.4rem' }}>{row.icon}</span>
      <span style={{ fontWeight: 600 }}>{row.subsektor}</span>
    </div>
  );

  const omzetTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontWeight: 700, color: '#059669' }}>{rupiah(row.omzet)}</span>
  );

  const rataRataTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontSize: '0.9rem' }}>{rupiah(row.rataRata)}</span>
  );

  const pertumbuhanTemplate = (row: (typeof DEMO_DATA)[0]) => {
    const isPositive = row.pertumbuhan >= 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Tag
          value={`${isPositive ? '+' : ''}${row.pertumbuhan}%`}
          severity={isPositive ? 'success' : 'danger'}
          rounded
          icon={isPositive ? 'pi pi-arrow-up' : 'pi pi-arrow-down'}
        />
      </div>
    );
  };

  const shareTemplate = (row: (typeof DEMO_DATA)[0]) => {
    const pct = ((row.omzet / totalOmzet) * 100);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ProgressBar value={pct} showValue={false} style={{ height: 8, flex: 1, maxWidth: 100 }} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, minWidth: 40 }}>{pct.toFixed(1)}%</span>
      </div>
    );
  };

  const header = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari subsektor..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 240 }} />
      </span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Dropdown value={tahun} options={TAHUN_OPTIONS} onChange={(e) => setTahun(e.value)} style={{ width: 120 }} />
        <Button icon="pi pi-file-excel" severity="success" outlined tooltip="Export Excel" tooltipOptions={{ position: 'top' }} />
        <Button icon="pi pi-file-pdf" severity="danger" outlined tooltip="Export PDF" tooltipOptions={{ position: 'top' }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Laporan Omzet</h2>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} style={{ flex: '1 1 200px', borderLeft: `4px solid ${kpi.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <i className={kpi.icon} style={{ fontSize: '1.8rem', color: kpi.color }} />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{kpi.value}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{kpi.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Top Subsektor Highlight */}
      <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Subsektor Omzet Tertinggi</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: 4 }}>{maxSubsektor.icon} {maxSubsektor.subsektor}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{rupiah(maxSubsektor.omzet)}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{maxSubsektor.pelaku.toLocaleString()} pelaku • +{maxSubsektor.pertumbuhan}% YoY</div>
          </div>
        </div>
      </Card>

      {/* DataTable */}
      <Card>
        <DataTable value={filtered} paginator rows={10} header={header} emptyMessage="Belum ada data laporan omzet" stripedRows removableSort dataKey="id" rowHover>
          <Column header="Subsektor" body={subsektorTemplate} sortable sortField="subsektor" style={{ minWidth: 180 }} />
          <Column field="pelaku" header="Jumlah Pelaku" sortable style={{ minWidth: 130 }} body={(row) => <span>{row.pelaku.toLocaleString()}</span>} />
          <Column header="Total Omzet" body={omzetTemplate} sortable sortField="omzet" style={{ minWidth: 170 }} />
          <Column header="Rata-rata/Pelaku" body={rataRataTemplate} sortable sortField="rataRata" style={{ minWidth: 160 }} />
          <Column header="Share" body={shareTemplate} sortable sortField="omzet" style={{ minWidth: 160 }} />
          <Column header="Pertumbuhan" body={pertumbuhanTemplate} sortable sortField="pertumbuhan" style={{ minWidth: 130 }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default LaporanOmzet;
