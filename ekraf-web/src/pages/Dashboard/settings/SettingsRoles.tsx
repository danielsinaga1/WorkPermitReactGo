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
import { Checkbox } from 'primereact/checkbox';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Badge } from 'primereact/badge';

const DEMO_ROLES = [
  { id: 1, name: 'Admin', desc: 'Akses penuh ke semua fitur', users: 2, permissions: ['create', 'read', 'update', 'delete', 'manage-users', 'settings'], color: '#EF4444', createdAt: '2024-01-01' },
  { id: 2, name: 'Editor', desc: 'Kelola konten dan berita', users: 5, permissions: ['create', 'read', 'update'], color: '#F59E0B', createdAt: '2024-01-15' },
  { id: 3, name: 'User', desc: 'Akses dasar dan profil', users: 150, permissions: ['read'], color: '#3B82F6', createdAt: '2024-01-01' },
  { id: 4, name: 'Masyarakat', desc: 'Akses publik terbatas', users: 1200, permissions: ['read'], color: '#10B981', createdAt: '2024-02-10' },
  { id: 5, name: 'Admin OKP', desc: 'Kelola data organisasi', users: 10, permissions: ['create', 'read', 'update'], color: '#6366F1', createdAt: '2024-03-01' },
  { id: 6, name: 'Pengelola', desc: 'Kelola fasilitas dan destinasi', users: 8, permissions: ['create', 'read', 'update', 'delete'], color: '#8B5CF6', createdAt: '2024-04-01' },
];

const ALL_PERMISSIONS = [
  { label: 'Create', value: 'create' },
  { label: 'Read', value: 'read' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' },
  { label: 'Manage Users', value: 'manage-users' },
  { label: 'Settings', value: 'settings' },
];

const SettingsRoles = () => {
  const navigate = useNavigate();
  const [data] = useState(DEMO_ROLES);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Manajemen User' }, { label: 'Role & Permission' }];

  const filtered = data.filter((d) => d.name.toLowerCase().includes(globalFilter.toLowerCase()) || d.desc.toLowerCase().includes(globalFilter.toLowerCase()));

  const totalUsers = data.reduce((a, b) => a + b.users, 0);

  /* ---------- Column Templates ---------- */
  const nameTemplate = (row: (typeof DEMO_ROLES)[0]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
      <div>
        <div style={{ fontWeight: 600 }}>{row.name}</div>
        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{row.desc}</div>
      </div>
    </div>
  );

  const usersTemplate = (row: (typeof DEMO_ROLES)[0]) => (
    <Badge value={row.users.toLocaleString()} severity={row.users > 100 ? 'info' : 'warning'} />
  );

  const permissionsTemplate = (row: (typeof DEMO_ROLES)[0]) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {row.permissions.slice(0, 3).map((p) => (
        <Tag key={p} value={p} rounded style={{ fontSize: '0.7rem' }} />
      ))}
      {row.permissions.length > 3 && <Tag value={`+${row.permissions.length - 3}`} rounded severity="info" style={{ fontSize: '0.7rem' }} />}
    </div>
  );

  const actionTemplate = (row: (typeof DEMO_ROLES)[0]) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button icon="pi pi-pencil" rounded text severity="info" tooltip="Edit" tooltipOptions={{ position: 'top' }} onClick={() => { setSelectedPermissions(row.permissions); setShowDialog(true); }} />
      <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Hapus" tooltipOptions={{ position: 'top' }} onClick={() => confirmDialog({ message: `Hapus role "${row.name}"?`, header: 'Konfirmasi', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', accept: () => {} })} />
    </div>
  );

  /* ---------- KPI Cards ---------- */
  const kpiCards = [
    { label: 'Total Role', value: data.length, icon: 'pi pi-shield', color: '#3B82F6' },
    { label: 'Total User', value: totalUsers, icon: 'pi pi-users', color: '#10B981' },
    { label: 'Total Permission', value: ALL_PERMISSIONS.length, icon: 'pi pi-lock', color: '#F59E0B' },
  ];

  const header = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Cari role..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} style={{ width: 260 }} />
      </span>
    </div>
  );

  const dialogFooter = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowDialog(false)} />
      <Button label="Simpan" icon="pi pi-check" onClick={() => setShowDialog(false)} />
    </div>
  );

  const onPermissionChange = (value: string) => {
    setSelectedPermissions((prev) => prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ConfirmDialog />

      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Role & Permission</h2>
        <Button label="Tambah Role" icon="pi pi-plus" onClick={() => { setSelectedPermissions([]); setShowDialog(true); }} />
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
        <DataTable value={filtered} paginator rows={10} header={header} emptyMessage="Belum ada data role" stripedRows removableSort dataKey="id" rowHover>
          <Column header="Nama Role" body={nameTemplate} sortable sortField="name" style={{ minWidth: 250 }} />
          <Column header="Jumlah User" body={usersTemplate} sortable sortField="users" style={{ minWidth: 130 }} />
          <Column header="Permissions" body={permissionsTemplate} style={{ minWidth: 220 }} />
          <Column field="createdAt" header="Dibuat" sortable style={{ minWidth: 120 }} />
          <Column header="Aksi" body={actionTemplate} style={{ minWidth: 100 }} />
        </DataTable>
      </Card>

      {/* Dialog Form */}
      <Dialog header="Tambah / Edit Role" visible={showDialog} onHide={() => setShowDialog(false)} style={{ width: '500px' }} footer={dialogFooter} modal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Nama Role</label>
            <InputText placeholder="Nama role" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Deskripsi</label>
            <InputText placeholder="Deskripsi singkat role" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Permissions</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ALL_PERMISSIONS.map((perm) => (
                <div key={perm.value} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Checkbox inputId={perm.value} checked={selectedPermissions.includes(perm.value)} onChange={() => onPermissionChange(perm.value)} />
                  <label htmlFor={perm.value} style={{ cursor: 'pointer' }}>{perm.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SettingsRoles;
