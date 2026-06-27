import { useState, useRef, useCallback, useEffect } from 'react';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { geofenceService } from '../../services/extendedHseService';
import type { GeofenceValidationResult } from '../../types/workPermitTypes';

interface Props {
  permitId: number;
  /** Auto-validate on mount */
  autoValidate?: boolean;
  onValidationResult?: (result: GeofenceValidationResult) => void;
}

export default function GeofenceValidator({ permitId, autoValidate = false, onValidationResult }: Props) {
  const toast = useRef<Toast>(null);
  const [result, setResult] = useState<GeofenceValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await geofenceService.validate(
            permitId,
            position.coords.latitude,
            position.coords.longitude
          );
          setResult(res);
          onValidationResult?.(res);

          if (!res.within_zone) {
            toast.current?.show({
              severity: 'warn',
              summary: 'Outside Zone',
              detail: `You are ${Math.round(res.distance_meters)}m from ${res.work_area}. Allowed: ${res.allowed_radius}m`,
              life: 8000,
            });
          }
        } catch {
          setError('Geofence validation failed');
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setError(`GPS error: ${geoError.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [permitId, onValidationResult]);

  useEffect(() => {
    if (autoValidate) validate();
  }, [autoValidate, validate]);

  return (
    <>
      <Toast ref={toast} />
      <div className="border rounded p-3" data-testid="geofence-validator">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">📍 Geofence Validation</span>
          <button
            className="text-blue-600 text-sm underline"
            onClick={validate}
            disabled={loading}
            data-testid="btn-validate-geofence"
          >
            {loading ? 'Validating…' : 'Check Location'}
          </button>
        </div>

        {loading && <ProgressSpinner style={{ width: '30px', height: '30px' }} />}

        {error && <p className="text-red-500 text-sm" data-testid="geofence-error">{error}</p>}

        {result && (
          <div className="flex items-center gap-3" data-testid="geofence-result">
            <Tag
              severity={result.within_zone ? 'success' : 'danger'}
              value={result.within_zone ? 'WITHIN ZONE' : 'OUTSIDE ZONE'}
            />
            <span className="text-sm text-gray-600">
              {Math.round(result.distance_meters)}m from {result.work_area} (max: {result.allowed_radius}m)
            </span>
          </div>
        )}
      </div>
    </>
  );
}
