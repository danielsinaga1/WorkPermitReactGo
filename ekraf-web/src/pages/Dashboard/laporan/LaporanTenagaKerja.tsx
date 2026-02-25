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
  { id: 1, subsektor: 'Kuliner', tk: 8450, penambahan: 820, serapan: 78, rataPerUsaha: 2.6, icon: '🍽️' },
  { id: 2, subsektor: 'Kriya', tk: 4320, penambahan: 380, serapan: 72, rataPerUsaha: 2.3, icon: '🎨' },
  { id: 3, subsektor: 'Fashion', tk: 3650, penambahan: 410, serapan: 69, rataPerUsaha: 2.4, icon: '👗' },
  { id: 4, subsektor: 'DKV', tk: 2100, penambahan: 290, serapan: 65, rataPerUsaha: 2.4, icon: '🖌️' },
  { id: 5, subsektor: 'Musik', tk: 1850, penambahan: 125, serapan: 58, rataPerUsaha: 2.7, icon: '🎵' },
  { id: 6, subsektor: 'Fotografi', tk: 1230, penambahan: 145, serapan: 62, rataPerUsaha: 2.9, icon: '📷' },
  { id: 7, subsektor: 'Seni Pertunjukan', tk: 1120, penambahan: 85, serapan: 55, rataPerUsaha: 3.2, icon: '🎭' },
  { id: 8, subsektor: 'Arsitektur', tk: 680, penambahan: 52, serapan: 71, rataPerUsaha: 3.2, icon: '🏛️' },
  { id: 9, subsektor: 'Aplikasi & Game', tk: 645, penambahan: 98, serapan: 82, rataPerUsaha: 3.5, icon: '🎮' },
  { id: 10, subsektor: 'Film & Animasi', tk: 522, penambahan: 60, serapan: 60, rataPerUsaha: 3.6, icon: '🎬' },
];

const TAHUN_OPTIONS = [
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
];

const LaporanTenagaKerja = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [tahun, setTahun] = useState('2025');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Laporan & Ekspor' }, { label: 'Serapan Tenaga Kerja' }];

  const filtered = data.filter((d) => d.subsektor.toLowerCase().includes(globalFilter.toLowerCase()));

  const totalTK = data.reduce((a, b) => a + b.tk, 0);
  const totalPenambahan = data.reduce((a, b) => a + b.penambahan, 0);
  const avgSerapan = (data.reduce((a, b) => a + b.serapan, 0) / data.length).toFixed(0);
  const topSubsektor = data.reduce((a, b) => (a.tk > b.tk ? a : b));

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Total Tenaga Kerja', value: totalTK.toLocaleString(), icon: 'pi pi-users', color: '#3B82F6' },
    { label: `Penambahan ${tahun}`, value: `+${totalPenambahan.toLocaleString()}`, icon: 'pi pi-user-plus', color: '#10B981' },
    { label: 'Tingkat Serapan', value: `${avgSerapan}%`, icon: 'pi pi-percentage', color: '#F59E0B' },
    { label: 'Top Subsektor', value: topSubsektor.subsektor, icon: 'pi pi-star', color: '#6366F1' },
  ];

  /* ---------- Column Templates ---------- */
  const subsektorTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: '1.4rem' }}>{row.icon}</span>
      <span style={{ fontWeight: 600 }}>{row.subsektor}</span>
    </div>
  );

  const tkTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{row.tk.toLocaleString()}</span>
  );

  const penambahanTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <Tag value={`+${row.penambahan.toLocaleString()}`} severity="success" rounded icon="pi pi-arrow-up" />
  );

  const serapanTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <ProgressBar
        value={row.serapan}
        showValue={false}
        style={{ height: 8, flex: 1, maxWidth: 100 }}
        color={row.serapan >= 70 ? '#10B981' : row.serapan >= 50 ? '#F59E0B' : '#EF4444'}
      />
      <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 35 }}>{row.serapan}%</span>
    </div>
  );

  const rataTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontSize: '0.9rem' }}>{row.rataPerUsaha} orang</span>
  );

  const shareTemplate = (row: (typeof DEMO_DATA)[0]) => {
    const pct = ((row.tk / totalTK) * 100);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ProgressBar value={pct} showValue={false} style={{ height: 8, flex: 1, maxWidth: 80 }} color="#6366F1" />
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
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Serapan Tenaga Kerja</h2>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} style={{ flex: '1 1 200px', borderLeft: `4px solid ${kpi.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <i className={kpi.icon} style={{ fontSize: '1.8rem', color: kpi.color }} />
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpi.value}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{kpi.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* DataTable */}
      <Card>
        <DataTable value={filtered} paginator rows={10} header={header} emptyMessage="Belum ada data serapan tenaga kerja" stripedRows removableSort dataKey="id" rowHover>
          <Column header="Subsektor" body={subsektorTemplate} sortable sortField="subsektor" style={{ minWidth: 180 }} />
          <Column header="Tenaga Kerja" body={tkTemplate} sortable sortField="tk" style={{ minWidth: 140 }} />
          <Column header="Penambahan" body={penambahanTemplate} sortable sortField="penambahan" style={{ minWidth: 130 }} />
          <Column header="Serapan" body={serapanTemplate} sortable sortField="serapan" style={{ minWidth: 170 }} />
          <Column header="Share" body={shareTemplate} sortable sortField="tk" style={{ minWidth: 150 }} />
          <Column header="Rata-rata/Usaha" body={rataTemplate} sortable sortField="rataPerUsaha" style={{ minWidth: 140 }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default LaporanTenagaKerja;
