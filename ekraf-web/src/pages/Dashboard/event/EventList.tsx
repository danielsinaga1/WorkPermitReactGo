import { useState, useEffect, useCallback } from 'react';
import { adminEkrafService } from '../../../services';
import type { EventFestival } from '../../../types';
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
  { label: 'Festival', value: 'festival' },
  { label: 'Pameran', value: 'pameran' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Kompetisi', value: 'kompetisi' },
  { label: 'Pertunjukan', value: 'pertunjukan' },
  { label: 'Lainnya', value: 'lainnya' },
];

const STATUS_OPTIONS = [
  { label: 'Published', value: true },
  { label: 'Draft', value: false },
];

const EventList = () => {
  const [items, setItems] = useState<EventFestival[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<EventFestival | null>(null);
  const [form, setForm] = useState({
    nama: '', deskripsi: '', kategori: 'festival' as string,
    tanggal_mulai: '', tanggal_selesai: '', lokasi: '',
    penyelenggara: '', harga_tiket: null as number | null, kontak: '', is_published: true,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [{ label: 'DISPOPAR Bontang' }, { label: 'Event & Festival' }];
  const breadcrumbHome = { icon: 'pi pi-home', url: '/dashboard' };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminEkrafService.listEvent({ page, per_page: 10, search: search || undefined });
      setItems(res.data ?? []);
      setLastPage(res.last_page ?? 1);
      setTotal(res.total ?? 0);
    } catch {
      setError('Gagal memuat data event');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ nama: '', deskripsi: '', kategori: 'festival', tanggal_mulai: '', tanggal_selesai: '', lokasi: '', penyelenggara: '', harga_tiket: null, kontak: '', is_published: true });
    setThumbnail(null);
    setShowModal(true);
  };

  const openEdit = (item: EventFestival) => {
    setEditItem(item);
    setForm({
      nama: item.nama,
      deskripsi: item.deskripsi || '',
      kategori: item.kategori,
      tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : '',
      tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.split('T')[0] : '',
      lokasi: item.lokasi || '',
      penyelenggara: item.penyelenggara || '',
      harga_tiket: item.harga_tiket ?? null,
      kontak: item.kontak || '',
      is_published: item.is_published,
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
        harga_tiket: form.harga_tiket ?? null,
        tanggal_selesai: form.tanggal_selesai || null,
      };
      if (thumbnail) payload.thumbnail = thumbnail;
      if (editItem) {
        await adminEkrafService.updateEvent(editItem.id, payload);
      } else {
        await adminEkrafService.createEvent(payload);
      }
      setShowModal(false);
      fetchData();
    } catch {
      alert('Gagal menyimpan event');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({
      message: 'Apakah Anda yakin ingin menghapus event ini?',
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminEkrafService.destroyEvent(id);
          fetchData();
        } catch {
          alert('Gagal menghapus event');
        }
      },
    });
  };

  const activeCount = items.filter(i => i.is_published).length;
  const draftCount = items.filter(i => !i.is_published).length;

  interface KpiStat { label: string; value: number; icon: string; color: string; bgColor: string }
  const stats: KpiStat[] = [
    { label: 'Total Event', value: total, icon: 'pi pi-calendar', color: '#6366f1', bgColor: 'rgba(99,102,241,0.1)' },
    { label: 'Published', value: activeCount, icon: 'pi pi-check-circle', color: '#22c55e', bgColor: 'rgba(34,197,94,0.1)' },
    { label: 'Draft', value: draftCount, icon: 'pi pi-file-edit', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)' },
  ];

  const eventBodyTemplate = (row: EventFestival) => (
    <div className="flex gap-3 align-items-center">
      {row.thumbnail && <img src={row.thumbnail} alt="" className="border-round" style={{ width: 40, height: 40, objectFit: 'cover' }} />}
      <span className="font-medium text-800">{row.nama}</span>
    </div>
  );

  const tanggalBodyTemplate = (row: EventFestival) => (
    <span className="text-sm text-700">
      {new Date(row.tanggal_mulai).toLocaleDateString('id-ID')}
      {row.tanggal_selesai && ` - ${new Date(row.tanggal_selesai).toLocaleDateString('id-ID')}`}
    </span>
  );

  const statusBodyTemplate = (row: EventFestival) => (
    <Tag value={row.is_published ? 'Published' : 'Draft'} severity={row.is_published ? 'success' : 'warning'} className="text-xs" />
  );

  const actionBodyTemplate = (row: EventFestival) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text rounded severity="info" onClick={() => openEdit(row)} tooltip="Edit" tooltipOptions={{ position: 'top' }} />
      <Button icon="pi pi-trash" text rounded severity="danger" onClick={() => confirmDelete(row.id)} tooltip="Hapus" tooltipOptions={{ position: 'top' }} />
    </div>
  );

  const dialogFooter = (
    <div className="flex gap-2 pt-2 justify-content-end">
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowModal(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('event-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div className="flex gap-4 flex-column">
      <ConfirmDialog />

      <div className="flex flex-wrap gap-3 align-items-center justify-content-between">
        <div>
          <h2 className="m-0 text-2xl font-bold text-800">Daftar Event</h2>
          <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="p-0 mt-2 border-none surface-ground" />
        </div>
        <Button label="Buat Event" icon="pi pi-plus" className="border-round-xl" onClick={openCreate} />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid">
        {stats.map(s => (
          <div key={s.label} className="col-12 md:col-4">
            <Card className="shadow-1 border-round-xl">
              <div className="flex gap-3 align-items-center">
                <div className="flex align-items-center justify-content-center border-round-xl" style={{ width: 48, height: 48, background: s.bgColor }}>
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
            <InputText value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari event..." className="border-round-xl w-20rem" />
          </span>
          <span className="text-sm text-500">Total: {total} event</span>
        </div>

        {error && <Message severity="error" text={error} className="w-full mb-3" />}

        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data event" className="border-round-lg">
          <Column header="Nama Event" body={eventBodyTemplate} style={{ minWidth: '200px' }} />
          <Column header="Tanggal" body={tanggalBodyTemplate} style={{ minWidth: '180px' }} />
          <Column field="lokasi" header="Lokasi" style={{ minWidth: '120px' }} body={(row: EventFestival) => <span className="text-700">{row.lokasi || '-'}</span>} />
          <Column header="Kategori" body={(row: EventFestival) => <Tag value={row.kategori} severity="info" className="text-xs capitalize" />} alignHeader="center" bodyClassName="text-center" style={{ width: '120px' }} />
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

      <Dialog visible={showModal} onHide={() => setShowModal(false)} header={editItem ? 'Edit Event' : 'Buat Event Baru'} footer={dialogFooter} style={{ width: '620px' }} modal className="border-round-xl" draggable={false}>
        <form id="event-form" onSubmit={handleSubmit} className="flex gap-3 pt-2 flex-column">
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Nama Event</label>
            <InputText value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required className="border-round-lg" />
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
              <label className="text-sm font-medium text-800">Status</label>
              <Dropdown value={form.is_published} options={STATUS_OPTIONS} onChange={e => setForm({ ...form, is_published: e.value })} className="border-round-lg" />
            </div>
          </div>
          <div className="grid">
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Tanggal Mulai</label>
              <InputText type="date" value={form.tanggal_mulai} onChange={e => setForm({ ...form, tanggal_mulai: e.target.value })} required className="border-round-lg" />
            </div>
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Tanggal Selesai</label>
              <InputText type="date" value={form.tanggal_selesai} onChange={e => setForm({ ...form, tanggal_selesai: e.target.value })} className="border-round-lg" />
            </div>
          </div>
          <div className="grid">
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Lokasi</label>
              <InputText value={form.lokasi} onChange={e => setForm({ ...form, lokasi: e.target.value })} className="border-round-lg" />
            </div>
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Penyelenggara</label>
              <InputText value={form.penyelenggara} onChange={e => setForm({ ...form, penyelenggara: e.target.value })} className="border-round-lg" />
            </div>
          </div>
          <div className="grid">
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Harga Tiket (Rp)</label>
              <InputNumber value={form.harga_tiket} onValueChange={e => setForm({ ...form, harga_tiket: e.value ?? null })} mode="currency" currency="IDR" locale="id-ID" className="border-round-lg" inputClassName="border-round-lg" />
            </div>
            <div className="flex gap-2 col-6 flex-column">
              <label className="text-sm font-medium text-800">Kontak</label>
              <InputText value={form.kontak} onChange={e => setForm({ ...form, kontak: e.target.value })} className="border-round-lg" />
            </div>
          </div>
          <div className="flex gap-2 flex-column">
            <label className="text-sm font-medium text-800">Thumbnail</label>
            <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files?.[0] || null)} className="text-sm p-inputtext p-component border-round-lg" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default EventList;
