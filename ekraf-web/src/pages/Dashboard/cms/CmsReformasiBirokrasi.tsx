import { useState, useEffect, useCallback } from 'react';
import { reformasiBirokrasiService } from '../../../services';
import type { ReformasiBirokrasi } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';

const CmsReformasiBirokrasi = () => {
  const [items, setItems] = useState<ReformasiBirokrasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ReformasiBirokrasi | null>(null);
  const [form, setForm] = useState({ title: '', content: '', category: '' });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'CMS' }, { label: 'Reformasi Birokrasi' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await reformasiBirokrasiService.list({ page, per_page: 10, search: search || undefined });
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', content: '', category: '' });
    setShowModal(true);
  };

  const openEdit = (item: ReformasiBirokrasi) => {
    setEditItem(item);
    setForm({ title: item.title, content: item.content || '', category: item.category || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) { await reformasiBirokrasiService.update(editItem.id, form); }
      else { await reformasiBirokrasiService.create(form); }
      setShowModal(false);
      fetchData();
    } catch { alert('Gagal menyimpan data'); }
    finally { setSubmitting(false); }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({ message: 'Apakah Anda yakin ingin menghapus data ini?', header: 'Konfirmasi Hapus', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', acceptLabel: 'Hapus', rejectLabel: 'Batal',
      accept: async () => { try { await reformasiBirokrasiService.destroy(id); fetchData(); } catch { alert('Gagal menghapus'); } },
    });
  };

  const actionBodyTemplate = (row: ReformasiBirokrasi) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('rb-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <ConfirmDialog />
      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Reformasi Birokrasi</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none p-0 mt-2" />
        </div>
        <Button label="Tambah Data" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>
      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <span className="p-input-icon-left"><i className="pi pi-search" /><InputText value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari..." className="border-round-xl w-20rem" /></span>
          <span className="text-sm text-500">Total: {total} data</span>
        </div>
        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data" className="border-round-lg">
          <Column field="title" header="Judul" className="font-medium" style={{ minWidth: '250px' }} />
          <Column field="category" header="Kategori" style={{ minWidth: '150px' }} body={(row: ReformasiBirokrasi) => <span className="text-700">{row.category || '-'}</span>} />
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
      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Data' : 'Tambah Data Baru'} footer={dialogFooter} style={{ width: '540px' }} modal className="border-round-xl" draggable={false}>
        <form id="rb-form" onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Judul</label><InputText value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="border-round-lg" /></div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Kategori</label><InputText value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border-round-lg" /></div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Konten</label><InputTextarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} className="border-round-lg" autoResize /></div>
        </form>
      </Dialog>
    </div>
  );
};

export default CmsReformasiBirokrasi;
