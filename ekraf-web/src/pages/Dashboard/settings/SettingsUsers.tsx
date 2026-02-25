import { useState, useEffect, useCallback } from 'react';
import { adminUserService } from '../../../services';
import type { User, UserRole } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';

const ROLE_OPTIONS: UserRole[] = ['admin', 'editor', 'masyarakat', 'admin_okp', 'pengelola'];

const roleSeverity = (role: string): 'danger' | 'info' | 'success' | 'warning' | 'secondary' | undefined => {
  const map: Record<string, 'danger' | 'info' | 'success' | 'warning' | 'secondary'> = {
    admin: 'danger',
    editor: 'info',
    masyarakat: 'success',
    admin_okp: 'warning',
    pengelola: 'secondary',
  };
  return map[role];
};

const SettingsUsers = () => {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'masyarakat' as UserRole, nik: '', no_telp: '', alamat: '' });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'Pengaturan' }, { label: 'Daftar User' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const roleDropdownOptions = [
    { label: 'Semua Role', value: '' },
    ...ROLE_OPTIONS.map(r => ({ label: r.charAt(0).toUpperCase() + r.slice(1), value: r })),
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, unknown> = { page, per_page: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await adminUserService.list(params as Parameters<typeof adminUserService.list>[0]);
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      setError('Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', email: '', password: '', role: 'masyarakat', nik: '', no_telp: '', alamat: '' });
    setShowModal(true);
  };

  const openEdit = (item: User) => {
    setEditItem(item);
    setForm({
      name: item.name,
      email: item.email,
      password: '',
      role: (item.role as UserRole) || 'masyarakat',
      nik: item.nik || '',
      no_telp: item.no_telp || '',
      alamat: item.alamat || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        const { password, ...rest } = form;
        await adminUserService.update(editItem.id, password ? form : rest);
      } else {
        if (!form.password) { alert('Password wajib diisi'); setSubmitting(false); return; }
        await adminUserService.create(form);
      }
      setShowModal(false);
      fetchData();
    } catch {
      alert('Gagal menyimpan user');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: 'Apakah Anda yakin ingin menghapus user ini?',
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminUserService.destroy(id);
          fetchData();
        } catch {
          alert('Gagal menghapus user');
        }
      },
    });
  };

  const toggleActive = async (item: User) => {
    try {
      await adminUserService.update(item.id, { is_active: !item.is_active });
      fetchData();
    } catch {
      alert('Gagal mengubah status user');
    }
  };

  const roleBodyTemplate = (row: User) => (
    <Tag value={row.role} severity={roleSeverity(row.role)} className="text-xs capitalize" />
  );

  const statusBodyTemplate = (row: User) => (
    <Button
      label={row.is_active ? 'Aktif' : 'Nonaktif'}
      severity={row.is_active ? 'success' : 'danger'}
      text
      size="small"
      className="text-xs font-semibold"
      onClick={() => toggleActive(row)}
      tooltip="Klik untuk toggle"
      tooltipOptions={{ position: 'top' }}
    />
  );

  const actionBodyTemplate = (row: User) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('user-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <ConfirmDialog />

      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Daftar User</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none p-0 mt-2" />
        </div>
        <Button label="Tambah User" icon="pi pi-user-plus" className="border-round-xl" onClick={openCreate} />
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div className="flex gap-3 flex-wrap">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nama atau email..." className="border-round-xl w-20rem" />
            </span>
            <Dropdown
              value={roleFilter}
              options={roleDropdownOptions}
              onChange={(e) => { setRoleFilter(e.value); setPage(1); }}
              className="border-round-xl"
              style={{ width: '180px' }}
            />
          </div>
          <span className="text-sm text-500">Total: {total} user</span>
        </div>

        {error && <Message severity="error" text={error} className="w-full mb-3" />}

        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data user" className="border-round-lg">
          <Column field="name" header="Nama" className="font-medium" style={{ minWidth: '150px' }} />
          <Column field="email" header="Email" style={{ minWidth: '180px' }} />
          <Column header="Role" body={roleBodyTemplate} alignHeader="center" bodyClassName="text-center" style={{ width: '120px' }} />
          <Column header="Status" body={statusBodyTemplate} alignHeader="center" bodyClassName="text-center" style={{ width: '100px' }} />
          <Column header="Aksi" body={actionBodyTemplate} style={{ width: '100px' }} />
        </DataTable>

        {lastPage > 1 && (
          <div className="flex align-items-center justify-content-between pt-3 mt-3 border-top-1 surface-border">
            <span className="text-sm text-500">Halaman {page} dari {lastPage}</span>
            <div className="flex gap-2">
              <Button label="Prev" icon="pi pi-chevron-left" severity="secondary" text size="small" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} />
              <Button label="Next" icon="pi pi-chevron-right" iconPos="right" severity="secondary" text size="small" onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page >= lastPage} />
            </div>
          </div>
        )}
      </Card>

      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit User' : 'Tambah User Baru'} footer={dialogFooter} style={{ width: '540px' }} modal className="border-round-xl" draggable={false}>
        <form id="user-form" onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">
          <div className="flex flex-column gap-2">
            <label className="font-medium text-sm text-800">Nama</label>
            <InputText value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="border-round-lg" />
          </div>
          <div className="flex flex-column gap-2">
            <label className="font-medium text-sm text-800">Email</label>
            <InputText type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="border-round-lg" />
          </div>
          <div className="flex flex-column gap-2">
            <label className="font-medium text-sm text-800">Password {editItem && '(kosongkan jika tidak diubah)'}</label>
            <Password value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} toggleMask feedback={false} required={!editItem} className="w-full" inputClassName="w-full border-round-lg" />
          </div>
          <div className="flex flex-column gap-2">
            <label className="font-medium text-sm text-800">Role</label>
            <Dropdown value={form.role} options={ROLE_OPTIONS.map(r => ({ label: r.charAt(0).toUpperCase() + r.slice(1), value: r }))} onChange={e => setForm({ ...form, role: e.value })} className="border-round-lg" />
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-2">
              <label className="font-medium text-sm text-800">NIK</label>
              <InputText value={form.nik} onChange={e => setForm({ ...form, nik: e.target.value })} className="border-round-lg" />
            </div>
            <div className="col-6 flex flex-column gap-2">
              <label className="font-medium text-sm text-800">No. Telp</label>
              <InputText value={form.no_telp} onChange={e => setForm({ ...form, no_telp: e.target.value })} className="border-round-lg" />
            </div>
          </div>
          <div className="flex flex-column gap-2">
            <label className="font-medium text-sm text-800">Alamat</label>
            <InputTextarea value={form.alamat} onChange={e => setForm({ ...form, alamat: e.target.value })} rows={2} className="border-round-lg" autoResize />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default SettingsUsers;
