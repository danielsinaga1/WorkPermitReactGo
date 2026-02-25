import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { adminDestinasiService } from '../../../services';
import type { TiketWisata, StatusTiket } from '../../../types';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Menunggu Bayar', value: 'menunggu_bayar' },
  { label: 'Terbayar', value: 'terbayar' },
  { label: 'Digunakan', value: 'digunakan' },
  { label: 'Dibatalkan', value: 'dibatalkan' },
  { label: 'Kadaluarsa', value: 'kadaluarsa' },
];

const STATUS_COLOR: Record<StatusTiket, 'success' | 'warning' | 'info' | 'danger' | undefined> = {
  menunggu_bayar: 'warning',
  terbayar: 'success',
  digunakan: 'info',
  dibatalkan: 'danger',
  kadaluarsa: undefined,
};

const STATUS_LABEL: Record<StatusTiket, string> = {
  menunggu_bayar: 'Menunggu Bayar',
  terbayar: 'Terbayar',
  digunakan: 'Sudah Digunakan',
  dibatalkan: 'Dibatalkan',
  kadaluarsa: 'Kadaluarsa',
};

const TiketWisataList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [items, setItems] = useState<TiketWisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Pariwisata' }, { label: 'E-Ticketing' }];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, unknown> = { page, per_page: 15 };
      if (statusFilter) filters.status = statusFilter;
      const resp = await adminDestinasiService.listTiket(filters);
      setItems(resp.data);
      setTotal(resp.meta.total);
      setLastPage(resp.meta.last_page);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data tiket' });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const confirmValidate = (tiket: TiketWisata) => {
    confirmDialog({
      message: `Validasi tiket ${tiket.kode_tiket}? Tiket akan ditandai sebagai "Digunakan".`,
      header: 'Validasi Tiket',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Validasi',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await adminDestinasiService.validateTiket(tiket.id);
          toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: `Tiket ${tiket.kode_tiket} telah divalidasi` });
          fetchData();
        } catch {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memvalidasi tiket' });
        }
      },
    });
  };

  const terbayarCount = items.filter(i => i.status === 'terbayar').length;
  const digunakanCount = items.filter(i => i.status === 'digunakan').length;
  const totalRevenue = items.reduce((acc, i) => acc + (i.status !== 'dibatalkan' ? i.total_harga : 0), 0);

  const kodeTemplate = (row: TiketWisata) => (
    <span className="font-mono font-semibold text-primary">{row.kode_tiket}</span>
  );

  const destinasiTemplate = (row: TiketWisata) => (
    <div>
      <div className="font-medium text-800">{row.destinasi?.nama || `Destinasi #${row.destinasi_id}`}</div>
      <div className="text-xs text-500">{row.user?.name || `User #${row.user_id}`}</div>
    </div>
  );

  const tanggalTemplate = (row: TiketWisata) => (
    <span className="text-sm">{new Date(row.tanggal_kunjungan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
  );

  const hargaTemplate = (row: TiketWisata) => (
    <div className="text-right">
      <div className="font-medium text-800">Rp {row.total_harga.toLocaleString('id-ID')}</div>
      <div className="text-xs text-500">{row.jumlah_tiket} × Rp {row.harga_satuan.toLocaleString('id-ID')}</div>
    </div>
  );

  const statusTemplate = (row: TiketWisata) => (
    <Tag value={STATUS_LABEL[row.status]} severity={STATUS_COLOR[row.status]} className="text-xs" />
  );

  const actionTemplate = (row: TiketWisata) => (
    <div className="flex gap-1">
      {row.status === 'terbayar' && (
        <Button icon="pi pi-check-circle" text rounded severity="success" tooltip="Validasi" tooltipOptions={{ position: 'top' }} onClick={() => confirmValidate(row)} />
      )}
      {row.qr_code && (
        <Button icon="pi pi-qrcode" text rounded severity="info" tooltip="QR Code" tooltipOptions={{ position: 'top' }} onClick={() => window.open(row.qr_code!, '_blank')} />
      )}
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none px-0" />

      <div>
        <h2 className="text-2xl font-bold text-800 m-0">Manajemen E-Ticketing</h2>
        <p className="text-sm text-500 mt-1 mb-0">Kelola dan validasi tiket wisata digital</p>
      </div>

      {/* KPI */}
      <div className="grid">
        {[
          { label: 'Total Tiket', value: total, icon: 'pi pi-ticket', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
          { label: 'Terbayar', value: terbayarCount, icon: 'pi pi-check-circle', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Terpakai', value: digunakanCount, icon: 'pi pi-verified', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
          { label: 'Pendapatan', value: `Rp ${(totalRevenue / 1000000).toFixed(1)}jt`, icon: 'pi pi-wallet', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map(s => (
          <div key={s.label} className="col-12 md:col-6 lg:col-3">
            <Card className="shadow-1 border-round-xl">
              <div className="flex gap-3 align-items-center">
                <div className="flex align-items-center justify-content-center border-round-xl" style={{ width: 48, height: 48, background: s.bg }}>
                  <i className={s.icon} style={{ fontSize: '1.25rem', color: s.color }} />
                </div>
                <div>
                  <div className="text-xl font-bold text-800">{s.value}</div>
                  <div className="text-sm text-500">{s.label}</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex flex-wrap gap-3 mb-4 align-items-center justify-content-between">
          <Dropdown
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={(e) => { setStatusFilter(e.value); setPage(1); }}
            className="border-round-xl w-14rem"
          />
          <span className="text-sm text-500">Total: {total} tiket</span>
        </div>

        <DataTable value={items} loading={loading} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data tiket">
          <Column header="Kode Tiket" body={kodeTemplate} style={{ width: '140px' }} />
          <Column header="Destinasi / User" body={destinasiTemplate} style={{ minWidth: '200px' }} />
          <Column header="Tanggal" body={tanggalTemplate} style={{ width: '120px' }} />
          <Column header="Total Harga" body={hargaTemplate} style={{ width: '160px' }} />
          <Column header="Status" body={statusTemplate} alignHeader="center" bodyClassName="text-center" style={{ width: '130px' }} />
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
    </div>
  );
};

export default TiketWisataList;
