import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { PageHeader, TableCard } from '../../../components/ui';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { ppeChecklistService } from '../../../services/gapFeaturesService';
import type { PpeChecklist, PpeChecklistItem, CreatePpeChecklistPayload } from '../../../types/workPermitTypes';

const DEFAULT_PPE_ITEMS = [
  'Safety Helmet', 'Safety Glasses', 'Safety Boots', 'High-Vis Vest',
  'Gloves', 'Ear Protection', 'Face Shield', 'Respirator/Mask',
  'Fall Protection Harness', 'Fire Retardant Clothing',
];

const PpeChecklistPage = () => {
  const { permitId } = useParams<{ permitId: string }>();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<PpeChecklist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [detailTarget, setDetailTarget] = useState<PpeChecklist | null>(null);
  const [saving, setSaving] = useState(false);

  const [checkedBy, setCheckedBy] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState(
    DEFAULT_PPE_ITEMS.map(name => ({
      ppe_item: name,
      is_required: true,
      is_available: false,
      is_condition_ok: false,
      remarks: '',
    }))
  );

  const loadData = () => {
    if (!permitId) return;
    setLoading(true);
    ppeChecklistService.list(Number(permitId))
      .then(setData)
      .catch(() => toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load PPE checklists' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [permitId]);

  const toggleItem = (index: number, field: 'is_required' | 'is_available' | 'is_condition_ok') => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: !item[field] } : item));
  };

  const handleSubmit = async () => {
    if (!permitId || !checkedBy) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Please fill in all required fields' });
      return;
    }
    setSaving(true);
    try {
      const payload: CreatePpeChecklistPayload = { checked_by: checkedBy, remarks, items };
      await ppeChecklistService.create(Number(permitId), payload);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'PPE Checklist saved' });
      setShowCreate(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save PPE checklist' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast ref={toast} />

      <PageHeader
        title={`PPE Checklists — Permit #${permitId}`}
        subtitle="Rekam pemeriksaan alat pelindung diri sebelum pekerjaan dimulai untuk memastikan keselamatan pekerja"
        icon="pi pi-shield"
        accentGradient="linear-gradient(135deg, #10b981, #059669)"
        actions={
          <Button
            label="PPE Check Baru"
            icon="pi pi-plus"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={() => setShowCreate(true)}
          />
        }
      />

      <TableCard>
        <div style={{ padding: '0 4px' }}>
          <DataTable value={data} loading={loading} stripedRows size="small"
            paginator rows={10} emptyMessage="Belum ada PPE checklist."
            style={{ border: 'none' }}>
            <Column field="id" header="#" style={{ width: '5%' }} />
            <Column field="checked_at" header="Waktu Pemeriksaan" style={{ width: '20%' }}
              body={(r: PpeChecklist) => new Date(r.checked_at).toLocaleString('id-ID')} />
            <Column field="checker" header="Diperiksa Oleh" style={{ width: '22%' }}
              body={(r: PpeChecklist) => r.checker?.name || `Personnel #${r.checked_by}`} />
            <Column header="Jumlah Item" style={{ width: '12%' }}
              body={(r: PpeChecklist) => (
                <span style={{ background: '#ede9fe', color: '#5b21b6', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
                  {(r.items || []).length} item
                </span>
              )} />
            <Column field="overall_compliance" header="Kepatuhan" style={{ width: '15%' }}
              body={(r: PpeChecklist) => (
                <Tag value={r.overall_compliance ? 'Compliant' : 'Non-Compliant'}
                  severity={r.overall_compliance ? 'success' : 'danger'} />
              )} />
            <Column header="" style={{ width: '8%' }} body={(r: PpeChecklist) => (
              <Button icon="pi pi-eye" rounded text size="small" tooltip="Lihat Detail"
                onClick={() => setDetailTarget(r)} />
            )} />
          </DataTable>
        </div>
      </TableCard>

      {/* Create Dialog */}
      <Dialog header="New PPE Checklist" visible={showCreate} onHide={() => setShowCreate(false)}
        style={{ width: '60rem' }} footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" severity="secondary" text onClick={() => setShowCreate(false)} />
            <Button label="Save" icon="pi pi-check" loading={saving} onClick={handleSubmit} />
          </div>
        }>
        <div className="flex flex-column gap-3">
          <div>
            <label className="block font-semibold mb-1">Checked By (Personnel ID) *</label>
            <InputText type="number" value={String(checkedBy || '')} className="w-full"
              onChange={e => setCheckedBy(Number(e.target.value))} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Remarks</label>
            <InputTextarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} className="w-full" />
          </div>

          <DataTable value={items} size="small" stripedRows>
            <Column field="ppe_item" header="PPE Item" style={{ width: '30%' }} />
            <Column header="Required" style={{ width: '12%' }} body={(_r: typeof items[0], opts: { rowIndex: number }) => (
              <Checkbox checked={items[opts.rowIndex].is_required}
                onChange={() => toggleItem(opts.rowIndex, 'is_required')} />
            )} />
            <Column header="Available" style={{ width: '12%' }} body={(_r: typeof items[0], opts: { rowIndex: number }) => (
              <Checkbox checked={items[opts.rowIndex].is_available}
                onChange={() => toggleItem(opts.rowIndex, 'is_available')} />
            )} />
            <Column header="Condition OK" style={{ width: '12%' }} body={(_r: typeof items[0], opts: { rowIndex: number }) => (
              <Checkbox checked={items[opts.rowIndex].is_condition_ok}
                onChange={() => toggleItem(opts.rowIndex, 'is_condition_ok')} />
            )} />
          </DataTable>
        </div>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog header={`PPE Checklist #${detailTarget?.id || ''}`}
        visible={!!detailTarget} onHide={() => setDetailTarget(null)}
        style={{ width: '50rem' }}>
        {detailTarget && (
          <>
            <div className="mb-3">
              <Tag value={detailTarget.overall_compliance ? 'Compliant' : 'Non-Compliant'}
                severity={detailTarget.overall_compliance ? 'success' : 'danger'} className="mr-2" />
              <span className="text-gray-600">Checked: {new Date(detailTarget.checked_at).toLocaleString()}</span>
            </div>
            <DataTable value={detailTarget.items || []} size="small" stripedRows
              emptyMessage="No items.">
              <Column field="ppe_item" header="PPE Item" />
              <Column header="Required" body={(r: PpeChecklistItem) => r.is_required ? '✅' : '—'} style={{ width: '10%' }} />
              <Column header="Available" body={(r: PpeChecklistItem) => r.is_available ? '✅' : '❌'} style={{ width: '10%' }} />
              <Column header="Condition" body={(r: PpeChecklistItem) => r.is_condition_ok ? '✅' : '❌'} style={{ width: '10%' }} />
              <Column field="remarks" header="Remarks" />
            </DataTable>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default PpeChecklistPage;
