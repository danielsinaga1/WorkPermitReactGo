import { useState, useRef, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { qrVerifyService } from '../../services/extendedHseService';
import type { QrVerificationResult } from '../../types/workPermitTypes';

interface Props {
  visible: boolean;
  onHide: () => void;
}

export default function QRScanner({ visible, onHide }: Props) {
  const toast = useRef<Toast>(null);
  const [permitNumber, setPermitNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QrVerificationResult | null>(null);

  const handleVerify = useCallback(async () => {
    if (!permitNumber.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Required', detail: 'Enter permit number' });
      return;
    }
    setLoading(true);
    try {
      const res = await qrVerifyService.verify(permitNumber.trim());
      setResult(res);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Not Found', detail: 'Permit not found' });
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [permitNumber]);

  const reset = () => {
    setPermitNumber('');
    setResult(null);
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="🔍 QR / Permit Verification"
        visible={visible}
        onHide={() => { onHide(); reset(); }}
        style={{ width: '500px' }}
        data-testid="qr-scanner-dialog"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Scan a QR code or manually enter the permit number to verify.
          </p>

          {/* Manual entry fallback */}
          <div className="flex gap-2">
            <InputText
              value={permitNumber}
              onChange={(e) => setPermitNumber(e.target.value)}
              placeholder="e.g. WP-RED-20240301-001"
              className="flex-1"
              data-testid="input-permit-number"
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <Button label="Verify" icon="pi pi-search" loading={loading}
              onClick={handleVerify} data-testid="btn-verify-qr" />
          </div>

          {result && (
            <Card className="bg-gray-50" data-testid="qr-result">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <Tag
                    severity={result.is_valid ? 'success' : 'danger'}
                    value={result.is_valid ? 'VALID' : 'INVALID'}
                  />
                  {result.is_expired && <Tag severity="warning" value="EXPIRED" />}
                </div>
                <div><strong>Permit:</strong> {result.permit.permit_number}</div>
                <div><strong>Type:</strong> {result.permit.permit_type?.name ?? '—'}</div>
                <div><strong>Area:</strong> {result.permit.work_area?.name ?? '—'}</div>
                <div><strong>Status:</strong> {result.permit.status}</div>
                <div className="text-xs text-gray-400">Verified at: {result.verified_at}</div>
              </div>
            </Card>
          )}

          <div className="flex justify-end">
            <Button label="Close" className="p-button-text" onClick={() => { onHide(); reset(); }} />
          </div>
        </div>
      </Dialog>
    </>
  );
}
