import { useState, useEffect, useCallback } from 'react';
import { realisasiAnggaranService } from '../../../services';
import type { RealisasiAnggaran } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';

const CmsRealisasiAnggaran = () => {
  const [items, setItems] = useState<RealisasiAnggaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<RealisasiAnggaran | null>(null);
  const [form, setForm] = useState({ tahun: new Date().getFullYear(), program: '', anggaran: 0, realisasi: 0, persentase: 0 });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'CMS' }, { label: 'Realisasi Anggaran' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await realisasiAnggaranService.list({ page, per_page: 10, search: search || undefined });
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      setError('Gagal memuat data realisasi anggaran');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ tahun: new Date().getFullYear(), program: '', anggaran: 0, realisasi: 0, persentase: 0 });
    setShowModal(true);
  };

  const openEdit = (item: RealisasiAnggaran) => {
    setEditItem(item);
    setForm({ tahun: item.tahun, program: item.program, anggaran: item.anggaran, realisasi: item.realisasi, persentase: item.persentase });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) { await realisasiAnggaranService.update(editItem.id, form); }
      else { await realisasiAnggaranService.create(form); }
      setShowModal(false);
      fetchData();
    } catch { alert('Gagal menyimpan data'); }
    finally { setSubmitting(false); }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({ message: 'Apakah Anda yakin ingin menghapus data ini?', header: 'Konfirmasi Hapus', icon: 'pi pi-exclamation-triangle', acceptClassName: 'p-button-danger', acceptLabel: 'Hapus', rejectLabel: 'Batal',
      accept: async () => { try { await realisasiAnggaranService.destroy(id); fetchData(); } catch { alert('Gagal menghapus'); } },
    });
  };

  const currencyBody = (val: number) => `Rp ${val?.toLocaleString('id-ID') || 0}`;
  const persentaseBody = (row: RealisasiAnggaran) => {
    const pct = row.persentase ?? 0;
    const severity = pct >= 80 ? 'success' : pct >= 50 ? 'warning' : 'danger';
    return <Tag value={`${pct}%`} severity={severity} className="text-xs" />;
  };
  const actionBodyTemplate = (row: RealisasiAnggaran) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('ra-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <ConfirmDialog />
      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Realisasi Anggaran</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none p-0 mt-2" />
        </div>
        <Button label="Tambah Data" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>
      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <span className="p-input-icon-left"><i className="pi pi-search" /><InputText value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari program..." className="border-round-xl w-20rem" /></span>
          <span className="text-sm text-500">Total: {total} data</span>
        </div>
        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data" className="border-round-lg">
          <Column field="program" header="Program" className="font-medium" style={{ minWidth: '200px' }} />
          <Column field="tahun" header="Tahun" style={{ width: '80px' }} bodyClassName="text-center" alignHeader="center" />
          <Column header="Anggaran" body={(row: RealisasiAnggaran) => currencyBody(row.anggaran)} style={{ minWidth: '140px' }} />
          <Column header="Realisasi" body={(row: RealisasiAnggaran) => currencyBody(row.realisasi)} style={{ minWidth: '140px' }} />
          <Column header="%" body={persentaseBody} bodyClassName="text-center" alignHeader="center" style={{ width: '80px' }} />
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
        <form id="ra-form" onSubmit={handleSubmit} className="flex flex-column gap-3 pt-2">
          <div className="grid">
            <div className="col-8 flex flex-column gap-2"><label className="font-medium text-sm text-800">Program</label><InputText value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} required className="border-round-lg" /></div>
            <div className="col-4 flex flex-column gap-2"><label className="font-medium text-sm text-800">Tahun</label><InputNumber value={form.tahun} onValueChange={e => setForm({ ...form, tahun: e.value ?? new Date().getFullYear() })} useGrouping={false} className="border-round-lg" inputClassName="border-round-lg" /></div>
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-2"><label className="font-medium text-sm text-800">Anggaran (Rp)</label><InputNumber value={form.anggaran} onValueChange={e => setForm({ ...form, anggaran: e.value ?? 0 })} mode="currency" currency="IDR" locale="id-ID" className="border-round-lg" inputClassName="border-round-lg" /></div>
            <div className="col-6 flex flex-column gap-2"><label className="font-medium text-sm text-800">Realisasi (Rp)</label><InputNumber value={form.realisasi} onValueChange={e => setForm({ ...form, realisasi: e.value ?? 0 })} mode="currency" currency="IDR" locale="id-ID" className="border-round-lg" inputClassName="border-round-lg" /></div>
          </div>
          <div className="grid">
            <div className="col-4 flex flex-column gap-2"><label className="font-medium text-sm text-800">Persentase (%)</label><InputNumber value={form.persentase} onValueChange={e => setForm({ ...form, persentase: e.value ?? 0 })} suffix="%" min={0} max={100} className="border-round-lg" inputClassName="border-round-lg" /></div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default CmsRealisasiAnggaran;
