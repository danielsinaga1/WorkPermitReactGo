import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { PageHeader, TableCard } from '../../../components/ui';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { formFieldConfigService } from '../../../services/gapFeaturesService';
import type { FormFieldConfig, CreateFieldConfigPayload, FieldType } from '../../../types/workPermitTypes';

const fieldTypeOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
  { label: 'Select', value: 'select' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Radio', value: 'radio' },
  { label: 'File', value: 'file' },
  { label: 'Signature', value: 'signature' },
];

const FormFieldBuilder = () => {
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<FormFieldConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editTarget, setEditTarget] = useState<FormFieldConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterPermitType, setFilterPermitType] = useState<number | undefined>(undefined);

  const emptyForm: CreateFieldConfigPayload = {
    permit_type_id: 0, section: '', field_name: '', field_label: '',
    field_type: 'text', is_mandatory: false, is_active: true, sort_order: 0,
    options: [], instruction: '', tooltip: '',
  };
  const [form, setForm] = useState<CreateFieldConfigPayload>(emptyForm);

  const loadData = () => {
    setLoading(true);
    const params: Record<string, unknown> = {};
    if (filterPermitType) params.permit_type_id = filterPermitType;
    formFieldConfigService.list(params as Parameters<typeof formFieldConfigService.list>[0])
      .then(setData)
      .catch(() => toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load field configs' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [filterPermitType]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setShowEditor(true);
  };

  const openEdit = (item: FormFieldConfig) => {
    setEditTarget(item);
    setForm({
      permit_type_id: item.permit_type_id,
      section: item.section,
      field_name: item.field_name,
      field_label: item.field_label,
      field_type: item.field_type,
      is_mandatory: item.is_mandatory,
      is_active: item.is_active,
      sort_order: item.sort_order,
      options: item.options || [],
      instruction: item.instruction || '',
      tooltip: item.tooltip || '',
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!form.permit_type_id || !form.field_name || !form.field_label) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Permit type, field name, and label required' });
      return;
    }
    setSaving(true);
    try {
      if (editTarget) {
        await formFieldConfigService.update(editTarget.id, form);
      } else {
        await formFieldConfigService.create(form);
      }
      toast.current?.show({ severity: 'success', summary: 'Saved' });
      setShowEditor(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: FormFieldConfig) => {
    if (!confirm(`Delete field "${item.field_label}"?`)) return;
    try {
      await formFieldConfigService.remove(item.id);
      toast.current?.show({ severity: 'success', summary: 'Deleted' });
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title="No-Code Form Builder"
        subtitle="Konfigurasi field formulir permit kerja secara dinamis tanpa perlu mengubah kode"
        icon="pi pi-sliders-h"
        accentGradient="linear-gradient(135deg, #7c3aed, #6d28d9)"
        actions={
          <Button
            label="Tambah Field"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={openCreate}
          />
        }
      />

      <TableCard>
        <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Filter by Permit Type ID</label>
          <InputNumber value={filterPermitType ?? null} onValueChange={e => setFilterPermitType(e.value ?? undefined)} placeholder="Semua" style={{ width: '8rem' }} />
          <Button icon="pi pi-refresh" text rounded severity="secondary" onClick={loadData} loading={loading} tooltip="Refresh" />
        </div>
        <div style={{ padding: '0 4px' }}>
          <DataTable value={data} loading={loading} stripedRows size="small"
            paginator rows={20} emptyMessage="Belum ada konfigurasi field."
            style={{ border: 'none' }}>
            <Column field="sort_order" header="#" sortable style={{ width: '5%' }} />
            <Column field="section" header="Section" style={{ width: '12%' }}
              body={(r: FormFieldConfig) => <Tag value={r.section} />} />
            <Column field="field_label" header="Label" style={{ width: '18%' }}
              body={(r: FormFieldConfig) => <span style={{ fontWeight: 600, fontSize: 13 }}>{r.field_label}</span>} />
            <Column field="field_name" header="Name" style={{ width: '12%' }}
              body={(r: FormFieldConfig) => <code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{r.field_name}</code>} />
            <Column field="field_type" header="Type" style={{ width: '9%' }}
              body={(r: FormFieldConfig) => <Tag value={r.field_type} severity="info" />} />
            <Column header="Wajib" style={{ width: '8%' }}
              body={(r: FormFieldConfig) => r.is_mandatory ? <Tag value="Ya" severity="danger" /> : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>} />
            <Column header="Status" style={{ width: '9%' }}
              body={(r: FormFieldConfig) => <Tag value={r.is_active ? 'Aktif' : 'Nonaktif'} severity={r.is_active ? 'success' : 'secondary'} />} />
            <Column field="permit_type_id" header="Tipe Permit" style={{ width: '12%' }}
              body={(r: FormFieldConfig) => r.permit_type?.name || `#${r.permit_type_id}`} />
            <Column header="" style={{ width: '10%' }} body={(r: FormFieldConfig) => (
              <div style={{ display: 'flex', gap: 4 }}>
                <Button icon="pi pi-pencil" rounded text size="small" onClick={() => openEdit(r)} />
                <Button icon="pi pi-trash" rounded text size="small" severity="danger" onClick={() => handleDelete(r)} />
              </div>
            )} />
          </DataTable>
        </div>
      </TableCard>

      {/* Editor Dialog */}
      <Dialog header={editTarget ? 'Edit Field' : 'Add Field'} visible={showEditor}
        onHide={() => setShowEditor(false)} style={{ width: '40rem' }} footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" severity="secondary" text onClick={() => setShowEditor(false)} />
            <Button label="Save" icon="pi pi-check" loading={saving} onClick={handleSave} />
          </div>
        }>
        <div className="flex flex-column gap-3">
          <div className="grid">
            <div className="col-6">
              <label className="block font-semibold mb-1">Permit Type ID *</label>
              <InputNumber value={form.permit_type_id || null}
                onValueChange={e => setForm(f => ({ ...f, permit_type_id: e.value ?? 0 }))} className="w-full" />
            </div>
            <div className="col-6">
              <label className="block font-semibold mb-1">Section *</label>
              <InputText value={form.section} className="w-full"
                onChange={e => setForm(f => ({ ...f, section: e.target.value }))} />
            </div>
          </div>
          <div className="grid">
            <div className="col-6">
              <label className="block font-semibold mb-1">Field Name *</label>
              <InputText value={form.field_name} className="w-full"
                onChange={e => setForm(f => ({ ...f, field_name: e.target.value }))} />
            </div>
            <div className="col-6">
              <label className="block font-semibold mb-1">Field Label *</label>
              <InputText value={form.field_label} className="w-full"
                onChange={e => setForm(f => ({ ...f, field_label: e.target.value }))} />
            </div>
          </div>
          <div className="grid">
            <div className="col-6">
              <label className="block font-semibold mb-1">Field Type</label>
              <Dropdown value={form.field_type} options={fieldTypeOptions}
                onChange={e => setForm(f => ({ ...f, field_type: e.value as FieldType }))} className="w-full" />
            </div>
            <div className="col-6">
              <label className="block font-semibold mb-1">Sort Order</label>
              <InputNumber value={form.sort_order ?? 0}
                onValueChange={e => setForm(f => ({ ...f, sort_order: e.value ?? 0 }))} className="w-full" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex align-items-center gap-2">
              <Checkbox checked={form.is_mandatory ?? false}
                onChange={e => setForm(f => ({ ...f, is_mandatory: !!e.checked }))} />
              <label>Mandatory</label>
            </div>
            <div className="flex align-items-center gap-2">
              <Checkbox checked={form.is_active ?? true}
                onChange={e => setForm(f => ({ ...f, is_active: !!e.checked }))} />
              <label>Active</label>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Instruction</label>
            <InputTextarea value={form.instruction || ''} rows={2} className="w-full"
              onChange={e => setForm(f => ({ ...f, instruction: e.target.value }))} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tooltip</label>
            <InputText value={form.tooltip || ''} className="w-full"
              onChange={e => setForm(f => ({ ...f, tooltip: e.target.value }))} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default FormFieldBuilder;
