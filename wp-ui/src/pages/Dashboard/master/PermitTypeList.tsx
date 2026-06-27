import { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { ColorPicker } from 'primereact/colorpicker';
import { Chips } from 'primereact/chips';
import { PageHeader, TableCard, FilterBar } from '../../../components/ui';
import { permitTypeService } from '../../../services/workPermitService';
import type { PermitType } from '../../../types/workPermitTypes';

const emptyForm = {
  code: '',
  name: '',
  description: '',
  max_duration_hours: 8,
  color_code: '#3B82F6',
  icon: '',
  required_qualifications: [] as string[],
  required_equipment_certs: [] as string[],
  is_active: true,
};

const PermitTypeList = () => {
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<PermitType[]>([]);
  const [filteredData, setFilteredData] = useState<PermitType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PermitType | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await permitTypeService.list();
      setData(result);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat tipe permit' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!search) {
      setFilteredData(data);
    } else {
      const q = search.toLowerCase();
      setFilteredData(data.filter(pt => pt.code.toLowerCase().includes(q) || pt.name.toLowerCase().includes(q)));
    }
  }, [data, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowDialog(true);
  };

  const openEdit = (row: PermitType) => {
    setEditingId(row.id);
    setForm({
      code: row.code,
      name: row.name,
      description: row.description || '',
      max_duration_hours: row.max_duration_hours,
      color_code: row.color_code || '#3B82F6',
      icon: row.icon || '',
      required_qualifications: row.required_qualifications || [],
      required_equipment_certs: row.required_equipment_certs || [],
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
        await permitTypeService.update(editingId, form);
        toast.current?.show({ severity: 'success', summary: 'Diperbarui', detail: 'Tipe permit diperbarui' });
      } else {
        await permitTypeService.create(form);
        toast.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Tipe permit berhasil dibuat' });
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
      await permitTypeService.remove(deleteTarget.id);
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
        title="Permit Type Management"
        subtitle="Konfigurasi jenis permit kerja, durasi maksimum, warna identifikasi, dan persyaratan kualifikasi"
        icon="pi pi-file-edit"
        accentGradient="linear-gradient(135deg, #f97316, #ea580c)"
        actions={
          <Button
            label="Tambah Tipe Permit"
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
            <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kode atau nama…" className="w-15rem" />
          </span>
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadData} loading={loading} tooltip="Refresh" />
        </FilterBar>

        <div style={{ padding: '0 4px' }}>
          <DataTable
            value={filteredData} loading={loading} stripedRows size="small" emptyMessage="Belum ada tipe permit."
            paginator rows={10}
            style={{ border: 'none' }}
          >
            <Column field="code" header="Kode" sortable style={{ width: '12%' }} body={(r) => (
              <Tag value={r.code} style={{ backgroundColor: r.color_code, color: '#fff' }} />
            )} />
            <Column field="name" header="Nama" sortable style={{ width: '20%' }} />
            <Column field="description" header="Deskripsi" style={{ width: '22%' }} body={(r) => <span style={{ fontSize: 12, color: '#334155' }}>{r.description || '—'}</span>} />
            <Column header="Warna" style={{ width: '10%' }} body={(r) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: r.color_code, border: '1px solid #e2e8f0' }} />
                <span style={{ fontSize: 11, fontFamily: 'monospace' }}>{r.color_code}</span>
              </div>
            )} />
            <Column field="max_duration_hours" header="Maks. Durasi (jam)" sortable style={{ width: '13%' }} />
            <Column field="is_active" header="Aktif" body={(r) => (
              <Tag value={r.is_active ? 'Ya' : 'Tidak'} severity={r.is_active ? 'success' : 'danger'} />
            )} style={{ width: '8%' }} />
            <Column header="" body={(row: PermitType) => (
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
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="pi pi-file-edit" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span>{editingId ? 'Edit Tipe Permit' : 'Tambah Tipe Permit'}</span>
          </div>
        }
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '42rem' }}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button label="Batal" severity="secondary" text onClick={() => setShowDialog(false)} />
            <Button label="Simpan" icon="pi pi-check" onClick={handleSave} loading={saving} />
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Kode *</label>
              <InputText value={form.code} onChange={(e) => setForm(p => ({ ...p, code: e.target.value }))} className="w-full" placeholder="mis. HOT_WORK" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Nama *</label>
              <InputText value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="w-full" placeholder="mis. Hot Work Permit" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Deskripsi</label>
            <InputTextarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} className="w-full" rows={2} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Maks. Durasi (jam)</label>
              <InputNumber value={form.max_duration_hours} onValueChange={(e) => setForm(p => ({ ...p, max_duration_hours: e.value || 8 }))} className="w-full" min={1} max={720} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Kode Warna</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ColorPicker value={form.color_code.replace('#', '')} onChange={(e) => setForm(p => ({ ...p, color_code: `#${e.value}` }))} />
                <InputText value={form.color_code} onChange={(e) => setForm(p => ({ ...p, color_code: e.target.value }))} style={{ width: '7rem' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Icon (PrimeIcon)</label>
              <InputText value={form.icon} onChange={(e) => setForm(p => ({ ...p, icon: e.target.value }))} className="w-full" placeholder="pi pi-fire" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Kualifikasi Yang Diperlukan</label>
            <Chips value={form.required_qualifications} onChange={(e) => setForm(p => ({ ...p, required_qualifications: e.value || [] }))} className="w-full" placeholder="Ketik dan tekan Enter" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Sertifikasi Peralatan Yang Diperlukan</label>
            <Chips value={form.required_equipment_certs} onChange={(e) => setForm(p => ({ ...p, required_equipment_certs: e.value || [] }))} className="w-full" placeholder="Ketik dan tekan Enter" />
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
        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b' }}>Permit yang sudah menggunakan tipe ini akan terpengaruh.</p>
      </Dialog>
    </div>
  );
};

export default PermitTypeList;
