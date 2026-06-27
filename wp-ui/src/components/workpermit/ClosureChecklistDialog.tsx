import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { closureChecklistService } from '../../services/gapFeaturesService';

const DEFAULT_CLOSURE_ITEMS = [
  'All work completed as specified',
  'Area cleaned and restored to original condition',
  'All temporary installations removed',
  'All isolation points restored',
  'All tools and equipment accounted for',
  'All workers evacuated from work area',
  'No outstanding safety hazards identified',
  'All required documentation completed',
  'Gas testing confirms safe atmosphere',
  'Fire protection systems restored',
];

interface Props {
  permitId: number;
  personnelId: number;
  visible: boolean;
  onHide: () => void;
  onCompleted?: () => void;
}

export default function ClosureChecklistDialog({ permitId, personnelId, visible, onHide, onCompleted }: Props) {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState(
    DEFAULT_CLOSURE_ITEMS.map(desc => ({ item_description: desc, is_checked: false, checked_by_name: '', remarks: '' }))
  );

  const toggleItem = (index: number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, is_checked: !item.is_checked } : item));
  };

  const allChecked = items.every(i => i.is_checked);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await closureChecklistService.create(permitId, { completed_by: personnelId, remarks, items });
      toast.current?.show({ severity: 'success', summary: 'Saved', detail: 'Closure checklist completed' });
      onCompleted?.();
      onHide();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save closure checklist' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog header="Permit Closure Checklist" visible={visible} onHide={onHide}
        style={{ width: '50rem' }} footer={
          <div className="flex justify-content-between align-items-center">
            <span className={`text-sm font-semibold ${allChecked ? 'text-green-600' : 'text-orange-500'}`}>
              {items.filter(i => i.is_checked).length}/{items.length} items checked
            </span>
            <div className="flex gap-2">
              <Button label="Cancel" severity="secondary" text onClick={onHide} />
              <Button label="Submit Checklist" icon="pi pi-check" severity="success"
                loading={loading} onClick={handleSubmit} />
            </div>
          </div>
        }>
        <DataTable value={items} size="small" stripedRows>
          <Column header="#" body={(_r, opts) => (opts.rowIndex ?? 0) + 1} style={{ width: '5%' }} />
          <Column header="Item" body={(_r, opts) => items[opts.rowIndex ?? 0]?.item_description} style={{ width: '70%' }} />
          <Column header="Checked" style={{ width: '10%' }} body={(_r, opts) => (
            <Checkbox checked={items[opts.rowIndex ?? 0]?.is_checked ?? false}
              onChange={() => toggleItem(opts.rowIndex ?? 0)} />
          )} />
        </DataTable>
        <div className="mt-3">
          <label className="block font-semibold mb-1">Remarks</label>
          <InputTextarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} className="w-full" />
        </div>
      </Dialog>
    </>
  );
}
