import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';

interface Props {
  isNightWork: boolean;
  justification: string;
  onChange: (isNightWork: boolean, justification: string) => void;
  disabled?: boolean;
}

export default function NightWorkToggle({ isNightWork, justification, onChange, disabled }: Props) {
  return (
    <div className="flex flex-column gap-2">
      <div className="flex align-items-center gap-3">
        <InputSwitch checked={isNightWork} disabled={disabled}
          onChange={e => onChange(!!e.value, justification)} />
        <label className="font-semibold">
          🌙 Night Work
        </label>
      </div>
      {isNightWork && (
        <div>
          <label className="block text-sm mb-1 text-gray-600">Justification for Night Work *</label>
          <InputTextarea value={justification} rows={2} className="w-full" disabled={disabled}
            onChange={e => onChange(isNightWork, e.target.value)}
            placeholder="Explain why this work must be performed at night..." />
        </div>
      )}
    </div>
  );
}
