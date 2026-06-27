import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { eSignatureService } from '../../services/extendedHseService';

interface Props {
  signableType: string;
  signableId: number;
  signerName: string;
  signerId?: number;
  signerRole?: string;
  onSigned?: () => void;
  visible: boolean;
  onHide: () => void;
}

export default function ESignatureCanvas({
  signableType,
  signableId,
  signerName,
  signerId,
  signerRole,
  onSigned,
  visible,
  onHide,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  // Reset canvas when dialog opens
  useEffect(() => {
    if (visible) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        setHasContent(false);
      }
    }
  }, [visible]);

  const getOffset = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    setDrawing(true);
    const { x, y } = getOffset(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getOffset(e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasContent(true);
  };

  const stopDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setHasContent(false);
  };

  const handleSign = useCallback(async () => {
    if (!hasContent) {
      toast.current?.show({ severity: 'warn', summary: 'Required', detail: 'Please draw your signature' });
      return;
    }
    setLoading(true);
    try {
      const dataUrl = canvasRef.current!.toDataURL('image/png');
      await eSignatureService.sign({
        signable_type: signableType,
        signable_id: signableId,
        signature_image: dataUrl,
        signer_name: signerName,
        signer_id: signerId,
        signer_role: signerRole,
      });
      toast.current?.show({ severity: 'success', summary: 'Signed', detail: 'Signature recorded' });
      onSigned?.();
      onHide();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save signature' });
    } finally {
      setLoading(false);
    }
  }, [hasContent, signableType, signableId, signerName, signerId, signerRole, onSigned, onHide]);

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Electronic Signature"
        visible={visible}
        onHide={onHide}
        style={{ width: '500px' }}
        data-testid="esign-dialog"
      >
        <p className="mb-2 text-sm text-gray-600">
          Draw your signature below. By signing you acknowledge and confirm the document.
        </p>
        <p className="mb-3 font-semibold">{signerName} {signerRole ? `(${signerRole})` : ''}</p>

        <div className="border rounded mb-3" style={{ touchAction: 'none' }}>
          <canvas
            ref={canvasRef}
            width={440}
            height={180}
            data-testid="esign-canvas"
            style={{ cursor: 'crosshair', display: 'block', width: '100%' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>

        <div className="flex justify-between">
          <Button label="Clear" icon="pi pi-eraser" className="p-button-text" onClick={clearCanvas}
            data-testid="btn-clear-signature" />
          <div className="flex gap-2">
            <Button label="Cancel" className="p-button-text" onClick={onHide} />
            <Button label="Sign" icon="pi pi-check" loading={loading} disabled={!hasContent}
              onClick={handleSign} data-testid="btn-submit-signature" />
          </div>
        </div>
      </Dialog>
    </>
  );
}
