import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Avatar } from 'primereact/avatar';

const DEMO_DATA = [
  { id: 1, nama: 'Ahmad Fauzi', email: 'ahmad@email.com', event: 'Pelatihan Digital Marketing', tanggal: '2025-07-10', status: 'hadir' },
  { id: 2, nama: 'Siti Nurhaliza', email: 'siti@email.com', event: 'Workshop Fotografi Produk', tanggal: '2025-07-12', status: 'terdaftar' },
  { id: 3, nama: 'Rudi Hermawan', email: 'rudi@email.com', event: 'Pelatihan Digital Marketing', tanggal: '2025-07-10', status: 'hadir' },
  { id: 4, nama: 'Lina Marlina', email: 'lina@email.com', event: 'Kelas Desain Kemasan', tanggal: '2025-07-15', status: 'tidak_hadir' },
  { id: 5, nama: 'Doni Saputra', email: 'doni@email.com', event: 'Pelatihan E-Commerce', tanggal: '2025-06-28', status: 'hadir' },
  { id: 6, nama: 'Wulan Sari', email: 'wulan@email.com', event: 'Workshop Fotografi Produk', tanggal: '2025-07-12', status: 'terdaftar' },
];

const STATUS_MAP: Record<string, { severity: 'success' | 'warning' | 'danger'; label: string }> = {
  hadir: { severity: 'success', label: 'Hadir' },
  terdaftar: { severity: 'warning', label: 'Terdaftar' },
  tidak_hadir: { severity: 'danger', label: 'Tidak Hadir' },
};

const EVENT_OPTIONS = [
  { label: 'Semua Event', value: '' },
  { label: 'Pelatihan Digital Marketing', value: 'Pelatihan Digital Marketing' },
  { label: 'Workshop Fotografi Produk', value: 'Workshop Fotografi Produk' },
  { label: 'Kelas Desain Kemasan', value: 'Kelas Desain Kemasan' },
  { label: 'Pelatihan E-Commerce', value: 'Pelatihan E-Commerce' },
];

const EventPeserta = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Event & Pelatihan', command: () => navigate('/dashboard/event') },
    { label: 'Data Peserta' },
  ];

  const filteredData = eventFilter ? data.filter(d => d.event === eventFilter) : data;

  const stats = [
    { label: 'Total Peserta', value: data.length, icon: 'pi pi-users', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Hadir', value: data.filter(d => d.status === 'hadir').length, icon: 'pi pi-check-circle', color: '#22c55e', bg: '#ecfdf5' },
    { label: 'Terdaftar', value: data.filter(d => d.status === 'terdaftar').length, icon: 'pi pi-clock', color: '#f59e0b', bg: '#fffbeb' },
  ];

  const namaTemplate = (row: typeof DEMO_DATA[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar label={row.nama.charAt(0)} shape="circle" style={{ backgroundColor: '#6366f1', color: '#fff' }} />
      <div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.nama}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.email}</div>
      </div>
    </div>
  );

  const statusTemplate = (row: typeof DEMO_DATA[0]) => {
    const s = STATUS_MAP[row.status] || { severity: 'info' as const, label: row.status };
    return <Tag value={s.label} severity={s.severity} />;
  };

  const tanggalTemplate = (row: typeof DEMO_DATA[0]) =>
    new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const aksiTemplate = () => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button icon="pi pi-eye" rounded text severity="info" tooltip="Detail" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-file-export" rounded text severity="success" tooltip="Export" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const tableHeader = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
      <h3 style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>
        <i className="pi pi-users" style={{ marginRight: '8px' }} />Data Peserta
      </h3>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText placeholder="Cari peserta..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: '220px' }} />
        </span>
        <Dropdown value={eventFilter} options={EVENT_OPTIONS} onChange={(e) => setEventFilter(e.value)} placeholder="Semua Event" style={{ width: '240px' }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      {/* KPI Cards */}
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

      {/* DataTable */}
      <Card>
        <DataTable value={filteredData} header={tableHeader} globalFilter={globalFilter} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} stripedRows removableSort responsiveLayout="scroll" emptyMessage="Belum ada data peserta">
          <Column header="No" body={(_r, o) => (o.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Nama Peserta" body={namaTemplate} sortable sortField="nama" />
          <Column field="event" header="Event" sortable />
          <Column header="Tanggal Daftar" body={tanggalTemplate} sortable sortField="tanggal" />
          <Column header="Status" body={statusTemplate} sortable sortField="status" style={{ width: '130px' }} />
          <Column header="Aksi" body={aksiTemplate} style={{ width: '100px' }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default EventPeserta;
