import { useState, useEffect, useCallback } from 'react';
import { produkHukumService } from '../../../services';
import type { ProdukHukum, KategoriProdukHukum } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';

const KATEGORI_OPTIONS = [
  { label: 'Undang-Undang', value: 'undang_undang' },
  { label: 'Peraturan Pemerintah', value: 'peraturan_pemerintah' },
  { label: 'Peraturan Presiden', value: 'peraturan_presiden' },
  { label: 'Peraturan Menteri', value: 'peraturan_menteri' },
  { label: 'Peraturan Daerah', value: 'peraturan_daerah' },
  { label: 'Naskah Kerja Sama', value: 'naskah_kerja_sama' },
  { label: 'Lainnya', value: 'lainnya' },
];

const CmsProdukHukum = () => {
  const [items, setItems] = useState<ProdukHukum[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ProdukHukum | null>(null);
  const [form, setForm] = useState({ title: '', author: '', date: '', file_url: '', category: 'lainnya' as KategoriProdukHukum, is_published: true });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'CMS' }, { label: 'Produk Hukum' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await produkHukumService.list({ page, per_page: 10, search: search || undefined });
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      setError('Gagal memuat data produk hukum');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', author: '', date: new Date().toISOString().split('T')[0], file_url: '', category: 'lainnya', is_published: true });
    setShowModal(true);
  };

  const openEdit = (item: ProdukHukum) => {
    setEditItem(item);
    setForm({ title: item.title, author: item.author || '', date: item.date ? item.date.split('T')[0] : '', file_url: item.file_url || '', category: item.category, is_published: item.is_published });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) { await produkHukumService.update(editItem.id, form); }
      else { await produkHukumService.create(form); }
      setShowModal(false);
      fetchData();
    } catch { alert('Gagal menyimpan produk hukum'); }
    finally { setSubmitting(false); }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({ message: 'Apakah Anda yakin ingin menghapus produk hukum ini?', header: 'Konfirmasi Hapus', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', acceptLabel: 'Hapus', rejectLabel: 'Batal',
      accept: async () => { try { await produkHukumService.destroy(id); fetchData(); } catch { alert('Gagal menghapus'); } },
    });
  };

  const dateBodyTemplate = (row: ProdukHukum) => (<span className="text-sm">{row.date ? new Date(row.date).toLocaleDateString('id-ID') : '-'}</span>);
  const kategoriBodyTemplate = (row: ProdukHukum) => {
    const opt = KATEGORI_OPTIONS.find(o => o.value === row.category);
    return <Tag value={opt?.label || row.category} severity="info" className="text-xs" />;
  };
  const fileBodyTemplate = (row: ProdukHukum) => row.file_url ? <a href={row.file_url} target="_blank" rel="noreferrer" className="text-primary"><i className="pi pi-file mr-1" />Unduh</a> : <span className="text-500">-</span>;
  const actionBodyTemplate = (row: ProdukHukum) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('ph-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <ConfirmDialog />
      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Produk Hukum</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none p-0 mt-2" />
        </div>
        <Button label="Tambah Produk Hukum" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>
      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <span className="p-input-icon-left"><i className="pi pi-search" /><InputText value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari produk hukum..." className="border-round-xl w-20rem" /></span>
          <span className="text-sm text-500">Total: {total} data</span>
        </div>
        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data" className="border-round-lg">
          <Column field="title" header="Judul" className="font-medium" style={{ minWidth: '200px' }} />
          <Column field="author" header="Penyusun" style={{ minWidth: '120px' }} body={(row: ProdukHukum) => <span className="text-700">{row.author || '-'}</span>} />
          <Column header="Kategori" body={kategoriBodyTemplate} style={{ minWidth: '140px' }} />
          <Column header="Tanggal" body={dateBodyTemplate} style={{ minWidth: '100px' }} />
          <Column header="File" body={fileBodyTemplate} style={{ width: '80px' }} />
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
      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Produk Hukum' : 'Tambah Produk Hukum'} footer={dialogFooter} style={{ width: '540px' }} modal className="border-round-xl" draggable={false}>
        <form id="ph-form" onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Judul</label><InputText value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="border-round-lg" /></div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-2"><label className="font-medium text-sm text-800">Penyusun/Author</label><InputText value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="border-round-lg" /></div>
            <div className="col-6 flex flex-column gap-2"><label className="font-medium text-sm text-800">Kategori</label><Dropdown value={form.category} options={KATEGORI_OPTIONS} onChange={e => setForm({ ...form, category: e.value })} className="border-round-lg" /></div>
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-2"><label className="font-medium text-sm text-800">Tanggal</label><InputText type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required className="border-round-lg" /></div>
            <div className="col-6 flex flex-column gap-2"><label className="font-medium text-sm text-800">Status</label><Dropdown value={form.is_published} options={[{ label: 'Published', value: true }, { label: 'Draft', value: false }]} onChange={e => setForm({ ...form, is_published: e.value })} className="border-round-lg" /></div>
          </div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">URL File Dokumen</label><InputText value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} placeholder="https://...dokumen.pdf" className="border-round-lg" /></div>
        </form>
      </Dialog>
    </div>
  );
};

export default CmsProdukHukum;
