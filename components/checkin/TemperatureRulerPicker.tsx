import { useMemo } from 'react';

import { DialRulerPicker } from '@/components/ui/DialRulerPicker';
import type { TempUnit } from '@/types/checkIn';

type TemperatureRulerPickerProps = {
  value: number | null;
  unit: TempUnit;
  onChange: (value: number) => void;
  disabled?: boolean;
};

function buildValues(unit: TempUnit): number[] {
  if (unit === 'F') {
    const values: number[] = [];
    for (let t = 950; t <= 1000; t += 1) {
      values.push(t / 10);
    }
    return values;
  }
  const values: number[] = [];
  for (let t = 350; t <= 385; t += 1) {
    values.push(t / 10);
  }
  return values;
}

function defaultForUnit(unit: TempUnit): number {
  return unit === 'F' ? 98.6 : 36.8;
}

function formatTemp(value: number): string {
  return value.toFixed(1);
}

export function TemperatureRulerPicker({
  value,
  unit,
  onChange,
  disabled = false,
}: TemperatureRulerPickerProps) {
  const values = useMemo(() => buildValues(unit), [unit]);

  return (
    <DialRulerPicker
      value={value}
      values={values}
      onChange={onChange}
      unitLabel={`degrees °${unit}`}
      formatValue={formatTemp}
      defaultValue={defaultForUnit(unit)}
      disabled={disabled}
      palette="checkin"
    />
  );
}
