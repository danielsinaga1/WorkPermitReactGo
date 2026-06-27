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
import { Dropdown } from 'primereact/dropdown';
import { permitTransferService } from '../../../services/gapFeaturesService';
import type { PermitTransfer, TransferStatus } from '../../../types/workPermitTypes';

const statusSeverity: Record<TransferStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const PermitTransferPage = () => {
  const navigate = useNavigate();
  const { permitId } = useParams<{ permitId: string }>();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<PermitTransfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [showProcess, setShowProcess] = useState<PermitTransfer | null>(null);
  const [saving, setSaving] = useState(false);

  const [fromId, setFromId] = useState<number>(0);
  const [toId, setToId] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [approvedBy, setApprovedBy] = useState<number>(0);
  const [rejectedReason, setRejectedReason] = useState('');

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Work Permits', command: () => navigate('/dashboard/work-permits') },
    { label: `Permit #${permitId}`, command: () => navigate(`/dashboard/work-permits/${permitId}`) },
    { label: 'Transfers' },
  ];

  const loadData = () => {
    if (!permitId) return;
    setLoading(true);
    permitTransferService.list(Number(permitId))
      .then(setData)
      .catch(() => toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load transfers' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [permitId]);

  const handleRequest = async () => {
    if (!permitId || !fromId || !toId || !reason) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Fill all required fields' });
      return;
    }
    setSaving(true);
    try {
      await permitTransferService.request(Number(permitId), {
        from_personnel_id: fromId, to_personnel_id: toId, reason, transfer_notes: notes || undefined,
      });
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Transfer requested' });
      setShowRequest(false);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to request transfer' });
    } finally { setSaving(false); }
  };

  const handleProcess = async () => {
    if (!showProcess || !approvedBy) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Fill all required fields' });
      return;
    }
    setSaving(true);
    try {
      await permitTransferService.process(showProcess.id, {
        decision, approved_by: approvedBy,
        rejected_reason: decision === 'rejected' ? rejectedReason : undefined,
      });
      toast.current?.show({ severity: 'success', summary: 'Success', detail: `Transfer ${decision}` });
      setShowProcess(null);
      loadData();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to process transfer' });
    } finally { setSaving(false); }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="mb-3 border-none p-0" />

      <Card className="shadow-1">
        <div className="flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <h2 className="text-xl font-bold m-0">🔄 Permit Transfers</h2>
          <Button label="Request Transfer" icon="pi pi-arrow-right-arrow-left" size="small" onClick={() => setShowRequest(true)} />
        </div>

        <DataTable value={data} loading={loading} stripedRows size="small"
          paginator rows={10} emptyMessage="No transfers recorded.">
          <Column field="id" header="#" style={{ width: '5%' }} />
          <Column header="From" style={{ width: '18%' }}
            body={(r: PermitTransfer) => r.from_personnel?.name || `#${r.from_personnel_id}`} />
          <Column header="To" style={{ width: '18%' }}
            body={(r: PermitTransfer) => r.to_personnel?.name || `#${r.to_personnel_id}`} />
          <Column field="reason" header="Reason" style={{ width: '25%' }} />
          <Column field="status" header="Status" style={{ width: '12%' }}
            body={(r: PermitTransfer) => <Tag value={r.status.toUpperCase()} severity={statusSeverity[r.status]} />} />
          <Column field="created_at" header="Requested" style={{ width: '14%' }}
            body={(r: PermitTransfer) => new Date(r.created_at).toLocaleDateString()} />
          <Column header="" style={{ width: '8%' }} body={(r: PermitTransfer) => (
            r.status === 'pending' &&
            <Button icon="pi pi-cog" rounded text size="small" tooltip="Process"
              onClick={() => { setShowProcess(r); setDecision('approved'); setRejectedReason(''); }} />
          )} />
        </DataTable>
      </Card>

      {/* Request Transfer Dialog */}
      <Dialog header="Request Permit Transfer" visible={showRequest} onHide={() => setShowRequest(false)}
        style={{ width: '35rem' }} footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" severity="secondary" text onClick={() => setShowRequest(false)} />
            <Button label="Submit" icon="pi pi-check" loading={saving} onClick={handleRequest} />
          </div>
        }>
        <div className="flex flex-column gap-3">
          <div>
            <label className="block font-semibold mb-1">From Personnel ID *</label>
            <InputText type="number" value={String(fromId || '')} className="w-full"
              onChange={e => setFromId(Number(e.target.value))} />
          </div>
          <div>
            <label className="block font-semibold mb-1">To Personnel ID *</label>
            <InputText type="number" value={String(toId || '')} className="w-full"
              onChange={e => setToId(Number(e.target.value))} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Reason *</label>
            <InputTextarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Notes</label>
            <InputTextarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full" />
          </div>
        </div>
      </Dialog>

      {/* Process Transfer Dialog */}
      <Dialog header={`Process Transfer #${showProcess?.id || ''}`}
        visible={!!showProcess} onHide={() => setShowProcess(null)}
        style={{ width: '30rem' }} footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" severity="secondary" text onClick={() => setShowProcess(null)} />
            <Button label={decision === 'approved' ? 'Approve' : 'Reject'}
              icon={decision === 'approved' ? 'pi pi-check' : 'pi pi-times'}
              severity={decision === 'approved' ? 'success' : 'danger'}
              loading={saving} onClick={handleProcess} />
          </div>
        }>
        <div className="flex flex-column gap-3">
          <div>
            <label className="block font-semibold mb-1">Decision *</label>
            <Dropdown value={decision} options={[
              { label: 'Approve', value: 'approved' }, { label: 'Reject', value: 'rejected' },
            ]} onChange={e => setDecision(e.value)} className="w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Approver Personnel ID *</label>
            <InputText type="number" value={String(approvedBy || '')} className="w-full"
              onChange={e => setApprovedBy(Number(e.target.value))} />
          </div>
          {decision === 'rejected' && (
            <div>
              <label className="block font-semibold mb-1">Rejection Reason</label>
              <InputTextarea value={rejectedReason} onChange={e => setRejectedReason(e.target.value)}
                rows={3} className="w-full" />
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default PermitTransferPage;
