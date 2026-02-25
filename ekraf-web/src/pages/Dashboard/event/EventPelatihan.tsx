import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminEkrafService } from '../../../services';
import type { Pelatihan } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Avatar } from 'primereact/avatar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';

const KATEGORI_OPTIONS = [
  { label: 'Kewirausahaan', value: 'kewirausahaan' },
  { label: 'Digital Marketing', value: 'digital_marketing' },
  { label: 'Desain', value: 'desain' },
  { label: 'Kuliner', value: 'kuliner' },
  { label: 'Kerajinan', value: 'kerajinan' },
  { label: 'Teknologi', value: 'teknologi' },
  { label: 'Lainnya', value: 'lainnya' },
];

const EventPelatihan = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Pelatihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Pelatihan | null>(null);
  const [form, setForm] = useState({
    judul: '', deskripsi: '', kategori: 'lainnya' as string,
    tanggal_mulai: '', tanggal_selesai: '', lokasi: '',
    narasumber: '', kuota: null as number | null, syarat: '', is_published: true,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Event & Pelatihan', command: () => navigate('/dashboard/event') },
    { label: 'Pelatihan' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminEkrafService.listPelatihan({ page, per_page: 10, search: search || undefined });
      setData(res.data ?? []);
      setLastPage(res.last_page ?? 1);
      setTotal(res.total ?? 0);
    } catch {
      setError('Gagal memuat data pelatihan');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ judul: '', deskripsi: '', kategori: 'lainnya', tanggal_mulai: '', tanggal_selesai: '', lokasi: '', narasumber: '', kuota: null, syarat: '', is_published: true });
    setThumbnail(null);
    setShowDialog(true);
  };

  const openEdit = (item: Pelatihan) => {
    setEditItem(item);
    setForm({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      kategori: item.kategori,
      tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : '',
      tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.split('T')[0] : '',
      lokasi: item.lokasi || '',
      narasumber: item.narasumber || '',
      kuota: item.kuota ?? null,
      syarat: item.syarat || '',
      is_published: item.is_published,
    });
    setThumbnail(null);
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        ...form,
        kuota: form.kuota ?? null,
        tanggal_selesai: form.tanggal_selesai || null,
      };
      if (thumbnail) payload.thumbnail = thumbnail;
      if (editItem) {
        await adminEkrafService.updatePelatihan(editItem.id, payload);
      } else {
        await adminEkrafService.createPelatihan(payload);
      }
      setShowDialog(false);
      fetchData();
    } catch {
      alert('Gagal menyimpan pelatihan');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    confirmDialog({
      message: 'Apakah Anda yakin ingin menghapus pelatihan ini?',
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminEkrafService.destroyPelatihan(id);
          fetchData();
        } catch {
          alert('Gagal menghapus pelatihan');
        }
      },
    });
  };

  const publishedCount = data.filter(d => d.is_published).length;
  const draftCount = data.filter(d => !d.is_published).length;

  const stats = [
    { label: 'Total Pelatihan', value: total, icon: 'pi pi-book', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Published', value: publishedCount, icon: 'pi pi-check-circle', color: '#22c55e', bg: '#ecfdf5' },
    { label: 'Draft', value: draftCount, icon: 'pi pi-file-edit', color: '#f59e0b', bg: '#fffbeb' },
  ];

  const judulTemplate = (row: Pelatihan) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {row.thumbnail ? (
        <img src={row.thumbnail} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '8px' }} />
      ) : (
        <Avatar icon="pi pi-book" shape="circle" style={{ backgroundColor: '#6366f1', color: '#fff' }} />
      )}
      <div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.judul}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.kategori}</div>
      </div>
    </div>
  );

  const statusTemplate = (row: Pelatihan) => (
    <Tag value={row.is_published ? 'Published' : 'Draft'} severity={row.is_published ? 'success' : 'warning'} />
  );

  const tanggalTemplate = (row: Pelatihan) => (
    <span style={{ fontSize: '0.85rem', color: '#475569' }}>
      {new Date(row.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
      {row.tanggal_selesai && ` - ${new Date(row.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`}
    </span>
  );

  const aksiTemplate = (row: Pelatihan) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button icon="pi pi-pencil" rounded text severity="warning" tooltip="Edit" tooltipOptions={{ position: 'top' }} onClick={() => openEdit(row)} />
      <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Hapus" tooltipOptions={{ position: 'top' }} onClick={() => confirmDelete(row.id)} />
    </div>
  );

  const dialogFooter = (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowDialog(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('pelatihan-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ConfirmDialog />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />
        <Button label="Tambah Pelatihan" icon="pi pi-plus" raised onClick={openCreate} />
      </div>

      {/* KPI Cards */}
      <div className="grid">
        {stats.map((s, i) => (
          <div className="col-12 md:col-4" key={i}>
            <Card style={{ borderLeft: `4px solid ${s.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={s.icon} style={{ fontSize: '1.25rem', color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.label}</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* DataTable */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Cari pelatihan..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ width: '280px', borderRadius: '12px' }} />
          </span>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total: {total} pelatihan</span>
        </div>

        {error && <Message severity="error" text={error} className="w-full mb-3" />}

        <DataTable value={data} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data pelatihan">
          <Column header="No" body={(_r: Pelatihan, o: { rowIndex: number }) => ((page - 1) * 10) + (o.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Judul Pelatihan" body={judulTemplate} style={{ minWidth: '250px' }} />
          <Column field="narasumber" header="Narasumber" style={{ minWidth: '150px' }} body={(row: Pelatihan) => <span style={{ color: '#475569' }}>{row.narasumber || '-'}</span>} />
          <Column header="Tanggal" body={tanggalTemplate} style={{ minWidth: '200px' }} />
          <Column field="lokasi" header="Lokasi" style={{ minWidth: '130px' }} body={(row: Pelatihan) => <span style={{ color: '#475569' }}>{row.lokasi || '-'}</span>} />
          <Column header="Kuota" style={{ width: '80px' }} body={(row: Pelatihan) => <span style={{ fontWeight: 600, color: '#334155' }}>{row.kuota ?? '-'}</span>} />
          <Column header="Status" body={statusTemplate} style={{ width: '120px' }} />
          <Column header="Aksi" body={aksiTemplate} style={{ width: '100px' }} />
        </DataTable>

        {lastPage > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', marginTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Halaman {page} dari {lastPage}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button label="Prev" icon="pi pi-chevron-left" severity="secondary" text size="small" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} />
              <Button label="Next" icon="pi pi-chevron-right" iconPos="right" severity="secondary" text size="small" onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page >= lastPage} />
            </div>
          </div>
        )}
      </Card>

      {/* Dialog */}
      <Dialog visible={showDialog} onHide={() => setShowDialog(false)} header={editItem ? 'Edit Pelatihan' : 'Tambah Pelatihan'} modal style={{ width: '560px' }} draggable={false} footer={dialogFooter}>
        <form id="pelatihan-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Judul Pelatihan</label>
            <InputText value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} required placeholder="Masukkan judul pelatihan" />
          </div>
          <div className="grid">
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Narasumber</label>
              <InputText value={form.narasumber} onChange={e => setForm({ ...form, narasumber: e.target.value })} placeholder="Nama narasumber" />
            </div>
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Kategori</label>
              <Dropdown value={form.kategori} options={KATEGORI_OPTIONS} onChange={e => setForm({ ...form, kategori: e.value })} placeholder="Pilih kategori" />
            </div>
          </div>
          <div className="grid">
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Tanggal Mulai</label>
              <InputText type="date" value={form.tanggal_mulai} onChange={e => setForm({ ...form, tanggal_mulai: e.target.value })} required />
            </div>
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Tanggal Selesai</label>
              <InputText type="date" value={form.tanggal_selesai} onChange={e => setForm({ ...form, tanggal_selesai: e.target.value })} />
            </div>
          </div>
          <div className="grid">
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Lokasi</label>
              <InputText value={form.lokasi} onChange={e => setForm({ ...form, lokasi: e.target.value })} placeholder="Lokasi pelatihan" />
            </div>
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Kuota Peserta</label>
              <InputNumber value={form.kuota} onValueChange={e => setForm({ ...form, kuota: e.value ?? null })} min={1} placeholder="Kuota" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Deskripsi</label>
            <InputTextarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={3} autoResize placeholder="Deskripsi pelatihan" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Thumbnail</label>
            <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files?.[0] || null)} className="text-sm p-inputtext p-component" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Status</label>
            <Dropdown value={form.is_published} options={[{ label: 'Published', value: true }, { label: 'Draft', value: false }]} onChange={e => setForm({ ...form, is_published: e.value })} />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default EventPelatihan;
