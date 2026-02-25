import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminHakiService } from '../../../services';
import type { Haki } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Avatar } from 'primereact/avatar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';

const STATUS_MAP: Record<string, { severity: 'success' | 'warning' | 'danger'; label: string }> = {
  terdaftar: { severity: 'success', label: 'Lolos Kurasi' },
  diajukan: { severity: 'warning', label: 'Menunggu' },
  proses: { severity: 'warning', label: 'Menunggu' },
  ditolak: { severity: 'danger', label: 'Tidak Lolos' },
};

const JENIS_MAP: Record<string, string> = {
  merek: 'Merek Dagang',
  hak_cipta: 'Hak Cipta',
  paten: 'Paten',
  desain_industri: 'Desain Industri',
  indikasi_geografis: 'Indikasi Geografis',
};

const HakiKurasi = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Haki[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'HAKI & Kurasi', command: () => navigate('/dashboard/haki') },
    { label: 'Kurasi Produk' },
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
      setError('Gagal memuat data kurasi');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const confirmApprove = (row: Haki) => {
    confirmDialog({
      message: `Setujui produk "${row.nama_produk}" lolos kurasi?`,
      header: 'Konfirmasi Kurasi',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Ya, Setujui',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminHakiService.update(row.id, { status: 'terdaftar' } as Partial<Haki>);
          fetchData();
        } catch {
          alert('Gagal menyetujui kurasi');
        }
      },
    });
  };

  const confirmReject = (row: Haki) => {
    confirmDialog({
      message: `Tolak produk "${row.nama_produk}" dari kurasi?`,
      header: 'Konfirmasi Penolakan',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Ya, Tolak',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminHakiService.update(row.id, { status: 'ditolak' } as Partial<Haki>);
          fetchData();
        } catch {
          alert('Gagal menolak kurasi');
        }
      },
    });
  };

  const waitingCount = data.filter(d => d.status === 'diajukan' || d.status === 'proses').length;
  const passedCount = data.filter(d => d.status === 'terdaftar').length;
  const rejectedCount = data.filter(d => d.status === 'ditolak').length;

  const stats = [
    { label: 'Menunggu Kurasi', value: waitingCount, icon: 'pi pi-clock', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Lolos Kurasi', value: passedCount, icon: 'pi pi-check-circle', color: '#22c55e', bg: '#ecfdf5' },
    { label: 'Tidak Lolos', value: rejectedCount, icon: 'pi pi-times-circle', color: '#ef4444', bg: '#fef2f2' },
  ];

  const produkTemplate = (row: Haki) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar icon="pi pi-box" shape="circle" style={{ backgroundColor: '#8b5cf6', color: '#fff' }} />
      <div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.nama_produk}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>oleh {row.pelaku_ekraf?.nama || row.user?.name || '-'}</div>
      </div>
    </div>
  );

  const jenisTemplate = (row: Haki) => <Tag value={JENIS_MAP[row.jenis_haki] || row.jenis_haki} severity="info" />;

  const statusTemplate = (row: Haki) => {
    const s = STATUS_MAP[row.status] || { severity: 'info' as const, label: row.status };
    return <Tag value={s.label} severity={s.severity} />;
  };

  const tanggalTemplate = (row: Haki) =>
    new Date(row.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const aksiTemplate = (row: Haki) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button icon="pi pi-eye" rounded text severity="info" tooltip="Detail" tooltipOptions={{ position: 'top' }} />
      {(row.status === 'diajukan' || row.status === 'proses') && (
        <>
          <Button icon="pi pi-check" rounded text severity="success" tooltip="Setujui" tooltipOptions={{ position: 'top' }} onClick={() => confirmApprove(row)} />
          <Button icon="pi pi-times" rounded text severity="danger" tooltip="Tolak" tooltipOptions={{ position: 'top' }} onClick={() => confirmReject(row)} />
        </>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ConfirmDialog />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

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
            <i className="pi pi-star" style={{ marginRight: '8px' }} />Produk Kurasi
          </h3>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Cari produk..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ width: '220px' }} />
          </span>
        </div>

        {error && <Message severity="error" text={error} className="w-full mb-3" />}

        <DataTable value={data} loading={loading} stripedRows responsiveLayout="scroll" emptyMessage="Belum ada produk yang perlu dikurasi" size="small">
          <Column header="No" body={(_r: Haki, o: { rowIndex: number }) => ((page - 1) * 10) + (o.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Produk" body={produkTemplate} style={{ minWidth: '220px' }} />
          <Column header="Jenis HAKI" body={jenisTemplate} style={{ width: '150px' }} />
          <Column header="Tanggal Submit" body={tanggalTemplate} />
          <Column header="Status" body={statusTemplate} style={{ width: '140px' }} />
          <Column header="Aksi" body={aksiTemplate} style={{ width: '140px' }} />
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
    </div>
  );
};

export default HakiKurasi;
