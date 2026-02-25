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
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { adminTurnamenService } from '../../../services/newFeaturesService';
import type { Turnamen } from '../../../types';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Pendaftaran', value: 'pendaftaran' },
  { label: 'Berlangsung', value: 'berlangsung' },
  { label: 'Selesai', value: 'selesai' },
  { label: 'Dibatalkan', value: 'dibatalkan' },
];

const TurnamenList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<Turnamen[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Turnamen> | null>(null);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Olahraga' }, { label: 'Manajemen Turnamen' }];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await adminTurnamenService.list({ search, status: statusFilter || undefined, page });
      setData(resp.data);
      setTotalRecords(resp.meta.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data' });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => { setEditItem({}); setShowDialog(true); };
  const openEdit = (item: Turnamen) => { setEditItem({ ...item }); setShowDialog(true); };

  const saveItem = async () => {
    if (!editItem) return;
    try {
      if (editItem.id) {
        await adminTurnamenService.update(editItem.id, editItem);
        toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Turnamen berhasil diperbarui' });
      } else {
        await adminTurnamenService.create(editItem);
        toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Turnamen berhasil ditambahkan' });
      }
      setShowDialog(false);
      setEditItem(null);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan data' });
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await adminTurnamenService.destroy(id);
      toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Turnamen berhasil dihapus' });
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus data' });
    }
  };

  const statusTemplate = (row: Turnamen) => {
    const colors: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
      pendaftaran: 'info', berlangsung: 'warning', selesai: 'success', dibatalkan: 'danger',
    };
    return <Tag value={row.status} severity={colors[row.status] || 'info'} className="text-xs" />;
  };

  const pesertaTemplate = (row: Turnamen) => (
    <span className="font-medium">{row.peserta_count ?? 0} / {row.kuota_peserta}</span>
  );

  const actionTemplate = (row: Turnamen) => (
    <div className="flex gap-2">
      <Button icon="pi pi-users" severity="help" text rounded tooltip="Peserta" onClick={() => navigate(`/dashboard/turnamen/${row.id}/peserta`)} />
      <Button icon="pi pi-pencil" severity="info" text rounded onClick={() => openEdit(row)} />
      <Button icon="pi pi-trash" severity="danger" text rounded onClick={() => deleteItem(row.id)} />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      <Toast ref={toast} />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="surface-ground border-none px-0" />

      <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-800 m-0">Manajemen Turnamen</h2>
          <p className="text-sm text-500 mt-1 mb-0">Kelola turnamen olahraga Kota Bontang</p>
        </div>
        <Button label="Tambah Turnamen" icon="pi pi-plus" className="border-round-xl" onClick={openNew} />
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center gap-3 mb-4 flex-wrap">
          <span className="p-input-icon-left flex-1" style={{ minWidth: '200px' }}>
            <i className="pi pi-search" />
            <InputText value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari turnamen..." className="w-full border-round-lg" />
          </span>
          <Dropdown value={statusFilter} options={STATUS_OPTIONS} onChange={(e) => { setStatusFilter(e.value); setPage(1); }} className="border-round-lg" style={{ minWidth: '180px' }} />
        </div>

        <DataTable value={data} loading={loading} paginator lazy rows={10} totalRecords={totalRecords} first={(page - 1) * 10} onPage={(e) => setPage(Math.floor((e.first ?? 0) / 10) + 1)} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data turnamen">
          <Column field="nama" header="Nama Turnamen" className="font-medium" />
          <Column field="cabang_olahraga" header="Cabang" />
          <Column field="lokasi" header="Lokasi" />
          <Column field="tanggal_mulai" header="Mulai" />
          <Column header="Peserta" body={pesertaTemplate} alignHeader="center" bodyClassName="text-center" />
          <Column header="Status" body={statusTemplate} alignHeader="center" bodyClassName="text-center" />
          <Column header="Aksi" body={actionTemplate} style={{ width: '150px' }} />
        </DataTable>
      </Card>

      <Dialog visible={showDialog} onHide={() => setShowDialog(false)} header={editItem?.id ? 'Edit Turnamen' : 'Tambah Turnamen'} style={{ width: '650px' }} className="border-round-xl">
        <div className="flex flex-column gap-3 mt-2">
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Nama Turnamen</label>
            <InputText value={editItem?.nama || ''} onChange={(e) => setEditItem({ ...editItem, nama: e.target.value })} className="border-round-lg" />
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Cabang Olahraga</label>
              <InputText value={editItem?.cabang_olahraga || ''} onChange={(e) => setEditItem({ ...editItem, cabang_olahraga: e.target.value })} className="border-round-lg" />
            </div>
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Lokasi</label>
              <InputText value={editItem?.lokasi || ''} onChange={(e) => setEditItem({ ...editItem, lokasi: e.target.value })} className="border-round-lg" />
            </div>
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Tanggal Mulai</label>
              <Calendar value={editItem?.tanggal_mulai ? new Date(editItem.tanggal_mulai) : undefined} onChange={(e) => setEditItem({ ...editItem, tanggal_mulai: e.value ? (e.value as Date).toISOString().split('T')[0] : '' })} dateFormat="yy-mm-dd" className="border-round-lg" />
            </div>
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Tanggal Selesai</label>
              <Calendar value={editItem?.tanggal_selesai ? new Date(editItem.tanggal_selesai) : undefined} onChange={(e) => setEditItem({ ...editItem, tanggal_selesai: e.value ? (e.value as Date).toISOString().split('T')[0] : '' })} dateFormat="yy-mm-dd" className="border-round-lg" />
            </div>
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Kuota Peserta</label>
              <InputNumber value={editItem?.kuota_peserta || 0} onValueChange={(e) => setEditItem({ ...editItem, kuota_peserta: e.value ?? 0 })} className="border-round-lg" />
            </div>
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Penyelenggara</label>
              <InputText value={editItem?.penyelenggara || ''} onChange={(e) => setEditItem({ ...editItem, penyelenggara: e.target.value })} className="border-round-lg" />
            </div>
          </div>
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Batas Pendaftaran</label>
            <Calendar value={editItem?.batas_pendaftaran ? new Date(editItem.batas_pendaftaran) : undefined} onChange={(e) => setEditItem({ ...editItem, batas_pendaftaran: e.value ? (e.value as Date).toISOString().split('T')[0] : '' })} dateFormat="yy-mm-dd" className="border-round-lg" />
          </div>
          <div className="flex justify-content-end gap-2 mt-2">
            <Button label="Batal" severity="secondary" outlined className="border-round-lg" onClick={() => setShowDialog(false)} />
            <Button label="Simpan" icon="pi pi-check" className="border-round-lg" onClick={saveItem} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default TurnamenList;
