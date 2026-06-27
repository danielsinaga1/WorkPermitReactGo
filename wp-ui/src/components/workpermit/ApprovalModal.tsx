import { useState, useRef, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import ESignatureCanvas from './ESignatureCanvas';
import GeofenceValidator from './GeofenceValidator';
import type { WorkPermit, GeofenceValidationResult } from '../../types/workPermitTypes';
import { permitWorkflowV2 } from '../../services/extendedHseService';

interface Props {
  permit: WorkPermit;
  currentUser: string;
  onPermitUpdated: () => void;
}

type ApprovalAction = 'approved' | 'rejected' | 'returned';

const ACTIONS: { label: string; value: ApprovalAction; severity: 'success' | 'danger' | 'warning' }[] = [
  { label: 'Approve', value: 'approved', severity: 'success' },
  { label: 'Reject', value: 'rejected', severity: 'danger' },
  { label: 'Return for Revision', value: 'returned', severity: 'warning' },
];

export default function ApprovalModal({ permit, currentUser, onPermitUpdated }: Props) {
  const toast = useRef<Toast>(null);
  const [showApproval, setShowApproval] = useState(false);
  const [showESign, setShowESign] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [action, setAction] = useState<ApprovalAction>('approved');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [geofenceResult, setGeofenceResult] = useState<GeofenceValidationResult | null>(null);

  // ─── Submit (V2 — full validation) ───
  const handleSubmitV2 = useCallback(async () => {
    setLoading(true);
    try {
      await permitWorkflowV2.submit(permit.id);
      toast.current?.show({ severity: 'success', summary: 'Submitted', detail: 'Permit submitted with full validation' });
      onPermitUpdated();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Submission failed';
      toast.current?.show({ severity: 'error', summary: 'Validation Error', detail });
    } finally {
      setLoading(false);
    }
  }, [permit.id, onPermitUpdated]);

  // ─── Activate (V2 — geofence) ───
  const handleActivate = useCallback(async () => {
    setLoading(true);
    try {
      await permitWorkflowV2.activate(
        permit.id,
        geofenceResult ? undefined : undefined // geofence is handled at the server
      );
      toast.current?.show({ severity: 'success', summary: 'Activated', detail: 'Permit is now active' });
      setShowActivate(false);
      onPermitUpdated();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Activation failed';
      toast.current?.show({ severity: 'error', summary: 'Error', detail });
    } finally {
      setLoading(false);
    }
  }, [permit.id, geofenceResult, onPermitUpdated]);

  // ─── Close (V2 — photo evidence) ───
  const handleClose = useCallback(async () => {
    setLoading(true);
    try {
      await permitWorkflowV2.close(permit.id, currentUser, remarks);
      toast.current?.show({ severity: 'success', summary: 'Closed', detail: 'Permit closed' });
      setShowClose(false);
      onPermitUpdated();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Close failed';
      toast.current?.show({ severity: 'error', summary: 'Error', detail });
    } finally {
      setLoading(false);
    }
  }, [permit.id, currentUser, remarks, onPermitUpdated]);

  const permitColor = permit.permit_type?.color_code === 'RED'
    ? 'bg-red-100 border-red-500'
    : permit.permit_type?.color_code === 'BLUE'
    ? 'bg-blue-100 border-blue-500'
    : 'bg-green-100 border-green-500';

  return (
    <>
      <Toast ref={toast} />

      <Card className={`border-l-4 ${permitColor} mb-4`} data-testid="approval-panel">
        <h3 className="text-lg font-bold mb-3">Permit Actions — {permit.permit_number}</h3>
        <div className="flex flex-wrap gap-2">
          {permit.status === 'draft' && (
            <Button label="Submit (Full Validation)" icon="pi pi-send" loading={loading}
              onClick={handleSubmitV2} data-testid="btn-submit-permit" />
          )}
          {permit.status === 'pending_approval' && (
            <Button label="Review & Sign" icon="pi pi-pencil"
              onClick={() => setShowApproval(true)} data-testid="btn-review" />
          )}
          {permit.status === 'approved' && (
            <Button label="Activate" icon="pi pi-play" severity="success"
              onClick={() => setShowActivate(true)} data-testid="btn-activate" />
          )}
          {permit.status === 'active' && (
            <Button label="Close Permit" icon="pi pi-times-circle" severity="warning"
              onClick={() => setShowClose(true)} data-testid="btn-close" />
          )}
        </div>
      </Card>

      {/* Approval Dialog (with e-sign) */}
      <Dialog header="Permit Approval Review" visible={showApproval}
        onHide={() => setShowApproval(false)} style={{ width: '500px' }} data-testid="approval-dialog">
        <div className="flex flex-col gap-3">
          <Dropdown value={action} options={ACTIONS} optionLabel="label" optionValue="value"
            onChange={(e) => setAction(e.value)} className="w-full" data-testid="select-action" />
          <InputTextarea value={remarks} onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks" rows={3} className="w-full" data-testid="input-remarks" />
          <Button label={`${action === 'approved' ? 'Approve & Sign' : action === 'rejected' ? 'Reject' : 'Return'}`}
            severity={ACTIONS.find(a => a.value === action)?.severity}
            onClick={() => { if (action === 'approved') setShowESign(true); else setShowApproval(false); }}
            data-testid="btn-approval-action" />
        </div>
      </Dialog>

      {/* E-Signature Dialog */}
      <ESignatureCanvas
        visible={showESign}
        onHide={() => setShowESign(false)}
        signableType="App\\Models\\WorkPermit"
        signableId={permit.id}
        signerName={currentUser}
        signerRole="approver"
        onSigned={() => { setShowApproval(false); onPermitUpdated(); }}
      />

      {/* Activation Dialog (with geofence) */}
      <Dialog header="Activate Permit" visible={showActivate}
        onHide={() => setShowActivate(false)} style={{ width: '500px' }} data-testid="activate-dialog">
        <div className="flex flex-col gap-3">
          <GeofenceValidator permitId={permit.id} autoValidate
            onValidationResult={setGeofenceResult} />
          <Button label="Confirm Activation" icon="pi pi-check" severity="success"
            loading={loading} onClick={handleActivate}
            disabled={geofenceResult !== null && !geofenceResult.within_zone}
            data-testid="btn-confirm-activate" />
        </div>
      </Dialog>

      {/* Close Dialog */}
      <Dialog header="Close Permit" visible={showClose}
        onHide={() => setShowClose(false)} style={{ width: '500px' }} data-testid="close-dialog">
        <div className="flex flex-col gap-3">
          <p className="text-sm">Ensure before/during/after photos have been uploaded.</p>
          <InputTextarea value={remarks} onChange={(e) => setRemarks(e.target.value)}
            placeholder="Closing remarks" rows={3} className="w-full" data-testid="close-remarks" />
          <Button label="Close Permit" icon="pi pi-check" severity="warning"
            loading={loading} onClick={handleClose} data-testid="btn-confirm-close" />
        </div>
      </Dialog>
    </>
  );
}
