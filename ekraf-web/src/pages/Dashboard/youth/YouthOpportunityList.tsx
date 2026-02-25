import { useState, useEffect, useCallback } from 'react';
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
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { adminYouthService } from '../../../services/newFeaturesService';
import type { YouthOpportunity } from '../../../types';

const JENIS_OPTIONS = [
  { label: 'Semua Jenis', value: '' },
  { label: 'Beasiswa', value: 'beasiswa' },
  { label: 'Lowongan Kerja', value: 'lowongan_kerja' },
  { label: 'Magang', value: 'magang' },
];

const YouthOpportunityList = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<YouthOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Partial<YouthOpportunity> | null>(null);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [{ label: 'Kepemudaan' }, { label: 'Youth Talent' }];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await adminYouthService.list({ search, jenis: jenisFilter || undefined, page });
      setData(resp.data);
      setTotalRecords(resp.meta.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data' });
    } finally {
      setLoading(false);
    }
  }, [search, jenisFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => { setEditItem({}); setShowDialog(true); };
  const openEdit = (item: YouthOpportunity) => { setEditItem({ ...item }); setShowDialog(true); };

  const saveItem = async () => {
    if (!editItem) return;
    try {
      if (editItem.id) {
        await adminYouthService.update(editItem.id, editItem);
        toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data berhasil diperbarui' });
      } else {
        await adminYouthService.create(editItem);
        toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data berhasil ditambahkan' });
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
      await adminYouthService.destroy(id);
      toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data berhasil dihapus' });
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus data' });
    }
  };

  const jenisTemplate = (row: YouthOpportunity) => {
    const colors: Record<string, 'info' | 'success' | 'warning'> = {
      beasiswa: 'info', lowongan_kerja: 'success', magang: 'warning',
    };
    return <Tag value={row.jenis.replace('_', ' ')} severity={colors[row.jenis] || 'info'} className="text-xs" />;
  };

  const actionTemplate = (row: YouthOpportunity) => (
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
          <h2 className="text-2xl font-bold text-800 m-0">Bontang Youth Talent</h2>
          <p className="text-sm text-500 mt-1 mb-0">Kelola peluang pemuda: beasiswa, lowongan kerja & magang</p>
        </div>
        <Button label="Tambah Baru" icon="pi pi-plus" className="border-round-xl" onClick={openNew} />
      </div>

      <Card className="shadow-1 border-round-xl">
        <div className="flex align-items-center gap-3 mb-4 flex-wrap">
          <span className="p-input-icon-left flex-1" style={{ minWidth: '200px' }}>
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari judul, penyelenggara..."
              className="w-full border-round-lg"
            />
          </span>
          <Dropdown
            value={jenisFilter}
            options={JENIS_OPTIONS}
            onChange={(e) => { setJenisFilter(e.value); setPage(1); }}
            className="border-round-lg"
            style={{ minWidth: '180px' }}
          />
        </div>

        <DataTable
          value={data}
          loading={loading}
          paginator
          lazy
          rows={10}
          totalRecords={totalRecords}
          first={(page - 1) * 10}
          onPage={(e) => setPage(Math.floor((e.first ?? 0) / 10) + 1)}
          size="small"
          stripedRows
          responsiveLayout="scroll"
          emptyMessage="Belum ada data"
        >
          <Column field="judul" header="Judul" className="font-medium" />
          <Column field="penyelenggara" header="Penyelenggara" />
          <Column header="Jenis" body={jenisTemplate} alignHeader="center" bodyClassName="text-center" />
          <Column field="lokasi" header="Lokasi" />
          <Column field="batas_pendaftaran" header="Batas Daftar" />
          <Column header="Aksi" body={actionTemplate} style={{ width: '120px' }} />
        </DataTable>
      </Card>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={editItem?.id ? 'Edit Peluang' : 'Tambah Peluang'}
        style={{ width: '600px' }}
        className="border-round-xl"
      >
        <div className="flex flex-column gap-3 mt-2">
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Judul</label>
            <InputText value={editItem?.judul || ''} onChange={(e) => setEditItem({ ...editItem, judul: e.target.value })} className="border-round-lg" />
          </div>
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Jenis</label>
            <Dropdown
              value={editItem?.jenis || ''}
              options={JENIS_OPTIONS.filter(o => o.value)}
              onChange={(e) => setEditItem({ ...editItem, jenis: e.value })}
              className="border-round-lg"
            />
          </div>
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Penyelenggara</label>
            <InputText value={editItem?.penyelenggara || ''} onChange={(e) => setEditItem({ ...editItem, penyelenggara: e.target.value })} className="border-round-lg" />
          </div>
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Lokasi</label>
            <InputText value={editItem?.lokasi || ''} onChange={(e) => setEditItem({ ...editItem, lokasi: e.target.value })} className="border-round-lg" />
          </div>
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Deskripsi</label>
            <InputTextarea value={editItem?.deskripsi || ''} onChange={(e) => setEditItem({ ...editItem, deskripsi: e.target.value })} rows={3} className="border-round-lg" />
          </div>
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Batas Pendaftaran</label>
            <Calendar
              value={editItem?.batas_pendaftaran ? new Date(editItem.batas_pendaftaran) : undefined}
              onChange={(e) => setEditItem({ ...editItem, batas_pendaftaran: e.value ? (e.value as Date).toISOString().split('T')[0] : '' })}
              dateFormat="yy-mm-dd"
              className="border-round-lg"
            />
          </div>
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium text-700">Link Pendaftaran</label>
            <InputText value={editItem?.link_pendaftaran || ''} onChange={(e) => setEditItem({ ...editItem, link_pendaftaran: e.target.value })} className="border-round-lg" />
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

export default YouthOpportunityList;
