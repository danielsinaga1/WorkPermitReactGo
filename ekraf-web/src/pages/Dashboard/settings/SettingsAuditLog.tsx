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
import { Calendar } from 'primereact/calendar';
import { Avatar } from 'primereact/avatar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const DEMO_DATA = [
  { id: 1, waktu: '2025-06-25 14:32:10', user: 'Admin Utama', aksi: 'login', modul: 'Auth', deskripsi: 'Login berhasil', ip: '192.168.1.10', avatar: 'AU' },
  { id: 2, waktu: '2025-06-25 14:35:22', user: 'Admin Utama', aksi: 'create', modul: 'Berita', deskripsi: 'Membuat berita baru: Festival Budaya 2025', ip: '192.168.1.10', avatar: 'AU' },
  { id: 3, waktu: '2025-06-25 15:10:45', user: 'Editor Konten', aksi: 'update', modul: 'Pengumuman', deskripsi: 'Mengubah pengumuman: Jadwal Libur', ip: '192.168.1.25', avatar: 'EK' },
  { id: 4, waktu: '2025-06-24 09:15:00', user: 'Admin OKP', aksi: 'delete', modul: 'Pelaku DISPOPAR', deskripsi: 'Menghapus data pelaku: ID 45', ip: '10.0.0.5', avatar: 'AO' },
  { id: 5, waktu: '2025-06-24 10:00:30', user: 'Admin Utama', aksi: 'update', modul: 'Settings', deskripsi: 'Mengubah pengaturan umum website', ip: '192.168.1.10', avatar: 'AU' },
  { id: 6, waktu: '2025-06-24 11:22:18', user: 'Pengelola', aksi: 'create', modul: 'Event', deskripsi: 'Membuat event baru: Workshop Fotografi', ip: '192.168.2.30', avatar: 'PG' },
  { id: 7, waktu: '2025-06-23 08:45:00', user: 'Editor Konten', aksi: 'login', modul: 'Auth', deskripsi: 'Login berhasil', ip: '192.168.1.25', avatar: 'EK' },
  { id: 8, waktu: '2025-06-23 16:30:55', user: 'Admin Utama', aksi: 'delete', modul: 'Banner', deskripsi: 'Menghapus banner lama: Promo 2024', ip: '192.168.1.10', avatar: 'AU' },
];

const AKSI_OPTIONS = [
  { label: 'Semua Aksi', value: '' },
  { label: 'Create', value: 'create' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' },
  { label: 'Login', value: 'login' },
];

const AKSI_MAP: Record<string, { severity: 'success' | 'info' | 'warning' | 'danger'; icon: string }> = {
  create: { severity: 'success', icon: 'pi pi-plus' },
  update: { severity: 'info', icon: 'pi pi-pencil' },
  delete: { severity: 'danger', icon: 'pi pi-trash' },
  login: { severity: 'warning', icon: 'pi pi-sign-in' },
};

const SettingsAuditLog = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_DATA);
  const [globalFilter, setGlobalFilter] = useState('');
  const [aksiFilter, setAksiFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Sistem' }, { label: 'Audit Log' }];

  const filtered = data.filter((d) => {
    const matchSearch = d.user.toLowerCase().includes(globalFilter.toLowerCase()) || d.deskripsi.toLowerCase().includes(globalFilter.toLowerCase()) || d.modul.toLowerCase().includes(globalFilter.toLowerCase());
    const matchAksi = !aksiFilter || d.aksi === aksiFilter;
    const matchDate = !dateFilter || d.waktu.startsWith(dateFilter.toISOString().slice(0, 10));
    return matchSearch && matchAksi && matchDate;
  });

  const counts = {
    total: data.length,
    create: data.filter((d) => d.aksi === 'create').length,
    update: data.filter((d) => d.aksi === 'update').length,
    delete: data.filter((d) => d.aksi === 'delete').length,
  };

  /* ---------- Column Templates ---------- */
  const waktuTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div>
      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{new Date(row.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.waktu.split(' ')[1]}</div>
    </div>
  );

  const userTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Avatar label={row.avatar} shape="circle" size="normal" style={{ background: '#6366F1', color: '#fff' }} />
      <span style={{ fontWeight: 500 }}>{row.user}</span>
    </div>
  );

  const aksiTemplate = (row: (typeof DEMO_DATA)[0]) => {
    const a = AKSI_MAP[row.aksi];
    return a ? <Tag icon={a.icon} severity={a.severity} value={` ${row.aksi.toUpperCase()}`} rounded /> : <Tag value={row.aksi} />;
  };

  const ipTemplate = (row: (typeof DEMO_DATA)[0]) => (
    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', background: '#f3f4f6', padding: '2px 8px', borderRadius: 4 }}>{row.ip}</span>
  );

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Total Log', value: counts.total, icon: 'pi pi-list', color: '#3B82F6' },
    { label: 'Create', value: counts.create, icon: 'pi pi-plus-circle', color: '#10B981' },
    { label: 'Update', value: counts.update, icon: 'pi pi-pencil', color: '#6366F1' },
    { label: 'Delete', value: counts.delete, icon: 'pi pi-trash', color: '#EF4444' },
  ];

  const header = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari aktivitas..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 240 }} />
      </span>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Dropdown value={aksiFilter} options={AKSI_OPTIONS} onChange={(e) => setAksiFilter(e.value)} placeholder="Filter Aksi" style={{ width: 160 }} />
        <Calendar value={dateFilter} onChange={(e) => setDateFilter(e.value as Date | null)} placeholder="Filter Tanggal" dateFormat="dd/mm/yy" showIcon showButtonBar style={{ width: 200 }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ConfirmDialog />

      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Audit Log</h2>
        <Button label="Hapus Log Lama" icon="pi pi-trash" severity="danger" outlined onClick={() => confirmDialog({ message: 'Hapus semua log yang lebih dari 30 hari?', header: 'Konfirmasi', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', accept: () => {} })} />
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} style={{ flex: '1 1 180px', borderLeft: `4px solid ${kpi.color}` }}>
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
        <DataTable value={filtered} paginator rows={10} header={header} emptyMessage="Belum ada data audit log" stripedRows removableSort dataKey="id" rowHover>
          <Column header="Waktu" body={waktuTemplate} sortable sortField="waktu" style={{ minWidth: 130 }} />
          <Column header="User" body={userTemplate} sortable sortField="user" style={{ minWidth: 180 }} />
          <Column header="Aksi" body={aksiTemplate} sortable sortField="aksi" style={{ minWidth: 110 }} />
          <Column field="modul" header="Modul" sortable style={{ minWidth: 120 }} />
          <Column field="deskripsi" header="Deskripsi" style={{ minWidth: 250 }} />
          <Column header="IP Address" body={ipTemplate} style={{ minWidth: 140 }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default SettingsAuditLog;
