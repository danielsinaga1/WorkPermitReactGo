import { useState, useEffect, useCallback } from 'react';
import { ppidService } from '../../../services';
import type { PPID, SeksiPPID } from '../../../types';
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

const SECTION_OPTIONS = [
  { label: 'Tentang PPID', value: 'tentang_ppid' },
  { label: 'Profil', value: 'profil' },
  { label: 'Tugas & Fungsi', value: 'tugas_fungsi' },
  { label: 'Struktur Organisasi', value: 'struktur_organisasi' },
  { label: 'Visi & Misi', value: 'visi_misi' },
  { label: 'Regulasi', value: 'regulasi' },
  { label: 'Jam Pelayanan', value: 'jam_pelayanan' },
  { label: 'Formulir', value: 'formulir' },
];

const CmsPPID = () => {
  const [items, setItems] = useState<PPID[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<PPID | null>(null);
  const [form, setForm] = useState({ section: 'tentang_ppid' as SeksiPPID, title: '', content: '', file_url: '' });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'CMS' }, { label: 'PPID' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ppidService.list({ page, per_page: 10, search: search || undefined });
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      setError('Gagal memuat data PPID');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ section: 'tentang_ppid', title: '', content: '', file_url: '' });
    setShowModal(true);
  };

  const openEdit = (item: PPID) => {
    setEditItem(item);
    setForm({ section: item.section, title: item.title, content: item.content || '', file_url: item.file_url || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) { await ppidService.update(editItem.id, form); }
      else { await ppidService.create(form); }
      setShowModal(false);
      fetchData();
    } catch { alert('Gagal menyimpan data PPID'); }
    finally { setSubmitting(false); }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({ message: 'Apakah Anda yakin ingin menghapus data ini?', header: 'Konfirmasi Hapus', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', acceptLabel: 'Hapus', rejectLabel: 'Batal',
      accept: async () => { try { await ppidService.destroy(id); fetchData(); } catch { alert('Gagal menghapus'); } },
    });
  };

  const sectionBodyTemplate = (row: PPID) => {
    const opt = SECTION_OPTIONS.find(o => o.value === row.section);
    return <Tag value={opt?.label || row.section} severity="info" className="text-xs" />;
  };
  const fileBodyTemplate = (row: PPID) => row.file_url ? <a href={row.file_url} target="_blank" rel="noreferrer" className="text-primary"><i className="pi pi-file mr-1" />Lihat</a> : <span className="text-500">-</span>;
  const actionBodyTemplate = (row: PPID) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('ppid-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <ConfirmDialog />
      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">PPID</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none p-0 mt-2" />
        </div>
        <Button label="Tambah Konten PPID" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>
      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <span className="p-input-icon-left"><i className="pi pi-search" /><InputText value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari konten PPID..." className="border-round-xl w-20rem" /></span>
          <span className="text-sm text-500">Total: {total} data</span>
        </div>
        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data" className="border-round-lg">
          <Column field="title" header="Judul" className="font-medium" style={{ minWidth: '200px' }} />
          <Column header="Seksi" body={sectionBodyTemplate} style={{ minWidth: '140px' }} />
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
      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Konten PPID' : 'Tambah Konten PPID'} footer={dialogFooter} style={{ width: '540px' }} modal className="border-round-xl" draggable={false}>
        <form id="ppid-form" onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Seksi</label><Dropdown value={form.section} options={SECTION_OPTIONS} onChange={e => setForm({ ...form, section: e.value })} className="border-round-lg" /></div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Judul</label><InputText value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="border-round-lg" /></div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">Konten</label><InputTextarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} className="border-round-lg" autoResize /></div>
          <div className="flex flex-column gap-2"><label className="font-medium text-sm text-800">URL File</label><InputText value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} placeholder="https://...file.pdf" className="border-round-lg" /></div>
        </form>
      </Dialog>
    </div>
  );
};

export default CmsPPID;
