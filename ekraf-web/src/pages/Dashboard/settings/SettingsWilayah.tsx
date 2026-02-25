import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const DEMO_DATA = [
  { id: 1, kode: '6474', nama: 'Kota Bontang', tipe: 'Kota', parent: 'Kalimantan Timur', pelaku: 10450, status: 'aktif' },
  { id: 2, kode: '6474010', nama: 'Bontang Selatan', tipe: 'Kecamatan', parent: 'Kota Bontang', pelaku: 3200, status: 'aktif' },
  { id: 3, kode: '6474020', nama: 'Bontang Utara', tipe: 'Kecamatan', parent: 'Kota Bontang', pelaku: 4150, status: 'aktif' },
  { id: 4, kode: '6474030', nama: 'Bontang Barat', tipe: 'Kecamatan', parent: 'Kota Bontang', pelaku: 3100, status: 'aktif' },
  { id: 5, kode: '6474010001', nama: 'Berbas Tengah', tipe: 'Kelurahan', parent: 'Bontang Selatan', pelaku: 850, status: 'aktif' },
  { id: 6, kode: '6474010002', nama: 'Berbas Pantai', tipe: 'Kelurahan', parent: 'Bontang Selatan', pelaku: 620, status: 'aktif' },
  { id: 7, kode: '6474020001', nama: 'Api-Api', tipe: 'Kelurahan', parent: 'Bontang Utara', pelaku: 780, status: 'aktif' },
  { id: 8, kode: '6474020002', nama: 'Gunung Elai', tipe: 'Kelurahan', parent: 'Bontang Utara', pelaku: 540, status: 'nonaktif' },
];

const TIPE_OPTIONS = [
  { label: 'Semua Tipe', value: '' },
  { label: 'Kota', value: 'Kota' },
  { label: 'Kecamatan', value: 'Kecamatan' },
  { label: 'Kelurahan', value: 'Kelurahan' },
];

const SettingsWilayah = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Master Data' }, { label: 'Wilayah' }];

  const filtered = data.filter((d) => {
    const matchSearch = d.nama.toLowerCase().includes(globalFilter.toLowerCase()) || d.kode.includes(globalFilter);
    const matchTipe = !tipeFilter || d.tipe === tipeFilter;
    return matchSearch && matchTipe;
  });

  const counts = {
    total: data.length,
    kecamatan: data.filter((d) => d.tipe === 'Kecamatan').length,
    kelurahan: data.filter((d) => d.tipe === 'Kelurahan').length,
    totalPelaku: data.filter((d) => d.tipe === 'Kota').reduce((a, b) => a + b.pelaku, 0),
  };

  /* ---------- Column Templates ---------- */
  const kodeTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', background: '#f3f4f6', padding: '2px 8px', borderRadius: 4 }}>{row.kode}</span>
  );

  const tipeTemplate = (row: (typeof DEMO_DATA)[0]) => {
    const severity = row.tipe === 'Kota' ? 'danger' : row.tipe === 'Kecamatan' ? 'warning' : 'info';
    return <Tag value={row.tipe} severity={severity} rounded />;
  };

  const statusTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <Tag value={row.status === 'aktif' ? 'Aktif' : 'Nonaktif'} severity={row.status === 'aktif' ? 'success' : 'danger'} rounded />
  );

  const pelakuTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontWeight: 600 }}>{row.pelaku.toLocaleString()}</span>
  );

  const actionTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button icon="pi pi-pencil" rounded text severity="info" tooltip="Edit" tooltipOptions={{ position: 'top' }} onClick={() => setShowDialog(true)} />
      <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Hapus" tooltipOptions={{ position: 'top' }} onClick={() => confirmDialog({ message: `Hapus wilayah "${row.nama}"?`, header: 'Konfirmasi', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', accept: () => {} })} />
    </div>
  );

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Total Wilayah', value: counts.total, icon: 'pi pi-map-marker', color: '#3B82F6' },
    { label: 'Kecamatan', value: counts.kecamatan, icon: 'pi pi-building', color: '#F59E0B' },
    { label: 'Kelurahan', value: counts.kelurahan, icon: 'pi pi-home', color: '#10B981' },
    { label: 'Total Pelaku', value: counts.totalPelaku.toLocaleString(), icon: 'pi pi-users', color: '#6366F1' },
  ];

  const header = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari wilayah..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 260 }} />
      </span>
      <Dropdown value={tipeFilter} options={TIPE_OPTIONS} onChange={(e) => setTipeFilter(e.value)} placeholder="Filter Tipe" style={{ width: 180 }} />
    </div>
  );

  const dialogFooter = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowDialog(false)} />
      <Button label="Simpan" icon="pi pi-check" onClick={() => setShowDialog(false)} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ConfirmDialog />

      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Master Wilayah</h2>
        <Button label="Tambah Wilayah" icon="pi pi-plus" onClick={() => setShowDialog(true)} />
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} style={{ flex: '1 1 200px', borderLeft: `4px solid ${kpi.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <i className={kpi.icon} style={{ fontSize: '1.8rem', color: kpi.color }} />
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{kpi.value}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{kpi.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* DataTable */}
      <Card>
        <DataTable value={filtered} paginator rows={10} header={header} emptyMessage="Belum ada data wilayah" stripedRows removableSort dataKey="id" rowHover>
          <Column header="Kode" body={kodeTemplate} sortable sortField="kode" style={{ minWidth: 130 }} />
          <Column field="nama" header="Nama Wilayah" sortable style={{ minWidth: 200 }} />
          <Column header="Tipe" body={tipeTemplate} sortable sortField="tipe" style={{ minWidth: 120 }} />
          <Column field="parent" header="Parent" sortable style={{ minWidth: 160 }} />
          <Column header="Pelaku" body={pelakuTemplate} sortable sortField="pelaku" style={{ minWidth: 100 }} />
          <Column header="Status" body={statusTemplate} sortable sortField="status" style={{ minWidth: 100 }} />
          <Column header="Aksi" body={actionTemplate} style={{ minWidth: 100 }} />
        </DataTable>
      </Card>

      {/* Dialog Form */}
      <Dialog header="Tambah / Edit Wilayah" visible={showDialog} onHide={() => setShowDialog(false)} style={{ width: '500px' }} footer={dialogFooter} modal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Kode Wilayah</label>
            <InputText placeholder="Masukkan kode wilayah" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Nama Wilayah</label>
            <InputText placeholder="Nama wilayah" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Tipe</label>
            <Dropdown options={TIPE_OPTIONS.slice(1)} placeholder="Pilih tipe" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Parent</label>
            <Dropdown options={data.map((d) => ({ label: d.nama, value: d.nama }))} placeholder="Pilih parent" style={{ width: '100%' }} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SettingsWilayah;
