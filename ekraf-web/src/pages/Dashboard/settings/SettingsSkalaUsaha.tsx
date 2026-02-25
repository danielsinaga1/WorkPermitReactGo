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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressBar } from 'primereact/progressbar';

const DEMO_DATA = [
  { id: 1, nama: 'Mikro', kriteria: '< Rp 50 juta/tahun', jumlah: 5678, persentase: 54.2, color: '#10B981' },
  { id: 2, nama: 'Kecil', kriteria: 'Rp 50 - 500 juta/tahun', jumlah: 3456, persentase: 33.0, color: '#3B82F6' },
  { id: 3, nama: 'Menengah', kriteria: 'Rp 500 juta - 10 M/tahun', jumlah: 1234, persentase: 11.8, color: '#F59E0B' },
  { id: 4, nama: 'Besar', kriteria: '> Rp 10 M/tahun', jumlah: 82, persentase: 0.8, color: '#EF4444' },
];

const SettingsSkalaUsaha = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Master Data' }, { label: 'Skala Usaha' }];

  const filtered = data.filter((d) => d.nama.toLowerCase().includes(globalFilter.toLowerCase()) || d.kriteria.toLowerCase().includes(globalFilter.toLowerCase()));

  const totalUsaha = data.reduce((a, b) => a + b.jumlah, 0);

  /* ---------- Column Templates ---------- */
  const namaTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
      <span style={{ fontWeight: 600 }}>{row.nama}</span>
    </div>
  );

  const kriteriaTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <Tag value={row.kriteria} style={{ background: '#f0f9ff', color: '#0369a1', fontWeight: 500 }} />
  );

  const jumlahTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{row.jumlah.toLocaleString()}</span>
  );

  const persentaseTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <ProgressBar value={row.persentase} showValue={false} style={{ height: 8, flex: 1, maxWidth: 120 }} color={row.color} />
      <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 45 }}>{row.persentase}%</span>
    </div>
  );

  const actionTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button icon="pi pi-pencil" rounded text severity="info" tooltip="Edit" tooltipOptions={{ position: 'top' }} onClick={() => setShowDialog(true)} />
      <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Hapus" tooltipOptions={{ position: 'top' }} onClick={() => confirmDialog({ message: `Hapus skala usaha "${row.nama}"?`, header: 'Konfirmasi', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', accept: () => {} })} />
    </div>
  );

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Total Skala', value: data.length, icon: 'pi pi-th-large', color: '#3B82F6' },
    { label: 'Total Usaha', value: totalUsaha.toLocaleString(), icon: 'pi pi-briefcase', color: '#10B981' },
    { label: 'Terbanyak', value: 'Mikro', icon: 'pi pi-chart-pie', color: '#F59E0B' },
  ];

  const header = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari skala usaha..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 260 }} />
      </span>
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
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Skala Usaha</h2>
        <Button label="Tambah Skala" icon="pi pi-plus" onClick={() => setShowDialog(true)} />
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
        <DataTable value={filtered} paginator rows={10} header={header} emptyMessage="Belum ada data skala usaha" stripedRows removableSort dataKey="id" rowHover>
          <Column field="id" header="No" sortable style={{ width: 60 }} />
          <Column header="Nama Skala" body={namaTemplate} sortable sortField="nama" style={{ minWidth: 150 }} />
          <Column header="Kriteria Omzet" body={kriteriaTemplate} style={{ minWidth: 200 }} />
          <Column header="Jumlah Usaha" body={jumlahTemplate} sortable sortField="jumlah" style={{ minWidth: 130 }} />
          <Column header="Persentase" body={persentaseTemplate} sortable sortField="persentase" style={{ minWidth: 200 }} />
          <Column header="Aksi" body={actionTemplate} style={{ minWidth: 100 }} />
        </DataTable>
      </Card>

      {/* Dialog Form */}
      <Dialog header="Tambah / Edit Skala Usaha" visible={showDialog} onHide={() => setShowDialog(false)} style={{ width: '500px' }} footer={dialogFooter} modal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Nama Skala</label>
            <InputText placeholder="Nama skala usaha" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Kriteria Omzet</label>
            <InputText placeholder="Contoh: < Rp 50 juta/tahun" style={{ width: '100%' }} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SettingsSkalaUsaha;
