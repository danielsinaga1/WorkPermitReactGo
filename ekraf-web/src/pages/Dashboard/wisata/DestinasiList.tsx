import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { InputSwitch } from 'primereact/inputswitch';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { adminDestinasiService } from '../../../services';
import type { DestinasiWisata } from '../../../types';

const KATEGORI_OPTIONS = [
  { label: 'Alam', value: 'alam' },
  { label: 'Budaya', value: 'budaya' },
  { label: 'Buatan', value: 'buatan' },
  { label: 'Religi', value: 'religi' },
  { label: 'Kuliner', value: 'kuliner' },
  { label: 'Edukasi', value: 'edukasi' },
];

const KATEGORI_COLORS: Record<string, string> = {
  alam: '#22c55e', budaya: '#f59e0b', buatan: '#6366f1',
  religi: '#8b5cf6', kuliner: '#ef4444', edukasi: '#06b6d4',
};

const DestinasiList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [items, setItems] = useState<DestinasiWisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<DestinasiWisata | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nama: '', deskripsi: '', alamat: '', latitude: '', longitude: '',
    kategori: 'alam', jam_operasional: '', harga_tiket: null as number | null,
    is_ticketed: false, is_active: true, virtual_tour_url: '',
  });

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Pariwisata' }, { label: 'Destinasi Wisata' }];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await adminDestinasiService.list({ search: search || undefined, page, per_page: 10 });
      setItems(resp.data);
      setTotal(resp.meta.total);
      setLastPage(resp.meta.last_page);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data' });
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ nama: '', deskripsi: '', alamat: '', latitude: '', longitude: '', kategori: 'alam', jam_operasional: '', harga_tiket: null, is_ticketed: false, is_active: true, virtual_tour_url: '' });
    setThumbnail(null);
    setShowModal(true);
  };

  const openEdit = (item: DestinasiWisata) => {
    setEditItem(item);
    setForm({
      nama: item.nama,
      deskripsi: item.deskripsi || '',
      alamat: item.alamat,
      latitude: item.latitude?.toString() || '',
      longitude: item.longitude?.toString() || '',
      kategori: item.kategori,
      jam_operasional: item.jam_operasional || '',
      harga_tiket: item.harga_tiket ?? null,
      is_ticketed: item.is_ticketed,
      is_active: item.is_active,
      virtual_tour_url: item.virtual_tour_url || '',
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
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        harga_tiket: form.harga_tiket ?? null,
        virtual_tour_url: form.virtual_tour_url || null,
      };
      if (thumbnail) payload.thumbnail = thumbnail;

      if (editItem) {
        await adminDestinasiService.update(editItem.id, payload);
        toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Destinasi berhasil diperbarui' });
      } else {
        await adminDestinasiService.create(payload);
        toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Destinasi berhasil ditambahkan' });
      }
      setShowModal(false);
      fetchData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data' });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({
      message: 'Apakah Anda yakin ingin menghapus destinasi ini?',
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminDestinasiService.destroy(id);
          toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Destinasi berhasil dihapus' });
          fetchData();
        } catch {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus' });
        }
      },
    });
  };

  const activeCount = items.filter(i => i.is_active).length;

  const namaTemplate = (row: DestinasiWisata) => (
    <div className="flex gap-3 align-items-center">
      {row.thumbnail && <img src={row.thumbnail} alt="" className="border-round" style={{ width: 40, height: 40, objectFit: 'cover' }} />}
      <div>
        <div className="font-medium text-800">{row.nama}</div>
        <div className="text-xs text-500">{row.alamat}</div>
      </div>
    </div>
  );

  const kategoriTemplate = (row: DestinasiWisata) => (
    <Tag value={row.kategori} style={{ background: KATEGORI_COLORS[row.kategori], color: '#fff', textTransform: 'capitalize', fontSize: '0.7rem' }} />
  );

  const statusTemplate = (row: DestinasiWisata) => (
    <Tag value={row.is_active ? 'Aktif' : 'Nonaktif'} severity={row.is_active ? 'success' : 'warning'} className="text-xs" />
  );

  const actionTemplate = (row: DestinasiWisata) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} />
    </div>
  );

  const dialogFooter = (
    <div className="flex gap-2 pt-2 justify-content-end">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('destinasi-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none px-0" />

      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Direktori Wisata Pintar</h2>
          <p className="text-sm text-500 mt-1 mb-0">Kelola destinasi wisata Kota Bontang</p>
        </div>
        <Button label="Tambah Destinasi" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>

      {/* KPI */}
      <div className="grid">
        {[
          { label: 'Total Destinasi', value: total, icon: 'pi pi-map-marker', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
          { label: 'Aktif', value: activeCount, icon: 'pi pi-check-circle', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Ber-Tiket', value: items.filter(i => i.is_ticketed).length, icon: 'pi pi-ticket', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map(s => (
          <div key={s.label} className="col-12 md:col-4">
            <Card className="shadow-1 border-round-xl">
              <div className="flex gap-3 align-items-center">
                <div className="flex align-items-center justify-content-center border-round-xl" style={{ width: 48, height: 48, background: s.bg }}>
                  <i className={s.icon} style={{ fontSize: '1.25rem', color: s.color }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-800">{s.value}</div>
                  <div className="text-sm text-500">{s.label}</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex flex-wrap gap-3 mb-4 align-items-center justify-content-between">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari destinasi..." className="border-round-xl w-20rem" />
          </span>
          <span className="text-sm text-500">Total: {total} destinasi</span>
        </div>

        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data destinasi">
          <Column header="Destinasi" body={namaTemplate} style={{ minWidth: '240px' }} />
          <Column header="Kategori" body={kategoriTemplate} alignHeader="center" bodyClassName="text-center" style={{ width: '120px' }} />
          <Column field="total_pengunjung" header="Pengunjung" alignHeader="center" bodyClassName="text-center font-medium" style={{ width: '120px' }} />
          <Column header="Status" body={statusTemplate} alignHeader="center" bodyClassName="text-center" style={{ width: '100px' }} />
          <Column header="Aksi" body={actionTemplate} style={{ width: '100px' }} />
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

      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Destinasi' : 'Tambah Destinasi'} footer={dialogFooter} style={{ width: '680px' }} modal className="border-round-xl" draggable={false}>
        <form id="destinasi-form" onSubmit={handleSubmit} className="flex gap-3 pt-2 flex-column">
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Nama Destinasi</label>
            <InputText value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required className="border-round-lg" />
          </div>
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Alamat</label>
            <InputText value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} required className="border-round-lg" />
          </div>
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Deskripsi</label>
            <InputTextarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} className="border-round-lg" autoResize />
          </div>
          <div className="grid">
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Kategori</label>
              <Dropdown value={form.kategori} options={KATEGORI_OPTIONS} onChange={(e) => setForm({ ...form, kategori: e.value })} className="border-round-lg" />
            </div>
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Jam Operasional</label>
              <InputText value={form.jam_operasional} onChange={(e) => setForm({ ...form, jam_operasional: e.target.value })} placeholder="08:00 - 17:00" className="border-round-lg" />
            </div>
          </div>
          <div className="grid">
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Latitude</label>
              <InputText value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="-0.123456" className="border-round-lg" />
            </div>
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Longitude</label>
              <InputText value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="117.123456" className="border-round-lg" />
            </div>
          </div>
          <div className="grid">
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Harga Tiket</label>
              <InputNumber value={form.harga_tiket} onValueChange={(e) => setForm({ ...form, harga_tiket: e.value ?? null })} mode="currency" currency="IDR" locale="id-ID" className="border-round-lg" />
            </div>
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Thumbnail</label>
              <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="text-sm" />
            </div>
          </div>
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Virtual Tour URL</label>
            <InputText value={form.virtual_tour_url} onChange={(e) => setForm({ ...form, virtual_tour_url: e.target.value })} placeholder="https://..." className="border-round-lg" />
          </div>
          <div className="flex gap-4 align-items-center">
            <div className="flex gap-2 align-items-center">
              <InputSwitch checked={form.is_ticketed} onChange={(e) => setForm({ ...form, is_ticketed: e.value ?? false })} />
              <label className="text-sm text-700">Berbayar (E-Ticket)</label>
            </div>
            <div className="flex gap-2 align-items-center">
              <InputSwitch checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.value ?? true })} />
              <label className="text-sm text-700">Aktif</label>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default DestinasiList;
