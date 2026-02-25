import { useState, useEffect, useCallback } from 'react';
import { adminEkrafService } from '../../../services';
import type { KatalogProduk } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';

const KATEGORI_OPTIONS = [
  { label: 'Kerajinan', value: 'kerajinan' },
  { label: 'Kuliner', value: 'kuliner' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Seni', value: 'seni' },
  { label: 'Teknologi', value: 'teknologi' },
  { label: 'Lainnya', value: 'lainnya' },
];

const ProdukKatalog = () => {
  const [items, setItems] = useState<KatalogProduk[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<KatalogProduk | null>(null);
  const [form, setForm] = useState({
    nama_produk: '', deskripsi: '', kategori: 'kerajinan' as string, harga: null as number | null,
    nama_usaha: '', kontak: '', alamat_usaha: '', is_verified: false, is_active: true,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'DISPOPAR Bontang' }, { label: 'Katalog Digital' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminEkrafService.listKatalog({ page, per_page: 10, search: search || undefined });
      setItems(res.data);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch {
      setError('Gagal memuat data katalog produk');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ nama_produk: '', deskripsi: '', kategori: 'kerajinan', harga: null, nama_usaha: '', kontak: '', alamat_usaha: '', is_verified: false, is_active: true });
    setThumbnail(null);
    setShowModal(true);
  };

  const openEdit = (item: KatalogProduk) => {
    setEditItem(item);
    setForm({
      nama_produk: item.nama_produk,
      deskripsi: item.deskripsi || '',
      kategori: item.kategori,
      harga: item.harga ?? null,
      nama_usaha: item.nama_usaha || '',
      kontak: item.kontak || '',
      alamat_usaha: item.alamat_usaha || '',
      is_verified: item.is_verified,
      is_active: item.is_active,
    });
    setThumbnail(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        ...form,
        harga: form.harga ?? null,
      };
      if (thumbnail) payload.thumbnail = thumbnail;
      if (editItem) {
        await adminEkrafService.updateKatalog(editItem.id, payload);
      } else {
        await adminEkrafService.createKatalog(payload);
      }
      setShowModal(false);
      fetchData();
    } catch {
      alert('Gagal menyimpan produk');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({
      message: 'Apakah Anda yakin ingin menghapus produk ini?',
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminEkrafService.destroyKatalog(id);
          fetchData();
        } catch {
          alert('Gagal menghapus produk');
        }
      },
    });
  };

  const formatCurrency = (v?: number | null) => v ? `Rp ${v.toLocaleString('id-ID')}` : '-';

  const produkBodyTemplate = (row: KatalogProduk) => (
    <div className="flex gap-3 align-items-center">
      {row.thumbnail && <img src={row.thumbnail} alt="" className="border-round" style={{ width: 40, height: 40, objectFit: 'cover' }} />}
      <div>
        <div className="font-medium text-800">{row.nama_produk}</div>
        {row.nama_usaha && <div className="text-xs text-500">{row.nama_usaha}</div>}
      </div>
    </div>
  );

  const kategoriBodyTemplate = (row: KatalogProduk) => (
    <Tag value={row.kategori} severity="info" className="text-xs capitalize" />
  );

  const statusBodyTemplate = (row: KatalogProduk) => (
    <div className="flex gap-1 flex-column">
      <Tag value={row.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'} severity={row.is_verified ? 'success' : 'warning'} className="text-xs" />
      <Tag value={row.is_active ? 'Aktif' : 'Nonaktif'} severity={row.is_active ? 'info' : 'danger'} className="text-xs" />
    </div>
  );

  const actionBodyTemplate = (row: KatalogProduk) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex gap-2 pt-2 justify-content-end">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('katalog-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex gap-4 flex-column">
      <ConfirmDialog />

      <div className="flex flex-wrap gap-3 align-items-center justify-content-between">
        <div>
          <h2 className="m-0 text-2xl font-bold text-800">Katalog Digital</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="p-0 mt-2 border-none surface-ground" />
        </div>
        <Button label="Tambah Produk" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex flex-wrap gap-3 mb-4 align-items-center justify-content-between">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari produk..." className="border-round-xl w-20rem" />
          </span>
          <span className="text-sm text-500">Total: {total} produk</span>
        </div>

        {error && <Message severity="error" text={error} className="w-full mb-3" />}

        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada produk dalam katalog" className="border-round-lg">
          <Column header="Produk" body={produkBodyTemplate} style={{ minWidth: '200px' }} />
          <Column header="Kategori" body={kategoriBodyTemplate} alignHeader="center" bodyClassName="text-center" style={{ width: '120px' }} />
          <Column header="Harga" body={(row: KatalogProduk) => <span className="font-medium text-800">{formatCurrency(row.harga)}</span>} style={{ width: '140px' }} />
          <Column header="Status" body={statusBodyTemplate} alignHeader="center" bodyClassName="text-center" style={{ width: '140px' }} />
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

      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Produk' : 'Tambah Produk Baru'} footer={dialogFooter} style={{ width: '580px' }} modal className="border-round-xl" draggable={false}>
        <form id="katalog-form" onSubmit={handleSubmit} className="flex gap-3 pt-2 flex-column">
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Nama Produk</label>
            <InputText value={form.nama_produk} onChange={e => setForm({ ...form, nama_produk: e.target.value })} required className="border-round-lg" />
          </div>
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Deskripsi</label>
            <InputTextarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={3} className="border-round-lg" autoResize />
          </div>
          <div className="grid">
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Kategori</label>
              <Dropdown value={form.kategori} options={KATEGORI_OPTIONS} onChange={e => setForm({ ...form, kategori: e.value })} className="border-round-lg" />
            </div>
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Harga (Rp)</label>
              <InputNumber value={form.harga} onValueChange={e => setForm({ ...form, harga: e.value ?? null })} mode="currency" currency="IDR" locale="id-ID" className="border-round-lg" inputClassName="border-round-lg" />
            </div>
          </div>
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Thumbnail</label>
            <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files?.[0] || null)} className="text-sm p-inputtext p-component border-round-lg" />
          </div>
          <div className="grid">
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Nama Usaha</label>
              <InputText value={form.nama_usaha} onChange={e => setForm({ ...form, nama_usaha: e.target.value })} className="border-round-lg" />
            </div>
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Kontak</label>
              <InputText value={form.kontak} onChange={e => setForm({ ...form, kontak: e.target.value })} className="border-round-lg" />
            </div>
          </div>
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Alamat Usaha</label>
            <InputText value={form.alamat_usaha} onChange={e => setForm({ ...form, alamat_usaha: e.target.value })} className="border-round-lg" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ProdukKatalog;
