import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminPelakuEkrafService } from '../../../services';
import type { PelakuEkraf } from '../../../types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';

const PelakuEkrafVerifikasi = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PelakuEkraf[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Pelaku DISPOPAR', command: () => navigate('/dashboard/pelaku-ekraf') },
    { label: 'Verifikasi' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminPelakuEkrafService.list({ page, per_page: 10, status: 'pending', search: search || undefined });
      setData(res.data ?? []);
      setLastPage(res.last_page ?? 1);
      setTotal(res.total ?? 0);
    } catch {
      setError('Gagal memuat data verifikasi');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const confirmApprove = (row: PelakuEkraf) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin memverifikasi data "${row.nama}"?`,
      header: 'Konfirmasi Verifikasi',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Ya, Verifikasi',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminPelakuEkrafService.verifikasi(row.id, { status: 'terverifikasi' });
          fetchData();
        } catch {
          alert('Gagal memverifikasi pelaku');
        }
      },
    });
  };

  const confirmReject = (row: PelakuEkraf) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menolak data "${row.nama}"?`,
      header: 'Konfirmasi Penolakan',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya, Tolak',
      rejectLabel: 'Batal',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await adminPelakuEkrafService.verifikasi(row.id, { status: 'ditolak' });
          fetchData();
        } catch {
          alert('Gagal menolak pelaku');
        }
      },
    });
  };

  const stats = [
    { label: 'Menunggu Verifikasi', value: total, icon: 'pi pi-clock', color: '#f59e0b', bg: '#fef3c7' },
  ];

  const namaTemplate = (row: PelakuEkraf) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar label={row.nama.charAt(0)} shape="circle" size="normal" style={{ backgroundColor: '#6366f1', color: '#fff' }} />
      <div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.nama}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>NIK: {row.nik || '-'}</div>
      </div>
    </div>
  );

  const subsektorTemplate = (row: PelakuEkraf) => <Tag value={row.subsektor?.nama || '-'} severity="info" />;

  const tanggalTemplate = (row: PelakuEkraf) =>
    new Date(row.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const aksiTemplate = (row: PelakuEkraf) => (
    <div style={{ display: 'flex', gap: '6px' }}>
      <Button icon="pi pi-eye" rounded text severity="info" tooltip="Detail" tooltipOptions={{ position: 'top' }} onClick={() => navigate(`/dashboard/pelaku-ekraf/${row.id}`)} />
      <Button icon="pi pi-check" rounded text severity="success" tooltip="Verifikasi" tooltipOptions={{ position: 'top' }} onClick={() => confirmApprove(row)} />
      <Button icon="pi pi-times" rounded text severity="danger" tooltip="Tolak" tooltipOptions={{ position: 'top' }} onClick={() => confirmReject(row)} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ConfirmDialog />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />

      {/* KPI Cards */}
      <div className="grid">
        {stats.map((s, i) => (
          <div className="col-12 md:col-4" key={i}>
            <Card style={{ borderLeft: `4px solid ${s.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={s.icon} style={{ fontSize: '1.25rem', color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</div>
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
          <h3 style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>
            <i className="pi pi-list" style={{ marginRight: '8px' }} />
            Data Menunggu Verifikasi
          </h3>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Cari pelaku..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ width: '220px' }} />
          </span>
        </div>

        {error && <Message severity="error" text={error} className="w-full mb-3" />}

        <DataTable value={data} loading={loading} emptyMessage="Belum ada data yang perlu diverifikasi" stripedRows responsiveLayout="scroll" size="small">
          <Column header="No" body={(_row: PelakuEkraf, opts: { rowIndex: number }) => ((page - 1) * 10) + (opts.rowIndex ?? 0) + 1} style={{ width: '50px' }} />
          <Column header="Nama Pelaku" body={namaTemplate} />
          <Column field="nama_usaha" header="Nama Usaha" body={(row: PelakuEkraf) => <span>{row.nama_usaha || '-'}</span>} />
          <Column header="Subsektor" body={subsektorTemplate} />
          <Column header="Tanggal Daftar" body={tanggalTemplate} />
          <Column header="Aksi" body={aksiTemplate} style={{ width: '150px' }} />
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

export default PelakuEkrafVerifikasi;
