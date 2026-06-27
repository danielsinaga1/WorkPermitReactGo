import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload, type FileUploadHandlerEvent } from 'primereact/fileupload';
import { eSignatureService } from '../../services/extendedHseService';

type SignMode = 'draw' | 'text' | 'upload';

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

export default function ESignatureEnhanced({
  signableType, signableId, signerName, signerId, signerRole, onSigned, visible, onHide,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<SignMode>('draw');
  const [drawing, setDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [textSignature, setTextSignature] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const getDataUrl = (): string | null => {
    if (mode === 'draw') {
      return hasContent ? canvasRef.current?.toDataURL('image/png') || null : null;
    }
    if (mode === 'text' && textSignature.trim()) {
      // Render text to canvas
      const canvas = document.createElement('canvas');
      canvas.width = 440;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'italic 36px "Brush Script MT", "Segoe Script", cursive';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textSignature, 220, 90);
      return canvas.toDataURL('image/png');
    }
    if (mode === 'upload' && uploadedImage) {
      return uploadedImage;
    }
    return null;
  };

  const handleSign = async () => {
    const dataUrl = getDataUrl();
    if (!dataUrl) {
      toast.current?.show({ severity: 'warn', summary: 'Required', detail: 'Please provide your signature' });
      return;
    }
    setLoading(true);
    try {
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
  };

  // Canvas drawing handlers
  const getOffset = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    if ('touches' in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
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
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasContent(true);
  };

  const stopDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setHasContent(false);
  };

  const handleUpload = (e: FileUploadHandlerEvent) => {
    const file = e.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog header="Electronic Signature" visible={visible} onHide={onHide} style={{ width: '520px' }}>
        <p className="mb-2 text-sm text-gray-600">
          Sign as <strong>{signerName}</strong> {signerRole ? `(${signerRole})` : ''}
        </p>

        {/* Mode selector */}
        <div className="flex gap-4 mb-3">
          {(['draw', 'text', 'upload'] as SignMode[]).map(m => (
            <div key={m} className="flex align-items-center gap-2">
              <RadioButton value={m} checked={mode === m} onChange={() => setMode(m)} />
              <label className="capitalize">{m === 'draw' ? 'Draw' : m === 'text' ? 'Type' : 'Upload'}</label>
            </div>
          ))}
        </div>

        {/* Draw mode */}
        {mode === 'draw' && (
          <div className="border rounded mb-3" style={{ touchAction: 'none' }}>
            <canvas ref={canvasRef} width={440} height={180}
              style={{ cursor: 'crosshair', display: 'block', width: '100%' }}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
          </div>
        )}

        {/* Text mode */}
        {mode === 'text' && (
          <div className="mb-3">
            <InputText value={textSignature} onChange={e => setTextSignature(e.target.value)}
              className="w-full" placeholder="Type your full name" />
            {textSignature && (
              <div className="border rounded p-3 mt-2 text-center"
                style={{ fontFamily: '"Brush Script MT", "Segoe Script", cursive', fontSize: '2rem', fontStyle: 'italic' }}>
                {textSignature}
              </div>
            )}
          </div>
        )}

        {/* Upload mode */}
        {mode === 'upload' && (
          <div className="mb-3">
            <FileUpload mode="basic" accept="image/*" maxFileSize={2000000}
              chooseLabel="Choose Signature Image" auto customUpload uploadHandler={handleUpload} />
            {uploadedImage && (
              <div className="border rounded p-2 mt-2 text-center">
                <img src={uploadedImage} alt="Signature" style={{ maxHeight: '120px', maxWidth: '100%' }} />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-content-between">
          {mode === 'draw' && (
            <Button label="Clear" icon="pi pi-eraser" text onClick={clearCanvas} />
          )}
          <div className="flex gap-2 ml-auto">
            <Button label="Cancel" text onClick={onHide} />
            <Button label="Sign" icon="pi pi-check" loading={loading} onClick={handleSign} />
          </div>
        </div>
      </Dialog>
    </>
  );
}
