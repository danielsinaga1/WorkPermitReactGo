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
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

const DEMO_DATA = [
  { id: 1, program: 'Modal Usaha Kuliner 2025', anggaran: 150000000, penerima: 12, periode: 'Jan - Jun 2025', status: 'aktif' },
  { id: 2, program: 'Dana Bergulir Fashion', anggaran: 200000000, penerima: 18, periode: 'Mar - Sep 2025', status: 'aktif' },
  { id: 3, program: 'Stimulan Usaha Kriya', anggaran: 100000000, penerima: 8, periode: 'Jan - Des 2024', status: 'selesai' },
  { id: 4, program: 'Modal Usaha Desain Digital', anggaran: 75000000, penerima: 0, periode: 'Jul - Des 2025', status: 'pending' },
  { id: 5, program: 'Bantuan Modal Musik Indie', anggaran: 50000000, penerima: 5, periode: 'Apr - Okt 2025', status: 'aktif' },
];

const STATUS_MAP: Record<string, { severity: 'success' | 'warning' | 'info' | 'danger'; label: string }> = {
  aktif: { severity: 'success', label: 'Aktif' },
  pending: { severity: 'warning', label: 'Pending' },
  selesai: { severity: 'info', label: 'Selesai' },
};

const BantuanModal = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Bantuan & Hibah' },
    { label: 'Bantuan Modal' },
  ];

  const totalDana = data.reduce((a, d) => a + d.anggaran, 0);
  const totalPenerima = data.reduce((a, d) => a + d.penerima, 0);
  const pendingCount = data.filter(d => d.status === 'pending').length;

  const stats = [
    { label: 'Total Dana Tersalurkan', value: `Rp ${(totalDana / 1e6).toFixed(0)}jt`, icon: 'pi pi-wallet', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Penerima Bantuan', value: totalPenerima, icon: 'pi pi-users', color: '#22c55e', bg: '#ecfdf5' },
    { label: 'Pengajuan Pending', value: pendingCount, icon: 'pi pi-clock', color: '#f59e0b', bg: '#fffbeb' },
  ];

  const programTemplate = (row: typeof DEMO_DATA[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar icon="pi pi-wallet" shape="circle" style={{ backgroundColor: '#6366f1', color: '#fff' }} />
      <span style={{ fontWeight: 600, color: '#1e293b' }}>{row.program}</span>
    </div>
  );

  const anggaranTemplate = (row: typeof DEMO_DATA[0]) => (
    <span style={{ fontWeight: 600, color: '#334155' }}>Rp {row.anggaran.toLocaleString('id-ID')}</span>
  );

  const penerimaTemplate = (row: typeof DEMO_DATA[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <i className="pi pi-users" style={{ fontSize: '0.8rem', color: '#94a3b8' }} />
      <span>{row.penerima} orang</span>
    </div>
  );

  const statusTemplate = (row: typeof DEMO_DATA[0]) => {
    const s = STATUS_MAP[row.status] || { severity: 'info' as const, label: row.status };
    return <Tag value={s.label} severity={s.severity} />;
  };

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
        <i className="pi pi-list" style={{ marginRight: '8px' }} />Program Bantuan Modal
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
          <div className="col-12 md:col-4" key={i}>
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
        <DataTable value={data} header={tableHeader} globalFilter={globalFilter} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} stripedRows removableSort responsiveLayout="scroll" emptyMessage="Belum ada program bantuan modal">
          <Column header="No" body={(_r, o) => (o.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Nama Program" body={programTemplate} sortable sortField="program" />
          <Column header="Anggaran" body={anggaranTemplate} sortable sortField="anggaran" />
          <Column header="Penerima" body={penerimaTemplate} sortable sortField="penerima" style={{ width: '130px' }} />
          <Column field="periode" header="Periode" sortable />
          <Column header="Status" body={statusTemplate} sortable sortField="status" style={{ width: '120px' }} />
          <Column header="Aksi" body={aksiTemplate} style={{ width: '140px' }} />
        </DataTable>
      </Card>

      <Dialog visible={showDialog} onHide={() => setShowDialog(false)} header="Tambah Program Bantuan Modal" modal style={{ width: '520px' }} draggable={false}
        footer={<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}><Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowDialog(false)} /><Button label="Simpan" icon="pi pi-check" /></div>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Nama Program</label>
            <InputText placeholder="Masukkan nama program" />
          </div>
          <div className="grid">
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Anggaran</label>
              <InputNumber mode="currency" currency="IDR" locale="id-ID" placeholder="Jumlah anggaran" />
            </div>
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Periode</label>
              <Dropdown options={[{ label: 'Jan - Jun 2025', value: 'Jan - Jun 2025' }, { label: 'Jul - Des 2025', value: 'Jul - Des 2025' }]} placeholder="Pilih periode" />
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

export default BantuanModal;
