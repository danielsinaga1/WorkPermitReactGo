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
import { InputTextarea } from 'primereact/inputtextarea';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const DEMO_DATA = [
  { id: 1, nama: 'Kriya', deskripsi: 'Kerajinan tangan dan produk kriya tradisional', pelaku: 1845, status: 'aktif', icon: '🎨' },
  { id: 2, nama: 'Kuliner', deskripsi: 'Industri makanan dan minuman khas daerah', pelaku: 3210, status: 'aktif', icon: '🍽️' },
  { id: 3, nama: 'Fashion', deskripsi: 'Industri mode dan pakaian', pelaku: 1520, status: 'aktif', icon: '👗' },
  { id: 4, nama: 'Musik', deskripsi: 'Industri musik dan pertunjukan', pelaku: 680, status: 'aktif', icon: '🎵' },
  { id: 5, nama: 'Fotografi', deskripsi: 'Jasa fotografi dan videografi', pelaku: 420, status: 'aktif', icon: '📷' },
  { id: 6, nama: 'Desain Komunikasi Visual', deskripsi: 'Desain grafis, branding, dan komunikasi visual', pelaku: 890, status: 'aktif', icon: '🖌️' },
  { id: 7, nama: 'Arsitektur', deskripsi: 'Jasa arsitektur dan desain interior', pelaku: 210, status: 'aktif', icon: '🏛️' },
  { id: 8, nama: 'Seni Pertunjukan', deskripsi: 'Teater, tari, dan seni pertunjukan lainnya', pelaku: 350, status: 'nonaktif', icon: '🎭' },
  { id: 9, nama: 'Aplikasi & Game', deskripsi: 'Pengembangan aplikasi dan game digital', pelaku: 185, status: 'aktif', icon: '🎮' },
  { id: 10, nama: 'Film & Animasi', deskripsi: 'Produksi film, animasi, dan video', pelaku: 145, status: 'aktif', icon: '🎬' },
];

const SettingsSubsektor = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Master Data' }, { label: 'Sub-sektor DISPOPAR' }];

  const filtered = data.filter((d) => d.nama.toLowerCase().includes(globalFilter.toLowerCase()) || d.deskripsi.toLowerCase().includes(globalFilter.toLowerCase()));

  const totalPelaku = data.reduce((a, b) => a + b.pelaku, 0);
  const aktif = data.filter((d) => d.status === 'aktif').length;

  /* ---------- Column Templates ---------- */
  const namaTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: '1.4rem' }}>{row.icon}</span>
      <span style={{ fontWeight: 600 }}>{row.nama}</span>
    </div>
  );

  const pelakuTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontWeight: 600 }}>{row.pelaku.toLocaleString()}</span>
  );

  const statusTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <Tag value={row.status === 'aktif' ? 'Aktif' : 'Nonaktif'} severity={row.status === 'aktif' ? 'success' : 'danger'} rounded />
  );

  const actionTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button icon="pi pi-pencil" rounded text severity="info" tooltip="Edit" tooltipOptions={{ position: 'top' }} onClick={() => setShowDialog(true)} />
      <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Hapus" tooltipOptions={{ position: 'top' }} onClick={() => confirmDialog({ message: `Hapus subsektor "${row.nama}"?`, header: 'Konfirmasi', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', accept: () => {} })} />
    </div>
  );

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Total Subsektor', value: data.length, icon: 'pi pi-th-large', color: '#3B82F6' },
    { label: 'Subsektor Aktif', value: aktif, icon: 'pi pi-check-circle', color: '#10B981' },
    { label: 'Total Pelaku', value: totalPelaku.toLocaleString(), icon: 'pi pi-users', color: '#F59E0B' },
    { label: 'Rata-rata Pelaku', value: Math.round(totalPelaku / data.length).toLocaleString(), icon: 'pi pi-chart-bar', color: '#6366F1' },
  ];

  const header = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari subsektor..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 260 }} />
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
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Sub-sektor DISPOPAR</h2>
        <Button label="Tambah Subsektor" icon="pi pi-plus" onClick={() => setShowDialog(true)} />
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
        <DataTable value={filtered} paginator rows={10} header={header} emptyMessage="Belum ada data subsektor" stripedRows removableSort dataKey="id" rowHover>
          <Column field="id" header="No" sortable style={{ width: 60 }} />
          <Column header="Nama Subsektor" body={namaTemplate} sortable sortField="nama" style={{ minWidth: 220 }} />
          <Column field="deskripsi" header="Deskripsi" style={{ minWidth: 250 }} />
          <Column header="Jumlah Pelaku" body={pelakuTemplate} sortable sortField="pelaku" style={{ minWidth: 130 }} />
          <Column header="Status" body={statusTemplate} sortable sortField="status" style={{ minWidth: 100 }} />
          <Column header="Aksi" body={actionTemplate} style={{ minWidth: 100 }} />
        </DataTable>
      </Card>

      {/* Dialog Form */}
      <Dialog header="Tambah / Edit Subsektor" visible={showDialog} onHide={() => setShowDialog(false)} style={{ width: '500px' }} footer={dialogFooter} modal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Nama Subsektor</label>
            <InputText placeholder="Nama subsektor" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Deskripsi</label>
            <InputTextarea rows={3} placeholder="Deskripsi singkat subsektor" style={{ width: '100%' }} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SettingsSubsektor;
