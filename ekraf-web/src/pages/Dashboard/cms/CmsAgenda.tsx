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
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const DEMO_DATA = [
  { id: 1, judul: 'Festival Budaya Bontang', tanggalMulai: '2025-07-15', tanggalSelesai: '2025-07-17', lokasi: 'Taman Kota Bontang', status: 'akan-datang', kategori: 'Festival' },
  { id: 2, judul: 'Pelatihan Digital Marketing UMKM', tanggalMulai: '2025-06-20', tanggalSelesai: '2025-06-21', lokasi: 'Gedung DISPOPAR', status: 'selesai', kategori: 'Pelatihan' },
  { id: 3, judul: 'Pameran Produk DISPOPAR 2025', tanggalMulai: '2025-08-10', tanggalSelesai: '2025-08-12', lokasi: 'Convention Hall Bontang', status: 'akan-datang', kategori: 'Pameran' },
  { id: 4, judul: 'Workshop Fotografi Kreatif', tanggalMulai: '2025-06-05', tanggalSelesai: '2025-06-05', lokasi: 'Studio Kreatif Lt. 2', status: 'berlangsung', kategori: 'Workshop' },
  { id: 5, judul: 'Lomba Desain Logo HUT Bontang', tanggalMulai: '2025-05-01', tanggalSelesai: '2025-05-31', lokasi: 'Online', status: 'selesai', kategori: 'Lomba' },
  { id: 6, judul: 'Bazar UMKM Bontang', tanggalMulai: '2025-09-01', tanggalSelesai: '2025-09-03', lokasi: 'Lapangan Merdeka', status: 'akan-datang', kategori: 'Bazar' },
];

const STATUS_MAP: Record<string, { severity: 'success' | 'warning' | 'info' | 'danger'; label: string }> = {
  'akan-datang': { severity: 'info', label: 'Akan Datang' },
  berlangsung: { severity: 'warning', label: 'Berlangsung' },
  selesai: { severity: 'success', label: 'Selesai' },
  dibatalkan: { severity: 'danger', label: 'Dibatalkan' },
};

const KATEGORI_OPTIONS = [
  { label: 'Semua Kategori', value: '' },
  { label: 'Festival', value: 'Festival' },
  { label: 'Pelatihan', value: 'Pelatihan' },
  { label: 'Pameran', value: 'Pameran' },
  { label: 'Workshop', value: 'Workshop' },
  { label: 'Lomba', value: 'Lomba' },
  { label: 'Bazar', value: 'Bazar' },
];

const CmsAgenda = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Konten Website' }, { label: 'Agenda Event' }];

  const filtered = data.filter((d) => {
    const matchSearch = d.judul.toLowerCase().includes(globalFilter.toLowerCase()) || d.lokasi.toLowerCase().includes(globalFilter.toLowerCase());
    const matchKategori = !kategoriFilter || d.kategori === kategoriFilter;
    return matchSearch && matchKategori;
  });

  const counts = {
    total: data.length,
    akanDatang: data.filter((d) => d.status === 'akan-datang').length,
    berlangsung: data.filter((d) => d.status === 'berlangsung').length,
    selesai: data.filter((d) => d.status === 'selesai').length,
  };

  /* ---------- Column Templates ---------- */
  const statusTemplate = (row: (typeof DEMO_DATA)[0]) => {
    const s = STATUS_MAP[row.status];
    return s ? <Tag severity={s.severity} value={s.label} rounded /> : row.status;
  };

  const tanggalTemplate = (row: (typeof DEMO_DATA)[0]) => {
    const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    if (row.tanggalMulai === row.tanggalSelesai) return fmt(row.tanggalMulai);
    return `${fmt(row.tanggalMulai)} — ${fmt(row.tanggalSelesai)}`;
  };

  const kategoriTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <Tag value={row.kategori} severity="info" style={{ background: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
  );

  const actionTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button icon="pi pi-pencil" rounded text severity="info" tooltip="Edit" tooltipOptions={{ position: 'top' }} onClick={() => setShowDialog(true)} />
      <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Hapus" tooltipOptions={{ position: 'top' }} onClick={() => confirmDialog({ message: `Hapus agenda "${row.judul}"?`, header: 'Konfirmasi', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', accept: () => {} })} />
    </div>
  );

  /* ---------- Toolbar ---------- */
  const header = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari agenda..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 260 }} />
      </span>
      <Dropdown value={kategoriFilter} options={KATEGORI_OPTIONS} onChange={(e) => setKategoriFilter(e.value)} placeholder="Filter Kategori" style={{ width: 200 }} />
    </div>
  );

  /* ---------- Dialog ---------- */
  const dialogFooter = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowDialog(false)} />
      <Button label="Simpan" icon="pi pi-check" onClick={() => setShowDialog(false)} />
    </div>
  );

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Total Agenda', value: counts.total, icon: 'pi pi-calendar', color: '#3B82F6' },
    { label: 'Akan Datang', value: counts.akanDatang, icon: 'pi pi-clock', color: '#6366F1' },
    { label: 'Berlangsung', value: counts.berlangsung, icon: 'pi pi-play', color: '#F59E0B' },
    { label: 'Selesai', value: counts.selesai, icon: 'pi pi-check-circle', color: '#10B981' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ConfirmDialog />

      {/* Breadcrumb */}
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Agenda Event</h2>
        <Button label="Tambah Agenda" icon="pi pi-plus" onClick={() => setShowDialog(true)} />
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
        <DataTable value={filtered} paginator rows={10} header={header} emptyMessage="Belum ada data agenda" stripedRows removableSort dataKey="id" rowHover>
          <Column field="judul" header="Judul Agenda" sortable style={{ minWidth: 220 }} />
          <Column header="Tanggal" body={tanggalTemplate} sortable sortField="tanggalMulai" style={{ minWidth: 200 }} />
          <Column field="lokasi" header="Lokasi" sortable style={{ minWidth: 180 }} />
          <Column header="Kategori" body={kategoriTemplate} sortable sortField="kategori" style={{ minWidth: 120 }} />
          <Column header="Status" body={statusTemplate} sortable sortField="status" style={{ minWidth: 130 }} />
          <Column header="Aksi" body={actionTemplate} style={{ minWidth: 100 }} />
        </DataTable>
      </Card>

      {/* Dialog Form */}
      <Dialog header="Tambah / Edit Agenda" visible={showDialog} onHide={() => setShowDialog(false)} style={{ width: '600px' }} footer={dialogFooter} modal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Judul Agenda</label>
            <InputText placeholder="Masukkan judul agenda" style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Tanggal Mulai</label>
              <Calendar placeholder="Pilih tanggal" style={{ width: '100%' }} dateFormat="dd/mm/yy" showIcon />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Tanggal Selesai</label>
              <Calendar placeholder="Pilih tanggal" style={{ width: '100%' }} dateFormat="dd/mm/yy" showIcon />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Lokasi</label>
            <InputText placeholder="Lokasi acara" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Kategori</label>
            <Dropdown options={KATEGORI_OPTIONS.slice(1)} placeholder="Pilih kategori" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Deskripsi</label>
            <InputTextarea rows={3} placeholder="Deskripsi singkat agenda" style={{ width: '100%' }} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CmsAgenda;
