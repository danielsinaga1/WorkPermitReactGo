import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Avatar } from 'primereact/avatar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

const DEMO_DATA = [
  { id: 1, program: 'Bantuan Mesin Jahit', jenis: 'Mesin Jahit', penerima: 'Siti Rahayu', subsektor: 'Fashion', tanggal: '2025-05-20', status: 'tersalurkan' },
  { id: 2, program: 'Bantuan Peralatan Dapur', jenis: 'Peralatan Masak', penerima: 'Ahmad Bakri', subsektor: 'Kuliner', tanggal: '2025-06-01', status: 'tersalurkan' },
  { id: 3, program: 'Bantuan Kamera DSLR', jenis: 'Kamera', penerima: 'Dian Permata', subsektor: 'Fotografi', tanggal: '2025-06-15', status: 'proses' },
  { id: 4, program: 'Bantuan Alat Kriya', jenis: 'Peralatan Ukir', penerima: 'Bambang Sutrisno', subsektor: 'Kriya', tanggal: '2025-07-01', status: 'diajukan' },
  { id: 5, program: 'Bantuan Komputer Desain', jenis: 'Komputer', penerima: 'Wati Kurniasih', subsektor: 'Desain', tanggal: '2025-06-28', status: 'tersalurkan' },
];

const STATUS_MAP: Record<string, { severity: 'success' | 'warning' | 'info'; label: string }> = {
  tersalurkan: { severity: 'success', label: 'Tersalurkan' },
  proses: { severity: 'warning', label: 'Dalam Proses' },
  diajukan: { severity: 'info', label: 'Diajukan' },
};

const JENIS_OPTIONS = [
  { label: 'Mesin Jahit', value: 'Mesin Jahit' },
  { label: 'Peralatan Masak', value: 'Peralatan Masak' },
  { label: 'Kamera', value: 'Kamera' },
  { label: 'Peralatan Ukir', value: 'Peralatan Ukir' },
  { label: 'Komputer', value: 'Komputer' },
  { label: 'Lainnya', value: 'Lainnya' },
];

const BantuanAlat = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Bantuan & Hibah' },
    { label: 'Bantuan Alat' },
  ];

  const stats = [
    { label: 'Total Program', value: data.length, icon: 'pi pi-box', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Tersalurkan', value: data.filter(d => d.status === 'tersalurkan').length, icon: 'pi pi-check-circle', color: '#22c55e', bg: '#ecfdf5' },
    { label: 'Dalam Proses', value: data.filter(d => d.status === 'proses').length, icon: 'pi pi-spinner', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Pengajuan Baru', value: data.filter(d => d.status === 'diajukan').length, icon: 'pi pi-file', color: '#3b82f6', bg: '#eff6ff' },
  ];

  const programTemplate = (row: typeof DEMO_DATA[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar icon="pi pi-box" shape="circle" style={{ backgroundColor: '#6366f1', color: '#fff' }} />
      <div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.program}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.jenis}</div>
      </div>
    </div>
  );

  const penerimaTemplate = (row: typeof DEMO_DATA[0]) => (
    <div>
      <div style={{ fontWeight: 500, color: '#1e293b' }}>{row.penerima}</div>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.subsektor}</div>
    </div>
  );

  const statusTemplate = (row: typeof DEMO_DATA[0]) => {
    const s = STATUS_MAP[row.status] || { severity: 'info' as const, label: row.status };
    return <Tag value={s.label} severity={s.severity} />;
  };

  const tanggalTemplate = (row: typeof DEMO_DATA[0]) =>
    new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const confirmDelete = (row: typeof DEMO_DATA[0]) => {
    confirmDialog({
      message: `Hapus program "${row.program}"?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: () => { /* TODO */ },
    });
  };

  const aksiTemplate = (row: typeof DEMO_DATA[0]) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button icon="pi pi-eye" rounded text severity="info" tooltip="Detail" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-pencil" rounded text severity="warning" tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Hapus" tooltipOptions={{ position: 'top' }} onClick={() => confirmDelete(row)} />
    </div>
  );

  const tableHeader = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
      <h3 style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>
        <i className="pi pi-list" style={{ marginRight: '8px' }} />Program Bantuan Alat
      </h3>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari program..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: '240px' }} />
      </span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ConfirmDialog />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />
        <Button label="Tambah Program" icon="pi pi-plus" raised onClick={() => setShowDialog(true)} />
      </div>

      <div className="grid">
        {stats.map((s, i) => (
          <div className="col-12 md:col-6 lg:col-3" key={i}>
            <Card style={{ borderLeft: `4px solid ${s.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={s.icon} style={{ fontSize: '1.25rem', color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.label}</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Card>
        <DataTable value={data} header={tableHeader} globalFilter={globalFilter} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} stripedRows removableSort responsiveLayout="scroll" emptyMessage="Belum ada program bantuan alat">
          <Column header="No" body={(_r, o) => (o.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Program" body={programTemplate} sortable sortField="program" />
          <Column header="Penerima" body={penerimaTemplate} sortable sortField="penerima" />
          <Column header="Tanggal" body={tanggalTemplate} sortable sortField="tanggal" />
          <Column header="Status" body={statusTemplate} sortable sortField="status" style={{ width: '130px' }} />
          <Column header="Aksi" body={aksiTemplate} style={{ width: '140px' }} />
        </DataTable>
      </Card>

      <Dialog visible={showDialog} onHide={() => setShowDialog(false)} header="Tambah Program Bantuan Alat" modal style={{ width: '520px' }} draggable={false}
        footer={<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}><Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowDialog(false)} /><Button label="Simpan" icon="pi pi-check" /></div>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Nama Program</label>
            <InputText placeholder="Masukkan nama program" />
          </div>
          <div className="grid">
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Jenis Alat</label>
              <Dropdown options={JENIS_OPTIONS} placeholder="Pilih jenis" />
            </div>
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Penerima</label>
              <InputText placeholder="Nama penerima" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Keterangan</label>
            <InputTextarea rows={3} autoResize placeholder="Keterangan program" />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default BantuanAlat;
