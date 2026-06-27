import { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { workAreaService } from '../../../services/workPermitService';
import type { WorkArea, ZoneType } from '../../../types/workPermitTypes';

const zoneOptions: { label: string; value: ZoneType }[] = [
  { label: 'General', value: 'general' },
  { label: 'Hazardous', value: 'hazardous' },
  { label: 'Confined Space', value: 'confined' },
  { label: 'Elevated', value: 'elevated' },
];

const zoneSeverity: Record<ZoneType, 'success' | 'warning' | 'danger' | 'info'> = {
  general: 'success',
  hazardous: 'danger',
  confined: 'warning',
  elevated: 'info',
};

const emptyForm = {
  code: '',
  name: '',
  description: '',
  zone_type: 'general' as ZoneType,
  plant_unit: '',
  radius_meters: 100,
  latitude: null as number | null,
  longitude: null as number | null,
  is_active: true,
};

const WorkAreaList = () => {
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<WorkArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WorkArea | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await workAreaService.list({ search: search || undefined, zone_type: zoneFilter || undefined, page, per_page: 15 });
      setData(resp.data);
      setTotalRecords(resp.total);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat work area' });
    } finally {
      setLoading(false);
    }
  }, [search, zoneFilter, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowDialog(true);
  };

  const openEdit = (row: WorkArea) => {
    setEditingId(row.id);
    setForm({
      code: row.code,
      name: row.name,
      description: row.description || '',
      zone_type: row.zone_type,
      plant_unit: row.plant_unit || '',
      radius_meters: row.radius_meters,
      latitude: row.latitude ?? null,
      longitude: row.longitude ?? null,
      is_active: row.is_active,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.name) {
      toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Kode dan nama wajib diisi' });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await workAreaService.update(editingId, form);
        toast.current?.show({ severity: 'success', summary: 'Diperbarui', detail: 'Work area diperbarui' });
      } else {
        await workAreaService.create(form);
        toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Work area berhasil dibuat' });
      }
      setShowDialog(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menyimpan' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await workAreaService.remove(deleteTarget.id);
      toast.current?.show({ severity: 'success', summary: 'Dihapus', detail: `${deleteTarget.name} dihapus` });
      setDeleteTarget(null);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="Work Area Management"
        subtitle="Kelola area kerja, zona bahaya, koordinat GPS, dan radius geofence untuk permit tracking"
        icon="pi pi-map-marker"
        accentGradient="linear-gradient(135deg, #22c55e, #16a34a)"
        actions={
          <Button
            label="Tambah Work Area"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={openCreate}
          />
        }
      />

      <TableCard>
        <FilterBar>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari kode atau nama…" className="w-15rem" />
          </span>
          <Dropdown value={zoneFilter} options={[{ label: 'Semua Zona', value: '' }, ...zoneOptions]} onChange={(e) => { setZoneFilter(e.value); setPage(1); }} placeholder="Tipe Zona" className="w-12rem" />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadData} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={data} loading={loading} lazy paginator rows={15} totalRecords={totalRecords}
            first={(page - 1) * 15} onPage={(e) => setPage((e.first ?? 0) / 15 + 1)}
            stripedRows size="small" emptyMessage="Belum ada work area."
            style={{ border: 'none' }}
          >
            <Column field="code" header="Kode" sortable style={{ width: '10%', fontFamily: 'monospace', fontSize: 12 }} />
            <Column field="name" header="Nama" sortable style={{ width: '22%' }} />
            <Column field="zone_type" header="Tipe Zona" body={(r) => (
              <Tag value={r.zone_type.replace('_', ' ').toUpperCase()} severity={zoneSeverity[r.zone_type as ZoneType] || 'info'} />
            )} style={{ width: '13%' }} />
            <Column field="plant_unit" header="Plant Unit" style={{ width: '14%' }} />
            <Column field="radius_meters" header="Radius (m)" style={{ width: '10%' }} />
            <Column field="is_active" header="Aktif" body={(r) => (
              <Tag value={r.is_active ? 'Ya' : 'Tidak'} severity={r.is_active ? 'success' : 'danger'} />
            )} style={{ width: '8%' }} />
            <Column header="" body={(row: WorkArea) => (
              <div style={{ display: 'flex', gap: 4 }}>
                <Button icon="pi pi-pencil" severity="info" text size="small" onClick={() => openEdit(row)} tooltip="Edit" />
                <Button icon="pi pi-trash" severity="danger" text size="small" onClick={() => setDeleteTarget(row)} tooltip="Hapus" />
              </div>
            )} style={{ width: '10%' }} />
          </DataTable>
        </div>
      </TableCard>

      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-map-marker" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>{editingId ? 'Edit Work Area' : 'Tambah Work Area'}</span>
          </div>
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '40rem' }}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowDialog(false)} />
            <Button label="Simpan" icon="pi pi-check" onClick={handleSave} loading={saving} />
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Kode *</label>
              <InputText value={form.code} onChange={(e) => setForm(p => ({ ...p, code: e.target.value }))} className="w-full" placeholder="mis. WA-001" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Tipe Zona *</label>
              <Dropdown value={form.zone_type} options={zoneOptions} onChange={(e) => setForm(p => ({ ...p, zone_type: e.value }))} className="w-full" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Nama *</label>
            <InputText value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Deskripsi</label>
            <InputTextarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} className="w-full" rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Plant Unit</label>
              <InputText value={form.plant_unit} onChange={(e) => setForm(p => ({ ...p, plant_unit: e.target.value }))} className="w-full" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Radius (meter)</label>
              <InputNumber value={form.radius_meters} onValueChange={(e) => setForm(p => ({ ...p, radius_meters: e.value || 100 }))} className="w-full" min={1} max={10000} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Latitude</label>
              <InputNumber value={form.latitude} onValueChange={(e) => setForm(p => ({ ...p, latitude: e.value ?? null }))} className="w-full" minFractionDigits={6} maxFractionDigits={8} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Longitude</label>
              <InputNumber value={form.longitude} onValueChange={(e) => setForm(p => ({ ...p, longitude: e.value ?? null }))} className="w-full" minFractionDigits={6} maxFractionDigits={8} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <InputSwitch checked={form.is_active} onChange={(e) => setForm(p => ({ ...p, is_active: e.value ?? true }))} />
            <label style={{ fontWeight: 600, fontSize: 13 }}>Aktif</label>
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Konfirmasi Hapus"
        visible={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        style={{ width: '26rem' }}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setDeleteTarget(null)} />
            <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={handleDelete} />
          </div>
        }
      >
        <p style={{ margin: 0, fontSize: 14 }}>Yakin ingin menghapus <strong>{deleteTarget?.name}</strong>?</p>
        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b' }}>Tindakan ini tidak dapat dibatalkan. Permit aktif di area ini akan terpengaruh.</p>
      </Dialog>
    </div>
  );
};

export default WorkAreaList;
