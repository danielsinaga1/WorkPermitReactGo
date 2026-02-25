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
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { adminPengaduanService } from '../../../services/newFeaturesService';
import type { Pengaduan } from '../../../types';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Baru', value: 'baru' },
  { label: 'Diproses', value: 'diproses' },
  { label: 'Ditanggapi', value: 'ditanggapi' },
  { label: 'Selesai', value: 'selesai' },
  { label: 'Ditolak', value: 'ditolak' },
];

const KATEGORI_OPTIONS = [
  { label: 'Semua Kategori', value: '' },
  { label: 'Fasilitas', value: 'fasilitas' },
  { label: 'Pelayanan', value: 'pelayanan' },
  { label: 'Saran', value: 'saran' },
  { label: 'Lainnya', value: 'lainnya' },
];

const PengaduanList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<Pengaduan[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Pengaduan | null>(null);
  const [tanggapan, setTanggapan] = useState('');
  const [respondStatus, setRespondStatus] = useState('ditanggapi');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Pengaduan' }];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await adminPengaduanService.list({ search, status: statusFilter || undefined, page });
      setData(resp.data);
      setTotalRecords(resp.meta.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data' });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const openTanggapi = (item: Pengaduan) => {
    setSelectedItem(item);
    setTanggapan(item.tanggapan || '');
    setRespondStatus(item.status === 'baru' ? 'diproses' : 'ditanggapi');
    setShowDialog(true);
  };

  const submitTanggapan = async () => {
    if (!selectedItem) return;
    try {
      await adminPengaduanService.tanggapi(selectedItem.id, { status: respondStatus, tanggapan });
      toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Tanggapan berhasil disimpan' });
      setShowDialog(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan tanggapan' });
    }
  };

  const statusTemplate = (row: Pengaduan) => {
    const colors: Record<string, 'info' | 'warning' | 'success' | 'danger'> = {
      baru: 'info', diproses: 'warning', ditanggapi: 'success', selesai: 'success', ditolak: 'danger',
    };
    return <Tag value={row.status} severity={colors[row.status] || 'info'} className="text-xs" />;
  };

  const kategoriTemplate = (row: Pengaduan) => {
    const colors: Record<string, 'info' | 'warning' | 'success' | 'danger'> = {
      fasilitas: 'warning', pelayanan: 'info', saran: 'success', lainnya: 'danger',
    };
    return <Tag value={row.kategori} severity={colors[row.kategori] || 'info'} className="text-xs" />;
  };

  const actionTemplate = (row: Pengaduan) => (
    <div className="flex gap-2">
      <Button icon="pi pi-comment" severity="info" text rounded tooltip="Tanggapi" onClick={() => openTanggapi(row)} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none px-0" />

      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Sistem Pengaduan</h2>
          <p className="text-sm text-500 mt-1 mb-0">Kelola pengaduan dan saran dari masyarakat</p>
        </div>
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center gap-3 mb-4 flex-wrap">
          <span className="p-input-icon-left flex-1" style={{ minWidth: '200px' }}>
            <i className="pi pi-search" />
            <InputText value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari pengaduan..." className="w-full border-round-lg" />
          </span>
          <Dropdown value={statusFilter} options={STATUS_OPTIONS} onChange={(e) => { setStatusFilter(e.value); setPage(1); }} className="border-round-lg" style={{ minWidth: '160px' }} />
        </div>

        <DataTable value={data} loading={loading} paginator lazy rows={10} totalRecords={totalRecords} first={(page - 1) * 10} onPage={(e) => setPage(Math.floor((e.first ?? 0) / 10) + 1)} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada pengaduan">
          <Column field="kode_pengaduan" header="Kode" className="font-mono text-sm" />
          <Column field="nama_pelapor" header="Pelapor" className="font-medium" />
          <Column field="judul" header="Judul" />
          <Column header="Kategori" body={kategoriTemplate} alignHeader="center" bodyClassName="text-center" />
          <Column header="Status" body={statusTemplate} alignHeader="center" bodyClassName="text-center" />
          <Column field="created_at" header="Tanggal" />
          <Column header="Aksi" body={actionTemplate} style={{ width: '80px' }} />
        </DataTable>
      </Card>

      <Dialog visible={showDialog} onHide={() => setShowDialog(false)} header="Tanggapi Pengaduan" style={{ width: '600px' }} className="border-round-xl">
        {selectedItem && (
          <div className="flex flex-column gap-3 mt-2">
            <div className="surface-100 border-round-lg p-3">
              <div className="text-sm font-semibold text-800 mb-1">{selectedItem.judul}</div>
              <div className="text-sm text-600 mb-2">{selectedItem.deskripsi}</div>
              <div className="flex gap-3 text-xs text-500">
                <span><i className="pi pi-user mr-1" />{selectedItem.nama_pelapor}</span>
                <span><i className="pi pi-tag mr-1" />{selectedItem.kategori}</span>
                <span><i className="pi pi-calendar mr-1" />{selectedItem.created_at}</span>
              </div>
            </div>
            <div className="flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Status</label>
              <Dropdown
                value={respondStatus}
                options={STATUS_OPTIONS.filter(o => o.value)}
                onChange={(e) => setRespondStatus(e.value)}
                className="border-round-lg"
              />
            </div>
            <div className="flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Tanggapan</label>
              <InputTextarea value={tanggapan} onChange={(e) => setTanggapan(e.target.value)} rows={4} className="border-round-lg" />
            </div>
            <div className="flex justify-content-end gap-2 mt-2">
              <Button label="Batal" severity="secondary" outlined className="border-round-lg" onClick={() => setShowDialog(false)} />
              <Button label="Kirim Tanggapan" icon="pi pi-send" className="border-round-lg" onClick={submitTanggapan} />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default PengaduanList;
