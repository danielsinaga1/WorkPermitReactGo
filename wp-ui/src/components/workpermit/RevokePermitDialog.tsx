import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { permitRevokeService } from '../../services/gapFeaturesService';

interface Props {
  permitId: number;
  personnelId: number;
  visible: boolean;
  onHide: () => void;
  onRevoked?: () => void;
}

export default function RevokePermitDialog({ permitId, personnelId, visible, onHide, onRevoked }: Props) {
  const toast = useRef<Toast>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRevoke = async () => {
    if (!reason.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Required', detail: 'Please provide a revocation reason' });
      return;
    }
    setLoading(true);
    try {
      await permitRevokeService.revoke(permitId, { revoke_reason: reason, revoked_by: personnelId });
      toast.current?.show({ severity: 'success', summary: 'Revoked', detail: 'Permit has been revoked' });
      setReason('');
      onRevoked?.();
      onHide();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to revoke permit' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog header="Revoke Permit" visible={visible} onHide={onHide}
        style={{ width: '30rem' }} footer={
          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" severity="secondary" text onClick={onHide} />
            <Button label="Revoke Permit" icon="pi pi-ban" severity="danger" loading={loading} onClick={handleRevoke} />
          </div>
        }>
        <p className="mb-3 text-sm text-gray-600">
          This action will immediately cancel the permit and notify all related personnel. This cannot be undone.
        </p>
        <label className="block font-semibold mb-1">Reason for Revocation *</label>
        <InputTextarea value={reason} onChange={e => setReason(e.target.value)} rows={4} className="w-full"
          placeholder="Describe the reason for revoking this permit..." />
      </Dialog>
    </>
  );
}
