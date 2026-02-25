import { useState, useEffect, useCallback } from 'react';
import { profilPimpinanService } from '../../../services';
import type { ProfilPimpinan } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';

const CmsProfilPimpinan = () => {
  const [items, setItems] = useState<ProfilPimpinan[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ProfilPimpinan | null>(null);
  const [form, setForm] = useState({ name: '', position: '', photo: '', biography: '', order: 0 });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'CMS' }, { label: 'Profil Pimpinan' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await profilPimpinanService.list({ page, per_page: 10, search: search || undefined });
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      setError('Gagal memuat data profil pimpinan');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', position: '', photo: '', biography: '', order: 0 });
    setShowModal(true);
  };

  const openEdit = (item: ProfilPimpinan) => {
    setEditItem(item);
    setForm({ name: item.name, position: item.position, photo: item.photo || '', biography: item.biography || '', order: item.order });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) { await profilPimpinanService.update(editItem.id, form); }
      else { await profilPimpinanService.create(form); }
      setShowModal(false);
      fetchData();
    } catch { alert('Gagal menyimpan data'); }
    finally { setSubmitting(false); }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({ message: 'Apakah Anda yakin ingin menghapus data ini?', header: 'Konfirmasi Hapus', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', acceptLabel: 'Hapus', rejectLabel: 'Batal',
      accept: async () => { try { await profilPimpinanService.destroy(id); fetchData(); } catch { alert('Gagal menghapus'); } },
    });
  };

  const photoBodyTemplate = (row: ProfilPimpinan) => (
    <div className="flex gap-3 align-items-center">
      {row.photo && <img src={row.photo} alt="" className="border-round" style={{ width: 40, height: 40, objectFit: 'cover' }} />}
      <span className="font-medium text-800">{row.name}</span>
    </div>
  );

  const actionBodyTemplate = (row: ProfilPimpinan) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('pimpinan-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <ConfirmDialog />
      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Profil Pimpinan</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none p-0 mt-2" />
        </div>
        <Button label="Tambah Pimpinan" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>
      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <span className="p-input-icon-left"><i className="pi pi-search" /><InputText value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari pimpinan..." className="border-round-xl w-20rem" /></span>
          <span className="text-sm text-500">Total: {total} data</span>
        </div>
        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data" className="border-round-lg">
          <Column header="Nama" body={photoBodyTemplate} style={{ minWidth: '200px' }} />
          <Column field="position" header="Jabatan" style={{ minWidth: '160px' }} />
          <Column field="order" header="Urutan" style={{ width: '80px' }} bodyClassName="text-center" alignHeader="center" />
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
      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Pimpinan' : 'Tambah Pimpinan'} footer={dialogFooter} style={{ width: '540px' }} modal className="border-round-xl" draggable={false}>
        <form id="pimpinan-form" onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Nama</label><InputText value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="border-round-lg" /></div>
          <div className="grid">
            <div className="col-8 flex flex-column gap-2"><label className="font-medium text-sm text-800">Jabatan</label><InputText value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} required className="border-round-lg" /></div>
            <div className="col-4 flex flex-column gap-2"><label className="font-medium text-sm text-800">Urutan</label><InputNumber value={form.order} onValueChange={e => setForm({ ...form, order: e.value ?? 0 })} className="border-round-lg" inputClassName="border-round-lg" /></div>
          </div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Biografi</label><InputTextarea value={form.biography} onChange={e => setForm({ ...form, biography: e.target.value })} rows={4} className="border-round-lg" autoResize /></div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">URL Foto</label><InputText value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} placeholder="https://..." className="border-round-lg" /></div>
        </form>
      </Dialog>
    </div>
  );
};

export default CmsProfilPimpinan;
