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
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { adminAtletService } from '../../../services/newFeaturesService';
import type { Atlet } from '../../../types';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Aktif', value: 'aktif' },
  { label: 'Nonaktif', value: 'nonaktif' },
  { label: 'Pensiun', value: 'pensiun' },
];

const AtletList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<Atlet[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Atlet> | null>(null);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Olahraga' }, { label: 'Database Atlet' }];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await adminAtletService.list({ search, status: statusFilter || undefined, page });
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
  const openEdit = (item: Atlet) => { setEditItem({ ...item }); setShowDialog(true); };

  const saveItem = async () => {
    if (!editItem) return;
    try {
      if (editItem.id) {
        await adminAtletService.update(editItem.id, editItem);
        toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data atlet berhasil diperbarui' });
      } else {
        await adminAtletService.create(editItem);
        toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data atlet berhasil ditambahkan' });
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
      await adminAtletService.destroy(id);
      toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data atlet berhasil dihapus' });
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus data' });
    }
  };

  const namaTemplate = (row: Atlet) => {
    const initials = row.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return (
      <div className="flex align-items-center gap-3">
        <Avatar label={initials} shape="circle" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }} />
        <div>
          <div className="font-semibold text-800 text-sm">{row.nama}</div>
          <div className="text-xs text-500">{row.cabang_olahraga}</div>
        </div>
      </div>
    );
  };

  const statusTemplate = (row: Atlet) => {
    const colors: Record<string, 'success' | 'warning' | 'danger'> = { aktif: 'success', nonaktif: 'warning', pensiun: 'danger' };
    return <Tag value={row.status} severity={colors[row.status] || 'info'} className="text-xs" />;
  };

  const actionTemplate = (row: Atlet) => (
    <div className="flex gap-2">
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
          <h2 className="text-2xl font-bold text-800 m-0">Database Atlet</h2>
          <p className="text-sm text-500 mt-1 mb-0">Kelola data atlet Kota Bontang</p>
        </div>
        <Button label="Tambah Atlet" icon="pi pi-plus" className="border-round-xl" onClick={openNew} />
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center gap-3 mb-4 flex-wrap">
          <span className="p-input-icon-left flex-1" style={{ minWidth: '200px' }}>
            <i className="pi pi-search" />
            <InputText value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nama, cabang olahraga..." className="w-full border-round-lg" />
          </span>
          <Dropdown value={statusFilter} options={STATUS_OPTIONS} onChange={(e) => { setStatusFilter(e.value); setPage(1); }} className="border-round-lg" style={{ minWidth: '180px' }} />
        </div>

        <DataTable value={data} loading={loading} paginator lazy rows={10} totalRecords={totalRecords} first={(page - 1) * 10} onPage={(e) => setPage(Math.floor((e.first ?? 0) / 10) + 1)} size="small" stripedRows responsiveLayout="scroll" emptyMessage="Belum ada data atlet">
          <Column header="Nama" body={namaTemplate} />
          <Column field="klub" header="Klub" />
          <Column field="jenis_kelamin" header="JK" alignHeader="center" bodyClassName="text-center" />
          <Column header="Status" body={statusTemplate} alignHeader="center" bodyClassName="text-center" />
          <Column header="Aksi" body={actionTemplate} style={{ width: '120px' }} />
        </DataTable>
      </Card>

      <Dialog visible={showDialog} onHide={() => setShowDialog(false)} header={editItem?.id ? 'Edit Atlet' : 'Tambah Atlet'} style={{ width: '600px' }} className="border-round-xl">
        <div className="flex flex-column gap-3 mt-2">
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Nama</label>
            <InputText value={editItem?.nama || ''} onChange={(e) => setEditItem({ ...editItem, nama: e.target.value })} className="border-round-lg" />
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Cabang Olahraga</label>
              <InputText value={editItem?.cabang_olahraga || ''} onChange={(e) => setEditItem({ ...editItem, cabang_olahraga: e.target.value })} className="border-round-lg" />
            </div>
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Klub</label>
              <InputText value={editItem?.klub || ''} onChange={(e) => setEditItem({ ...editItem, klub: e.target.value })} className="border-round-lg" />
            </div>
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Jenis Kelamin</label>
              <Dropdown value={editItem?.jenis_kelamin || ''} options={[{ label: 'Laki-laki', value: 'L' }, { label: 'Perempuan', value: 'P' }]} onChange={(e) => setEditItem({ ...editItem, jenis_kelamin: e.value })} className="border-round-lg" />
            </div>
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Tanggal Lahir</label>
              <Calendar value={editItem?.tanggal_lahir ? new Date(editItem.tanggal_lahir) : undefined} onChange={(e) => setEditItem({ ...editItem, tanggal_lahir: e.value ? (e.value as Date).toISOString().split('T')[0] : '' })} dateFormat="yy-mm-dd" className="border-round-lg" />
            </div>
          </div>
          <div className="grid">
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">No. Telp</label>
              <InputText value={editItem?.no_telp || ''} onChange={(e) => setEditItem({ ...editItem, no_telp: e.target.value })} className="border-round-lg" />
            </div>
            <div className="col-6 flex flex-column gap-1">
              <label className="text-sm font-medium text-700">Status</label>
              <Dropdown value={editItem?.status || ''} options={STATUS_OPTIONS.filter(o => o.value)} onChange={(e) => setEditItem({ ...editItem, status: e.value })} className="border-round-lg" />
            </div>
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

export default AtletList;
