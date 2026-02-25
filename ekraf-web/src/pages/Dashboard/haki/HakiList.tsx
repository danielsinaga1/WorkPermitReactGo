import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminHakiService } from '../../../services';
import type { Haki } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';

const STATUS_MAP: Record<string, { severity: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  terdaftar: { severity: 'success', label: 'Terdaftar' },
  proses: { severity: 'warning', label: 'Dalam Proses' },
  diajukan: { severity: 'info', label: 'Diajukan' },
  draft: { severity: 'info', label: 'Draft' },
  ditolak: { severity: 'danger', label: 'Ditolak' },
};

const JENIS_MAP: Record<string, string> = {
  merek: 'Merek Dagang',
  hak_cipta: 'Hak Cipta',
  paten: 'Paten',
  desain_industri: 'Desain Industri',
  indikasi_geografis: 'Indikasi Geografis',
};

const JENIS_OPTIONS = [
  { label: 'Merek Dagang', value: 'merek' },
  { label: 'Hak Cipta', value: 'hak_cipta' },
  { label: 'Paten', value: 'paten' },
  { label: 'Desain Industri', value: 'desain_industri' },
  { label: 'Indikasi Geografis', value: 'indikasi_geografis' },
];

const HakiList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Haki[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Haki | null>(null);
  const [form, setForm] = useState({
    nama_produk: '', jenis_haki: 'merek' as string, deskripsi: '',
    nomor_permohonan: '', status: 'draft' as string,
  });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'HAKI & Kurasi' },
    { label: 'Fasilitasi HAKI' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminHakiService.list({ page, per_page: 10, search: search || undefined });
      setData(res.data ?? []);
      setLastPage(res.last_page ?? 1);
      setTotal(res.total ?? 0);
    } catch {
      setError('Gagal memuat data HAKI');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ nama_produk: '', jenis_haki: 'merek', deskripsi: '', nomor_permohonan: '', status: 'draft' });
    setShowDialog(true);
  };

  const openEdit = (item: Haki) => {
    setEditItem(item);
    setForm({
      nama_produk: item.nama_produk,
      jenis_haki: item.jenis_haki,
      deskripsi: item.deskripsi || '',
      nomor_permohonan: item.nomor_permohonan || '',
      status: item.status,
    });
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await adminHakiService.update(editItem.id, form as Partial<Haki>);
      } else {
        await adminHakiService.create(form as Partial<Haki>);
      }
      setShowDialog(false);
      fetchData();
    } catch {
      alert('Gagal menyimpan data HAKI');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (row: Haki) => {
    confirmDialog({
      message: `Hapus permohonan HAKI "${row.nama_produk}"?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminHakiService.destroy(row.id);
          fetchData();
        } catch {
          alert('Gagal menghapus data HAKI');
        }
      },
    });
  };

  const registeredCount = data.filter(d => d.status === 'terdaftar').length;
  const processCount = data.filter(d => d.status === 'proses' || d.status === 'diajukan').length;

  const stats = [
    { label: 'Total Permohonan', value: total, icon: 'pi pi-file-edit', color: '#6366f1', bg: '#eef2ff' },
    { label: 'HAKI Terdaftar', value: registeredCount, icon: 'pi pi-verified', color: '#22c55e', bg: '#ecfdf5' },
    { label: 'Dalam Proses', value: processCount, icon: 'pi pi-clock', color: '#f59e0b', bg: '#fffbeb' },
  ];

  const pemohonTemplate = (row: Haki) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar label={row.nama_produk.charAt(0)} shape="circle" style={{ backgroundColor: '#6366f1', color: '#fff' }} />
      <div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.nama_produk}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.pelaku_ekraf?.nama || row.user?.name || '-'}</div>
      </div>
    </div>
  );

  const jenisTemplate = (row: Haki) => {
    const colorMap: Record<string, 'info' | 'warning' | 'success'> = {
      merek: 'info',
      hak_cipta: 'success',
      desain_industri: 'warning',
    };
    return <Tag value={JENIS_MAP[row.jenis_haki] || row.jenis_haki} severity={colorMap[row.jenis_haki] || 'info'} />;
  };

  const statusTemplate = (row: Haki) => {
    const s = STATUS_MAP[row.status] || { severity: 'info' as const, label: row.status };
    return <Tag value={s.label} severity={s.severity} />;
  };

  const noHakiTemplate = (row: Haki) => (
    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: row.nomor_sertifikat ? '#334155' : '#94a3b8' }}>
      {row.nomor_sertifikat || '-'}
    </span>
  );

  const tanggalTemplate = (row: Haki) =>
    row.tanggal_permohonan
      ? new Date(row.tanggal_permohonan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date(row.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const aksiTemplate = (row: Haki) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button icon="pi pi-pencil" rounded text severity="warning" tooltip="Edit" tooltipOptions={{ position: 'top' }} onClick={() => openEdit(row)} />
      <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Hapus" tooltipOptions={{ position: 'top' }} onClick={() => confirmDelete(row)} />
    </div>
  );

  const dialogFooter = (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button label="Batal" icon="pi pi-times" severity="secondary" outlined onClick={() => setShowDialog(false)} />
      <Button label={submitting ? 'Menyimpan...' : 'Simpan'} icon="pi pi-check" loading={submitting} onClick={() => document.getElementById('haki-form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ConfirmDialog />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />
        <Button label="Tambah Permohonan" icon="pi pi-plus" raised onClick={openCreate} />
      </div>

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

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>
            <i className="pi pi-list" style={{ marginRight: '8px' }} />Daftar Permohonan HAKI
          </h3>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Cari permohonan..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ width: '220px' }} />
          </span>
        </div>

        {error && <Message severity="error" text={error} className="w-full mb-3" />}

        <DataTable value={data} loading={loading} stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data permohonan HAKI" size="small">
          <Column header="No" body={(_r: Haki, o: { rowIndex: number }) => ((page - 1) * 10) + (o.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Produk" body={pemohonTemplate} style={{ minWidth: '220px' }} />
          <Column header="Jenis HAKI" body={jenisTemplate} style={{ width: '150px' }} />
          <Column header="No. Sertifikat" body={noHakiTemplate} style={{ width: '150px' }} />
          <Column header="Tanggal" body={tanggalTemplate} />
          <Column header="Status" body={statusTemplate} style={{ width: '130px' }} />
          <Column header="Aksi" body={aksiTemplate} style={{ width: '110px' }} />
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

      <Dialog visible={showDialog} onHide={() => setShowDialog(false)} header={editItem ? 'Edit Permohonan HAKI' : 'Tambah Permohonan HAKI'} modal style={{ width: '520px' }} draggable={false} footer={dialogFooter}>
        <form id="haki-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Nama Produk</label>
            <InputText value={form.nama_produk} onChange={e => setForm({ ...form, nama_produk: e.target.value })} required placeholder="Nama produk/karya" />
          </div>
          <div className="grid">
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Jenis HAKI</label>
              <Dropdown value={form.jenis_haki} options={JENIS_OPTIONS} onChange={e => setForm({ ...form, jenis_haki: e.value })} placeholder="Pilih jenis" />
            </div>
            <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>No. Permohonan</label>
              <InputText value={form.nomor_permohonan} onChange={e => setForm({ ...form, nomor_permohonan: e.target.value })} placeholder="Nomor permohonan" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Deskripsi</label>
            <InputTextarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={3} autoResize placeholder="Deskripsi permohonan" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default HakiList;
