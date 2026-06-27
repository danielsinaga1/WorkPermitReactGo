import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { sosService } from '../../services/extendedHseService';
import type { TriggerSosPayload } from '../../types/workPermitTypes';

interface Props {
  personnelName: string;
  personnelId?: number;
  workPermitId?: number;
}

export default function SOSButton({ personnelName, personnelId, workPermitId }: Props) {
  const toast = useRef<Toast>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [position, setPosition] = useState<GeolocationPosition | null>(null);

  // Attempt to read GPS position on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition(pos),
        () => {} // silently fail — GPS is optional
      );
    }
  }, []);

  const handleTrigger = useCallback(async () => {
    setLoading(true);
    try {
      const payload: TriggerSosPayload = {
        triggered_by_name: personnelName,
        triggered_by_id: personnelId,
        work_permit_id: workPermitId,
        gps_latitude: position?.coords.latitude,
        gps_longitude: position?.coords.longitude,
        description: message || undefined,
      };

      await sosService.trigger(payload);
      toast.current?.show({
        severity: 'warn',
        summary: 'SOS Sent',
        detail: 'Emergency Response Team has been notified',
        life: 10000,
      });
      setShowConfirm(false);
      setMessage('');
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to send SOS' });
    } finally {
      setLoading(false);
    }
  }, [personnelName, personnelId, workPermitId, position, message]);

  return (
    <>
      <Toast ref={toast} />

      <Button
        label="SOS"
        icon="pi pi-exclamation-triangle"
        severity="danger"
        className="p-button-lg p-button-rounded"
        style={{ minWidth: 120, fontWeight: 'bold', fontSize: '1.1rem' }}
        onClick={() => setShowConfirm(true)}
        data-testid="btn-sos"
        aria-label="Emergency SOS Button"
      />

      <Dialog
        header="⚠️ Confirm Emergency SOS"
        visible={showConfirm}
        onHide={() => setShowConfirm(false)}
        style={{ width: '400px' }}
        data-testid="sos-confirm-dialog"
      >
        <p className="mb-3 text-red-600 font-semibold">
          This will alert the Emergency Response Team immediately.
        </p>
        <div className="mb-3">
          <label className="block mb-1">Optional Message</label>
          <InputTextarea value={message} onChange={(e) => setMessage(e.target.value)}
            rows={2} className="w-full" data-testid="sos-message" />
        </div>
        {position && (
          <p className="text-sm text-gray-500 mb-3" data-testid="sos-gps">
            GPS: {position.coords.latitude.toFixed(5)}, {position.coords.longitude.toFixed(5)}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button label="Cancel" className="p-button-text" onClick={() => setShowConfirm(false)} />
          <Button label="Send SOS" icon="pi pi-send" severity="danger" loading={loading}
            onClick={handleTrigger} data-testid="btn-confirm-sos" />
        </div>
      </Dialog>
    </>
  );
}
