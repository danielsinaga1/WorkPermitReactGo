import { useState, useRef, useCallback } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { gasTestService } from '../../services/extendedHseService';
import { GAS_SAFE_LIMITS } from '../../types/workPermitTypes';
import type { GasTestLog, CreateGasTestPayload } from '../../types/workPermitTypes';

interface Props {
  permitId: number;
  gasTests: GasTestLog[];
  onTestRecorded: () => void;
  readOnly?: boolean;
}

const emptyPayload: CreateGasTestPayload = {
  tested_by_name: '',
  o2_level: 20.9,
  lel_level: 0,
  h2s_level: 0,
  co_level: 0,
};

export default function GasTestForm({ permitId, gasTests, onTestRecorded, readOnly = false }: Props) {
  const toast = useRef<Toast>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateGasTestPayload>({ ...emptyPayload });

  const handleSubmit = useCallback(async () => {
    if (!form.tested_by_name.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Tester name required' });
      return;
    }
    setLoading(true);
    try {
      await gasTestService.create(permitId, form);
      toast.current?.show({ severity: 'success', summary: 'Recorded', detail: 'Gas test saved' });
      setShowDialog(false);
      setForm({ ...emptyPayload });
      onTestRecorded();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to record gas test' });
    } finally {
      setLoading(false);
    }
  }, [form, permitId, onTestRecorded]);

  const isSafe = (row: GasTestLog) => row.is_safe;

  const safetyTemplate = (row: GasTestLog) => (
    <Tag severity={isSafe(row) ? 'success' : 'danger'} value={isSafe(row) ? 'SAFE' : 'UNSAFE'} />
  );

  const levelTag = (value: number, min: number | null, max: number) => {
    const ok = min !== null ? value >= min && value <= max : value <= max;
    return <Tag severity={ok ? 'success' : 'danger'} value={value.toFixed(1)} />;
  };

  return (
    <>
      <Toast ref={toast} />
      <Card title="Gas Test Log" subTitle="Confined Space — Atmospheric Monitoring"
        className="mb-4" data-testid="gas-test-card">
        <div className="flex justify-end mb-3">
          {!readOnly && (
            <Button label="Record Test" icon="pi pi-plus" onClick={() => setShowDialog(true)}
              data-testid="btn-record-gas-test" />
          )}
        </div>

        <DataTable value={gasTests} emptyMessage="No gas tests recorded" data-testid="gas-test-table"
          size="small" stripedRows paginator rows={10}>
          <Column field="tested_at" header="Date/Time" body={(r: GasTestLog) => new Date(r.tested_at).toLocaleString()} />
          <Column field="tested_by_name" header="Tester" />
          <Column header="O₂ %" body={(r: GasTestLog) => levelTag(r.o2_level, GAS_SAFE_LIMITS.O2_MIN, GAS_SAFE_LIMITS.O2_MAX)} />
          <Column header="LEL %" body={(r: GasTestLog) => levelTag(r.lel_level, null, GAS_SAFE_LIMITS.LEL_MAX)} />
          <Column header="H₂S ppm" body={(r: GasTestLog) => levelTag(r.h2s_level, null, GAS_SAFE_LIMITS.H2S_MAX)} />
          <Column header="CO ppm" body={(r: GasTestLog) => levelTag(r.co_level, null, GAS_SAFE_LIMITS.CO_MAX)} />
          <Column header="Status" body={safetyTemplate} />
        </DataTable>
      </Card>

      <Dialog header="Record Gas Test" visible={showDialog} onHide={() => setShowDialog(false)}
        style={{ width: '480px' }} data-testid="gas-test-dialog">
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <label className="block mb-1 font-semibold">Tester Name *</label>
            <input className="p-inputtext p-component w-full" data-testid="input-tester-name"
              value={form.tested_by_name}
              onChange={(e) => setForm({ ...form, tested_by_name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">O₂ Level (%)</label>
              <InputNumber value={form.o2_level} onValueChange={(e) => setForm({ ...form, o2_level: e.value ?? 0 })}
                minFractionDigits={1} maxFractionDigits={1} min={0} max={100} data-testid="input-o2" />
            </div>
            <div>
              <label className="block mb-1">LEL Level (%)</label>
              <InputNumber value={form.lel_level} onValueChange={(e) => setForm({ ...form, lel_level: e.value ?? 0 })}
                minFractionDigits={1} maxFractionDigits={1} min={0} max={100} data-testid="input-lel" />
            </div>
            <div>
              <label className="block mb-1">H₂S Level (ppm)</label>
              <InputNumber value={form.h2s_level} onValueChange={(e) => setForm({ ...form, h2s_level: e.value ?? 0 })}
                minFractionDigits={1} maxFractionDigits={1} min={0} data-testid="input-h2s" />
            </div>
            <div>
              <label className="block mb-1">CO Level (ppm)</label>
              <InputNumber value={form.co_level} onValueChange={(e) => setForm({ ...form, co_level: e.value ?? 0 })}
                minFractionDigits={1} maxFractionDigits={1} min={0} data-testid="input-co" />
            </div>
          </div>
          <div>
            <label className="block mb-1">Notes</label>
            <InputTextarea value={form.remarks ?? ''} onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              rows={2} className="w-full" data-testid="input-notes" />
          </div>

          {/* Live safety preview */}
          <div className="border rounded p-3 bg-gray-50" data-testid="safety-preview">
            <span className="font-semibold mr-2">Safety Preview:</span>
            {form.o2_level >= GAS_SAFE_LIMITS.O2_MIN && form.o2_level <= GAS_SAFE_LIMITS.O2_MAX &&
             form.lel_level <= GAS_SAFE_LIMITS.LEL_MAX &&
             form.h2s_level <= GAS_SAFE_LIMITS.H2S_MAX &&
             form.co_level <= GAS_SAFE_LIMITS.CO_MAX
              ? <Tag severity="success" value="SAFE" />
              : <Tag severity="danger" value="UNSAFE — Entry Prohibited" />
            }
          </div>

          <div className="flex justify-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setShowDialog(false)} />
            <Button label="Save Test" icon="pi pi-check" loading={loading}
              onClick={handleSubmit} data-testid="btn-save-gas-test" />
          </div>
        </div>
      </Dialog>
    </>
  );
}
