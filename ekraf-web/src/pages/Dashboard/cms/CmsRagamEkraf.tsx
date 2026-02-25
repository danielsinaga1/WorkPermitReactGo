import { useState, useEffect, useCallback } from 'react';
import { ragamEkrafService } from '../../../services';
import type { RagamEkraf } from '../../../types';
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

const CmsRagamEkraf = () => {
  const [items, setItems] = useState<RagamEkraf[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<RagamEkraf | null>(null);
  const [form, setForm] = useState({ title: '', content: '', date: '', thumbnail: '', subsektor_id: null as number | null, is_published: true });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'CMS' }, { label: 'Ragam Ekraf' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ragamEkrafService.list({ page, per_page: 10, search: search || undefined });
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      setError('Gagal memuat data ragam ekraf');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0], thumbnail: '', subsektor_id: null, is_published: true });
    setShowModal(true);
  };

  const openEdit = (item: RagamEkraf) => {
    setEditItem(item);
    setForm({ title: item.title, content: item.content || '', date: item.date ? item.date.split('T')[0] : '', thumbnail: item.thumbnail || '', subsektor_id: item.subsektor_id ?? null, is_published: item.is_published });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, subsektor_id: form.subsektor_id || null };
      if (editItem) { await ragamEkrafService.update(editItem.id, payload); }
      else { await ragamEkrafService.create(payload); }
      setShowModal(false);
      fetchData();
    } catch { alert('Gagal menyimpan ragam ekraf'); }
    finally { setSubmitting(false); }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({ message: 'Apakah Anda yakin ingin menghapus data ini?', header: 'Konfirmasi Hapus', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', acceptLabel: 'Hapus', rejectLabel: 'Batal',
      accept: async () => { try { await ragamEkrafService.destroy(id); fetchData(); } catch { alert('Gagal menghapus'); } },
    });
  };

  const statusBodyTemplate = (row: RagamEkraf) => (<Tag value={row.is_published ? 'Published' : 'Draft'} severity={row.is_published ? 'success' : 'warning'} className="text-xs" />);
  const dateBodyTemplate = (row: RagamEkraf) => (<span className="text-sm">{row.date ? new Date(row.date).toLocaleDateString('id-ID') : '-'}</span>);
  const subsektorBodyTemplate = (row: RagamEkraf) => (<span className="text-sm">{row.subsektor?.nama || '-'}</span>);
  const actionBodyTemplate = (row: RagamEkraf) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex gap-2 pt-2 justify-content-end">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('ragam-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex gap-4 flex-column">
      <ConfirmDialog />
      <div className="flex flex-wrap gap-3 align-items-center justify-content-between">
        <div>
          <h2 className="m-0 text-2xl font-bold text-800">Ragam Ekonomi Kreatif</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="p-0 mt-2 border-none surface-ground" />
        </div>
        <Button label="Tambah Data" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex flex-wrap gap-3 mb-4 align-items-center justify-content-between">
          <span className="p-input-icon-left"><i className="pi pi-search" /><InputText value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari ragam ekraf..." className="border-round-xl w-20rem" /></span>
          <span className="text-sm text-500">Total: {total} data</span>
        </div>
        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data" className="border-round-lg">
          <Column field="title" header="Judul" className="font-medium" style={{ minWidth: '200px' }} />
          <Column header="Sub-sektor" body={subsektorBodyTemplate} style={{ minWidth: '120px' }} />
          <Column header="Tanggal" body={dateBodyTemplate} style={{ minWidth: '120px' }} />
          <Column header="Status" body={statusBodyTemplate} alignHeader="center" bodyClassName="text-center" style={{ width: '100px' }} />
          <Column header="Aksi" body={actionBodyTemplate} style={{ width: '100px' }} />
        </DataTable>
        {lastPage > 1 && (
          <div className="flex pt-3 mt-3 align-items-center justify-content-between border-top-1 surface-border">
            <span className="text-sm text-500">Halaman {page} dari {lastPage}</span>
            <div className="flex gap-2">
              <Button label="Prev" icon="pi pi-chevron-left" severity="secondary" text size="small" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} />
              <Button label="Next" icon="pi pi-chevron-right" iconPos="right" severity="secondary" text size="small" onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page >= lastPage} />
            </div>
          </div>
        )}
      </Card>

      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Ragam Ekraf' : 'Tambah Ragam Ekraf'} footer={dialogFooter} style={{ width: '540px' }} modal className="border-round-xl" draggable={false}>
        <form id="ragam-form" onSubmit={handleSubmit} className="flex gap-3 pt-2 flex-column">
          <div className="flex gap-2 flex-column"><label className="text-sm font-medium text-800">Judul</label><InputText value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="border-round-lg" /></div>
          <div className="flex gap-2 flex-column"><label className="text-sm font-medium text-800">Konten</label><InputTextarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="border-round-lg" autoResize /></div>
          <div className="grid">
            <div className="flex gap-2 col-6 flex-column"><label className="text-sm font-medium text-800">Tanggal</label><InputText type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required className="border-round-lg" /></div>
            <div className="flex gap-2 col-6 flex-column"><label className="text-sm font-medium text-800">Status</label><Dropdown value={form.is_published} options={[{ label: 'Published', value: true }, { label: 'Draft', value: false }]} onChange={e => setForm({ ...form, is_published: e.value })} className="border-round-lg" /></div>
          </div>
          <div className="flex gap-2 flex-column"><label className="text-sm font-medium text-800">URL Thumbnail</label><InputText value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." className="border-round-lg" /></div>
        </form>
      </Dialog>
    </div>
  );
};

export default CmsRagamEkraf;
