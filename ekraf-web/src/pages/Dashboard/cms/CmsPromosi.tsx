import { useState, useEffect, useCallback } from 'react';
import { promosiService } from '../../../services';
import type { Promosi } from '../../../types';
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

const CmsPromosi = () => {
  const [items, setItems] = useState<Promosi[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Promosi | null>(null);
  const [form, setForm] = useState({ title: '', content: '', date: '', thumbnail: '', is_published: true });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'CMS' }, { label: 'Promosi' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await promosiService.list({ page, per_page: 10, search: search || undefined });
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      setError('Gagal memuat data promosi');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0], thumbnail: '', is_published: true });
    setShowModal(true);
  };

  const openEdit = (item: Promosi) => {
    setEditItem(item);
    setForm({ title: item.title, content: item.content || '', date: item.date ? item.date.split('T')[0] : '', thumbnail: item.thumbnail || '', is_published: item.is_published });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) { await promosiService.update(editItem.id, form); }
      else { await promosiService.create(form); }
      setShowModal(false);
      fetchData();
    } catch { alert('Gagal menyimpan promosi'); }
    finally { setSubmitting(false); }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({ message: 'Apakah Anda yakin ingin menghapus promosi ini?', header: 'Konfirmasi Hapus', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', acceptLabel: 'Hapus', rejectLabel: 'Batal',
      accept: async () => { try { await promosiService.destroy(id); fetchData(); } catch { alert('Gagal menghapus'); } },
    });
  };

  const statusBodyTemplate = (row: Promosi) => (<Tag value={row.is_published ? 'Published' : 'Draft'} severity={row.is_published ? 'success' : 'warning'} className="text-xs" />);
  const dateBodyTemplate = (row: Promosi) => (<span className="text-sm">{row.date ? new Date(row.date).toLocaleDateString('id-ID') : '-'}</span>);
  const actionBodyTemplate = (row: Promosi) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('promosi-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <ConfirmDialog />
      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Promosi</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none p-0 mt-2" />
        </div>
        <Button label="Buat Promosi" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <span className="p-input-icon-left"><i className="pi pi-search" /><InputText value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari promosi..." className="border-round-xl w-20rem" /></span>
          <span className="text-sm text-500">Total: {total} promosi</span>
        </div>
        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data promosi" className="border-round-lg">
          <Column field="title" header="Judul" className="font-medium" style={{ minWidth: '200px' }} />
          <Column header="Tanggal" body={dateBodyTemplate} style={{ minWidth: '120px' }} />
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

      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Promosi' : 'Buat Promosi Baru'} footer={dialogFooter} style={{ width: '540px' }} modal className="border-round-xl" draggable={false}>
        <form id="promosi-form" onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Judul</label><InputText value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="border-round-lg" /></div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Konten</label><InputTextarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="border-round-lg" autoResize /></div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-2"><label className="font-medium text-sm text-800">Tanggal</label><InputText type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required className="border-round-lg" /></div>
            <div className="col-6 flex flex-column gap-2"><label className="font-medium text-sm text-800">Status</label><Dropdown value={form.is_published} options={[{ label: 'Published', value: true }, { label: 'Draft', value: false }]} onChange={e => setForm({ ...form, is_published: e.value })} className="border-round-lg" /></div>
          </div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">URL Thumbnail</label><InputText value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." className="border-round-lg" /></div>
        </form>
      </Dialog>
    </div>
  );
};

export default CmsPromosi;
