import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminPelakuEkrafService } from '../../../services';
import type { PelakuEkraf } from '../../../types';
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

const STATUS_MAP: Record<string, { label: string; severity: 'success' | 'warning' | 'danger' | 'info' }> = {
  terverifikasi: { label: 'Terverifikasi', severity: 'success' },
  pending: { label: 'Menunggu', severity: 'warning' },
  draft: { label: 'Draft', severity: 'info' },
  ditolak: { label: 'Ditolak', severity: 'danger' },
};

const SKALA_COLORS: Record<string, string> = {
  mikro: '#6366f1',
  kecil: '#14b8a6',
  menengah: '#f59e0b',
  besar: '#ef4444',
};

const PelakuEkrafList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PelakuEkraf[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Pelaku DISPOPAR' }];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminPelakuEkrafService.list({ page, per_page: 10, search: search || undefined });
      setData(res.data ?? []);
      setLastPage(res.last_page ?? 1);
      setTotal(res.total ?? 0);
    } catch {
      setError('Gagal memuat data pelaku EKRAF');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const confirmDelete = (row: PelakuEkraf) => {
    confirmDialog({
      message: `Hapus data pelaku "${row.nama}"?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Hapus',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminPelakuEkrafService.destroy(row.id);
          fetchData();
        } catch {
          alert('Gagal menghapus data pelaku');
        }
      },
    });
  };

  const namaTemplate = (row: PelakuEkraf) => {
    const initials = row.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Avatar
          label={initials}
          shape="circle"
          style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }}
        />
        <div>
          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{row.nama}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.nama_usaha || '-'}</div>
        </div>
      </div>
    );
  };

  const subsektorTemplate = (row: PelakuEkraf) => (
    <Tag value={row.subsektor?.nama || '-'} severity="info" rounded />
  );

  const skalaTemplate = (row: PelakuEkraf) => {
    const color = SKALA_COLORS[row.skala_usaha] ?? '#6366f1';
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', padding: '4px 10px',
        borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
        background: color + '14', color,
      }}>
        {row.skala_usaha}
      </span>
    );
  };

  const statusTemplate = (row: PelakuEkraf) => {
    const s = STATUS_MAP[row.status] ?? { label: row.status, severity: 'info' as const };
    return <Tag value={s.label} severity={s.severity} rounded />;
  };

  const tanggalTemplate = (row: PelakuEkraf) => (
    <span style={{ fontSize: '0.875rem', color: '#475569' }}>
      {new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
    </span>
  );

  const actionTemplate = (row: PelakuEkraf) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <Button icon="pi pi-eye" text rounded severity="info" size="small" tooltip="Lihat Detail" tooltipOptions={{ position: 'top' }} onClick={() => navigate(`/dashboard/pelaku-ekraf/${row.id}`)} />
      <Button icon="pi pi-trash" text rounded severity="danger" size="small" tooltip="Hapus" tooltipOptions={{ position: 'top' }} onClick={() => confirmDelete(row)} />
    </div>
  );

  const verifiedCount = data.filter(d => d.status === 'terverifikasi').length;
  const pendingCount = data.filter(d => d.status === 'pending').length;
  const rejectedCount = data.filter(d => d.status === 'ditolak').length;

  const kpiItems = [
    { label: 'Total Pelaku', value: total, icon: 'pi pi-users', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Terverifikasi', value: verifiedCount, icon: 'pi pi-check-circle', color: '#22c55e', bg: '#f0fdf4' },
    { label: 'Menunggu', value: pendingCount, icon: 'pi pi-clock', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Ditolak', value: rejectedCount, icon: 'pi pi-times-circle', color: '#ef4444', bg: '#fef2f2' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ConfirmDialog />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      {/* KPI Cards */}
      <div className="grid">
        {kpiItems.map((kpi, idx) => (
          <div key={idx} className="col-12 md:col-6 xl:col-3">
            <div style={{
              background: '#ffffff', borderRadius: '12px', padding: '20px',
              display: 'flex', alignItems: 'center', gap: '16px',
              border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', background: kpi.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={kpi.icon} style={{ fontSize: '1.25rem', color: kpi.color }} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{kpi.value}</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{kpi.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DataTable */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>Semua Pelaku DISPOPAR</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#64748b' }}>{total} pelaku terdaftar</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText placeholder="Cari pelaku..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ width: '220px' }} />
            </span>
            <Button label="Tambah Pelaku" icon="pi pi-plus" raised onClick={() => navigate('/dashboard/pelaku-ekraf/tambah')} />
          </div>
        </div>

        {error && <Message severity="error" text={error} className="w-full mb-3" />}

        <DataTable value={data} loading={loading} emptyMessage="Belum ada data pelaku DISPOPAR" responsiveLayout="scroll" stripedRows showGridlines={false} className="p-datatable-sm" size="small">
          <Column header="#" body={(_d: PelakuEkraf, opts: { rowIndex: number }) => ((page - 1) * 10) + (opts.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Pelaku" body={namaTemplate} style={{ minWidth: '250px' }} />
          <Column header="Subsektor" body={subsektorTemplate} style={{ minWidth: '140px' }} />
          <Column header="Skala" body={skalaTemplate} style={{ minWidth: '110px' }} />
          <Column header="Status" body={statusTemplate} style={{ minWidth: '130px' }} />
          <Column header="Tgl Daftar" body={tanggalTemplate} style={{ minWidth: '130px' }} />
          <Column header="Aksi" body={actionTemplate} style={{ minWidth: '110px' }} />
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

export default PelakuEkrafList;
