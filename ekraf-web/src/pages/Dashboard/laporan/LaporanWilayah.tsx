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
  { id: 1, kecamatan: 'Bontang Utara', kelurahan: 6, pelaku: 1420, umkm: 980, omzet: 18500000000, tenagaKerja: 3820, pertumbuhan: 12.5, icon: '🏙️' },
  { id: 2, kecamatan: 'Bontang Selatan', kelurahan: 5, pelaku: 1185, umkm: 820, omzet: 14200000000, tenagaKerja: 3150, pertumbuhan: 9.8, icon: '🌊' },
  { id: 3, kecamatan: 'Bontang Barat', kelurahan: 4, pelaku: 870, umkm: 610, omzet: 9800000000, tenagaKerja: 2280, pertumbuhan: 15.2, icon: '🌴' },
];

const KELURAHAN_DATA = [
  { id: 1, kelurahan: 'Bontang Kuala', kecamatan: 'Bontang Utara', pelaku: 320, umkm: 210, omzet: 4200000000 },
  { id: 2, kelurahan: 'Bontang Baru', kecamatan: 'Bontang Utara', pelaku: 285, umkm: 195, omzet: 3800000000 },
  { id: 3, kelurahan: 'Api-Api', kecamatan: 'Bontang Utara', pelaku: 265, umkm: 180, omzet: 3500000000 },
  { id: 4, kelurahan: 'Gunung Elai', kecamatan: 'Bontang Utara', pelaku: 210, umkm: 150, omzet: 2800000000 },
  { id: 5, kelurahan: 'Lok Tuan', kecamatan: 'Bontang Utara', pelaku: 195, umkm: 140, omzet: 2400000000 },
  { id: 6, kelurahan: 'Guntung', kecamatan: 'Bontang Utara', pelaku: 145, umkm: 105, omzet: 1800000000 },
  { id: 7, kelurahan: 'Berbas Pantai', kecamatan: 'Bontang Selatan', pelaku: 310, umkm: 215, omzet: 3900000000 },
  { id: 8, kelurahan: 'Berbas Tengah', kecamatan: 'Bontang Selatan', pelaku: 260, umkm: 185, omzet: 3200000000 },
  { id: 9, kelurahan: 'Satimpo', kecamatan: 'Bontang Selatan', pelaku: 230, umkm: 160, omzet: 2700000000 },
  { id: 10, kelurahan: 'Tanjung Laut', kecamatan: 'Bontang Selatan', pelaku: 210, umkm: 145, omzet: 2500000000 },
  { id: 11, kelurahan: 'Tanjung Laut Indah', kecamatan: 'Bontang Selatan', pelaku: 175, umkm: 115, omzet: 1900000000 },
  { id: 12, kelurahan: 'Belimbing', kecamatan: 'Bontang Barat', pelaku: 280, umkm: 195, omzet: 3400000000 },
  { id: 13, kelurahan: 'Kanaan', kecamatan: 'Bontang Barat', pelaku: 235, umkm: 170, omzet: 2800000000 },
  { id: 14, kelurahan: 'Gunung Telihan', kecamatan: 'Bontang Barat', pelaku: 195, umkm: 135, omzet: 2100000000 },
  { id: 15, kelurahan: 'Bontang Lestari', kecamatan: 'Bontang Barat', pelaku: 160, umkm: 110, omzet: 1500000000 },
];

const KECAMATAN_OPTIONS = [
  { label: 'Semua Kecamatan', value: '' },
  { label: 'Bontang Utara', value: 'Bontang Utara' },
  { label: 'Bontang Selatan', value: 'Bontang Selatan' },
  { label: 'Bontang Barat', value: 'Bontang Barat' },
];

const rupiah = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

const LaporanWilayah = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [filterKec, setFilterKec] = useState('');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Laporan & Ekspor' }, { label: 'Statistik Wilayah' }];

  const filteredKelurahan = KELURAHAN_DATA.filter((d) => {
    const matchKec = !filterKec || d.kecamatan === filterKec;
    const matchSearch = d.kelurahan.toLowerCase().includes(globalFilter.toLowerCase());
    return matchKec && matchSearch;
  });

  const totalPelaku = DEMO_DATA.reduce((a, b) => a + b.pelaku, 0);
  const totalUMKM = DEMO_DATA.reduce((a, b) => a + b.umkm, 0);
  const totalOmzet = DEMO_DATA.reduce((a, b) => a + b.omzet, 0);
  const totalTK = DEMO_DATA.reduce((a, b) => a + b.tenagaKerja, 0);

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Total Pelaku Ekraf', value: totalPelaku.toLocaleString(), icon: 'pi pi-users', color: '#3B82F6' },
    { label: 'Total UMKM', value: totalUMKM.toLocaleString(), icon: 'pi pi-building', color: '#10B981' },
    { label: 'Total Omzet', value: rupiah(totalOmzet), icon: 'pi pi-wallet', color: '#F59E0B' },
    { label: 'Tenaga Kerja', value: totalTK.toLocaleString(), icon: 'pi pi-briefcase', color: '#6366F1' },
  ];

  /* ---------- Kecamatan Column Templates ---------- */
  const kecamatanNameTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: '1.4rem' }}>{row.icon}</span>
      <div>
        <div style={{ fontWeight: 600 }}>{row.kecamatan}</div>
        <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{row.kelurahan} kelurahan</div>
      </div>
    </div>
  );

  const pertumbuhanTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <Tag
      value={`${row.pertumbuhan > 0 ? '+' : ''}${row.pertumbuhan}%`}
      severity={row.pertumbuhan >= 10 ? 'success' : 'warning'}
      icon={row.pertumbuhan >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'}
      rounded
    />
  );

  const shareTemplate = (row: (typeof DEMO_DATA)[0]) => {
    const pct = ((row.pelaku / totalPelaku) * 100);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ProgressBar value={pct} showValue={false} style={{ height: 8, flex: 1, maxWidth: 80 }} color="#3B82F6" />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, minWidth: 40 }}>{pct.toFixed(1)}%</span>
      </div>
    );
  };

  const omzetKecTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rupiah(row.omzet)}</span>
  );

  /* ---------- Kelurahan Column Templates ---------- */
  const kelNameTemplate = (row: (typeof KELURAHAN_DATA)[0]) => (
    <div>
      <div style={{ fontWeight: 600 }}>{row.kelurahan}</div>
      <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{row.kecamatan}</div>
    </div>
  );

  const omzetKelTemplate = (row: (typeof KELURAHAN_DATA)[0]) => (
    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rupiah(row.omzet)}</span>
  );

  const kelShareTemplate = (row: (typeof KELURAHAN_DATA)[0]) => {
    const pct = ((row.pelaku / totalPelaku) * 100);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ProgressBar value={pct} showValue={false} style={{ height: 6, flex: 1, maxWidth: 60 }} color="#6366F1" />
        <span style={{ fontSize: '0.8rem', minWidth: 35 }}>{pct.toFixed(1)}%</span>
      </div>
    );
  };

  const kelurahanHeader = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari kelurahan..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 220 }} />
      </span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Dropdown value={filterKec} options={KECAMATAN_OPTIONS} onChange={(e) => setFilterKec(e.value)} placeholder="Filter Kecamatan" style={{ width: 180 }} />
        <Button icon="pi pi-file-excel" severity="success" outlined tooltip="Export Excel" tooltipOptions={{ position: 'top' }} />
        <Button icon="pi pi-file-pdf" severity="danger" outlined tooltip="Export PDF" tooltipOptions={{ position: 'top' }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Statistik Wilayah</h2>
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

      {/* Kecamatan Summary */}
      <Card title="Ringkasan Per Kecamatan">
        <DataTable value={DEMO_DATA} stripedRows rowHover dataKey="id">
          <Column header="Kecamatan" body={kecamatanNameTemplate} style={{ minWidth: 180 }} />
          <Column header="Pelaku" field="pelaku" sortable body={(r) => <span style={{ fontWeight: 600 }}>{r.pelaku.toLocaleString()}</span>} style={{ minWidth: 100 }} />
          <Column header="UMKM" field="umkm" sortable body={(r) => r.umkm.toLocaleString()} style={{ minWidth: 100 }} />
          <Column header="Omzet" body={omzetKecTemplate} sortable sortField="omzet" style={{ minWidth: 160 }} />
          <Column header="Tenaga Kerja" field="tenagaKerja" sortable body={(r) => r.tenagaKerja.toLocaleString()} style={{ minWidth: 120 }} />
          <Column header="Share" body={shareTemplate} style={{ minWidth: 150 }} />
          <Column header="Pertumbuhan" body={pertumbuhanTemplate} sortable sortField="pertumbuhan" style={{ minWidth: 130 }} />
        </DataTable>
      </Card>

      {/* Kelurahan Detail */}
      <Card>
        <DataTable value={filteredKelurahan} paginator rows={10} header={kelurahanHeader} emptyMessage="Belum ada data kelurahan" stripedRows removableSort dataKey="id" rowHover>
          <Column header="Kelurahan" body={kelNameTemplate} sortable sortField="kelurahan" style={{ minWidth: 180 }} />
          <Column header="Pelaku" field="pelaku" sortable body={(r) => r.pelaku.toLocaleString()} style={{ minWidth: 100 }} />
          <Column header="UMKM" field="umkm" sortable body={(r) => r.umkm.toLocaleString()} style={{ minWidth: 100 }} />
          <Column header="Omzet" body={omzetKelTemplate} sortable sortField="omzet" style={{ minWidth: 160 }} />
          <Column header="Share" body={kelShareTemplate} style={{ minWidth: 120 }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default LaporanWilayah;
