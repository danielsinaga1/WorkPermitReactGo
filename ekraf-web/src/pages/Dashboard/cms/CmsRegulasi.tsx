import { useState, useRef } from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

interface Regulasi {
  id: number;
  judul: string;
  nomor: string;
  jenis: string;
  tahun: number;
  status: string;
  tanggalDitetapkan: string;
  tentang: string;
  fileUrl: string;
}

const JENIS_OPTIONS = [
  { label: 'Peraturan Daerah', value: 'Perda' },
  { label: 'Peraturan Walikota', value: 'Perwali' },
  { label: 'Surat Keputusan', value: 'SK' },
  { label: 'Instruksi', value: 'Instruksi' },
  { label: 'Surat Edaran', value: 'SE' },
];

const STATUS_OPTIONS = [
  { label: 'Berlaku', value: 'Berlaku' },
  { label: 'Dicabut', value: 'Dicabut' },
  { label: 'Draft', value: 'Draft' },
];

const DEMO_DATA: Regulasi[] = [
  { id: 1, judul: 'Pengembangan Ekonomi Kreatif Kota Bontang', nomor: 'No. 8 Tahun 2024', jenis: 'Perda', tahun: 2024, status: 'Berlaku', tanggalDitetapkan: '2024-03-15', tentang: 'Pengembangan ekonomi kreatif berbasis potensi lokal', fileUrl: '#' },
  { id: 2, judul: 'Pembentukan Komite Ekonomi Kreatif', nomor: 'No. 22 Tahun 2024', jenis: 'Perwali', tahun: 2024, status: 'Berlaku', tanggalDitetapkan: '2024-05-10', tentang: 'Pembentukan komite pengarah ekonomi kreatif kota', fileUrl: '#' },
  { id: 3, judul: 'Pelaksanaan Program Bantuan UMKM Kreatif', nomor: 'No. 45 Tahun 2024', jenis: 'SK', tahun: 2024, status: 'Berlaku', tanggalDitetapkan: '2024-07-20', tentang: 'Penetapan penerima bantuan UMKM sektor kreatif', fileUrl: '#' },
  { id: 4, judul: 'Standar Mutu Produk Ekonomi Kreatif', nomor: 'No. 15 Tahun 2023', jenis: 'Perwali', tahun: 2023, status: 'Berlaku', tanggalDitetapkan: '2023-04-12', tentang: 'Penetapan standar mutu produk ekonomi kreatif', fileUrl: '#' },
  { id: 5, judul: 'Tata Kelola Destinasi Wisata Kreatif', nomor: 'No. 5 Tahun 2023', jenis: 'Perda', tahun: 2023, status: 'Berlaku', tanggalDitetapkan: '2023-02-28', tentang: 'Pengelolaan destinasi wisata berbasis ekonomi kreatif', fileUrl: '#' },
  { id: 6, judul: 'Insentif Pajak Pelaku Ekonomi Kreatif', nomor: 'No. 31 Tahun 2023', jenis: 'Perwali', tahun: 2023, status: 'Berlaku', tanggalDitetapkan: '2023-09-05', tentang: 'Pemberian insentif pajak bagi pelaku ekraf berprestasi', fileUrl: '#' },
  { id: 7, judul: 'Pelaksanaan Festival Ekonomi Kreatif 2023', nomor: 'No. 88 Tahun 2023', jenis: 'SK', tahun: 2023, status: 'Dicabut', tanggalDitetapkan: '2023-06-15', tentang: 'Penetapan kepanitiaan festival ekonomi kreatif tahunan', fileUrl: '#' },
  { id: 8, judul: 'Pedoman Pelatihan Ekonomi Kreatif', nomor: 'SE/12/2024', jenis: 'SE', tahun: 2024, status: 'Berlaku', tanggalDitetapkan: '2024-01-10', tentang: 'Pedoman pelaksanaan pelatihan bagi pelaku ekonomi kreatif', fileUrl: '#' },
  { id: 9, judul: 'Percepatan Digitalisasi UMKM Kreatif', nomor: 'No. 3 Tahun 2024', jenis: 'Instruksi', tahun: 2024, status: 'Berlaku', tanggalDitetapkan: '2024-02-01', tentang: 'Instruksi percepatan transformasi digital UMKM kreatif', fileUrl: '#' },
  { id: 10, judul: 'Rencana Induk Pengembangan Ekonomi Kreatif 2023-2028', nomor: 'No. 2 Tahun 2023', jenis: 'Perda', tahun: 2023, status: 'Draft', tanggalDitetapkan: '2023-01-20', tentang: 'Rencana induk lima tahunan pengembangan ekonomi kreatif', fileUrl: '#' },
];

const EMPTY_REGULASI: Regulasi = { id: 0, judul: '', nomor: '', jenis: '', tahun: new Date().getFullYear(), status: 'Draft', tanggalDitetapkan: '', tentang: '', fileUrl: '' };

const CmsRegulasi = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<Regulasi[]>(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editItem, setEditItem] = useState<Regulasi>(EMPTY_REGULASI);
  const [isEdit, setIsEdit] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Dokumen & Regulasi' }, { label: 'Regulasi' }];

  const filtered = data.filter((d) => {
    const matchSearch = d.judul.toLowerCase().includes(globalFilter.toLowerCase()) || d.nomor.toLowerCase().includes(globalFilter.toLowerCase());
    const matchJenis = !filterJenis || d.jenis === filterJenis;
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchSearch && matchJenis && matchStatus;
  });

  const totalBerlaku = data.filter((d) => d.status === 'Berlaku').length;
  const totalDicabut = data.filter((d) => d.status === 'Dicabut').length;
  const totalDraft = data.filter((d) => d.status === 'Draft').length;

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Total Regulasi', value: data.length, icon: 'pi pi-book', color: '#3B82F6' },
    { label: 'Berlaku', value: totalBerlaku, icon: 'pi pi-check-circle', color: '#10B981' },
    { label: 'Dicabut', value: totalDicabut, icon: 'pi pi-times-circle', color: '#EF4444' },
    { label: 'Draft', value: totalDraft, icon: 'pi pi-file-edit', color: '#F59E0B' },
  ];

  /* ---------- CRUD ---------- */
  const openNew = () => { setEditItem({ ...EMPTY_REGULASI, id: Date.now() }); setIsEdit(false); setDialogVisible(true); };
  const openEdit = (item: Regulasi) => { setEditItem({ ...item }); setIsEdit(true); setDialogVisible(true); };
  const saveItem = () => {
    if (!editItem.judul || !editItem.nomor || !editItem.jenis) { toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Judul, Nomor & Jenis wajib diisi' }); return; }
    if (isEdit) { setData((prev) => prev.map((d) => (d.id === editItem.id ? editItem : d))); toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Regulasi diperbarui' }); }
    else { setData((prev) => [editItem, ...prev]); toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Regulasi ditambahkan' }); }
    setDialogVisible(false);
  };
  const confirmDelete = (item: Regulasi) => {
    confirmDialog({ message: `Hapus regulasi "${item.judul}"?`, header: 'Konfirmasi Hapus', icon: 'pi pi-exclamation-triangle', acceptLabel: 'Hapus', rejectLabel: 'Batal', acceptClassName: 'p-button-danger',
      accept: () => { setData((prev) => prev.filter((d) => d.id !== item.id)); toast.current?.show({ severity: 'info', summary: 'Dihapus', detail: 'Regulasi berhasil dihapus' }); },
    });
  };

  /* ---------- Column Templates ---------- */
  const judulTemplate = (row: Regulasi) => (
    <div>
      <div style={{ fontWeight: 600 }}>{row.judul}</div>
      <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 2 }}>{row.tentang}</div>
    </div>
  );

  const jenisTemplate = (row: Regulasi) => {
    const colorMap: Record<string, string> = { Perda: '#3B82F6', Perwali: '#6366F1', SK: '#10B981', Instruksi: '#F59E0B', SE: '#EC4899' };
    return <Tag value={row.jenis} rounded style={{ background: colorMap[row.jenis] || '#6B7280' }} />;
  };

  const statusTemplate = (row: Regulasi) => {
    const sev: Record<string, 'success' | 'danger' | 'warning'> = { Berlaku: 'success', Dicabut: 'danger', Draft: 'warning' };
    return <Tag value={row.status} severity={sev[row.status] || 'info'} rounded />;
  };

  const tanggalTemplate = (row: Regulasi) => (
    <span style={{ fontSize: '0.85rem' }}>{row.tanggalDitetapkan ? new Date(row.tanggalDitetapkan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
  );

  const actionTemplate = (row: Regulasi) => (
    <div style={{ display: 'flex', gap: 4 }}>
      <Button icon="pi pi-download" text rounded severity="info" size="small" tooltip="Download" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-pencil" text rounded severity="warning" size="small" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" size="small" onClick={() => confirmDelete(row)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const header = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari regulasi..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 240 }} />
      </span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Dropdown value={filterJenis} options={[{ label: 'Semua Jenis', value: '' }, ...JENIS_OPTIONS]} onChange={(e) => setFilterJenis(e.value)} style={{ width: 160 }} />
        <Dropdown value={filterStatus} options={[{ label: 'Semua Status', value: '' }, ...STATUS_OPTIONS]} onChange={(e) => setFilterStatus(e.value)} style={{ width: 150 }} />
        <Button label="Tambah Regulasi" icon="pi pi-plus" raised onClick={openNew} />
      </div>
    </div>
  );

  /* ---------- Dialog Footer ---------- */
  const dialogFooter = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button label="Batal" icon="pi pi-times" outlined onClick={() => setDialogVisible(false)} />
      <Button label="Simpan" icon="pi pi-check" onClick={saveItem} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Toast ref={toast} />
      <ConfirmDialog />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Dokumen Regulasi</h2>
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
        <DataTable value={filtered} header={header} emptyMessage="Belum ada data regulasi" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} stripedRows removableSort dataKey="id" rowHover>
          <Column header="Judul" body={judulTemplate} sortable sortField="judul" style={{ minWidth: 280 }} />
          <Column header="Nomor" field="nomor" sortable style={{ minWidth: 150, fontFamily: 'monospace', fontSize: '0.85rem' }} />
          <Column header="Jenis" body={jenisTemplate} sortable sortField="jenis" style={{ minWidth: 120 }} />
          <Column header="Tahun" field="tahun" sortable style={{ minWidth: 90 }} />
          <Column header="Ditetapkan" body={tanggalTemplate} sortable sortField="tanggalDitetapkan" style={{ minWidth: 130 }} />
          <Column header="Status" body={statusTemplate} sortable sortField="status" style={{ minWidth: 100 }} />
          <Column header="Aksi" body={actionTemplate} style={{ minWidth: 140 }} />
        </DataTable>
      </Card>

      {/* Form Dialog */}
      <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} header={isEdit ? 'Edit Regulasi' : 'Tambah Regulasi'} style={{ width: 560 }} modal footer={dialogFooter}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Judul Regulasi *</label>
            <InputText value={editItem.judul} onChange={(e) => setEditItem({ ...editItem, judul: e.target.value })} style={{ width: '100%' }} placeholder="Masukkan judul regulasi" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Nomor *</label>
              <InputText value={editItem.nomor} onChange={(e) => setEditItem({ ...editItem, nomor: e.target.value })} style={{ width: '100%' }} placeholder="No. xx Tahun xxxx" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Jenis *</label>
              <Dropdown value={editItem.jenis} options={JENIS_OPTIONS} onChange={(e) => setEditItem({ ...editItem, jenis: e.value })} placeholder="Pilih jenis" style={{ width: '100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Tahun</label>
              <InputText value={String(editItem.tahun)} onChange={(e) => setEditItem({ ...editItem, tahun: Number(e.target.value) || 0 })} style={{ width: '100%' }} keyfilter="int" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Status</label>
              <Dropdown value={editItem.status} options={STATUS_OPTIONS} onChange={(e) => setEditItem({ ...editItem, status: e.value })} style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6, display: 'block' }}>Tentang</label>
            <InputTextarea value={editItem.tentang} onChange={(e) => setEditItem({ ...editItem, tentang: e.target.value })} rows={3} style={{ width: '100%' }} placeholder="Deskripsi singkat regulasi" />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CmsRegulasi;
