import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { GlassChip } from '@/components/GlassChip';
import { DialRulerPicker } from '@/components/ui/DialRulerPicker';
import { PartnerSheetShell } from '@/components/partner/sheets/PartnerSheetShell';
import { SLEEP_QUICK_HOURS } from '@/constants/partner';
import type { PartnerLogData } from '@/types/partnerLog';

function buildSleepHourValues(): number[] {
  const values: number[] = [];
  for (let h = 4; h <= 12.001; h += 0.5) {
    values.push(Math.round(h * 2) / 2);
  }
  return values;
}

const SLEEP_VALUES = buildSleepHourValues();

function hoursFromLog(log: PartnerLogData): number | null {
  if (log.sleepHours == null) return null;
  return log.sleepHours;
}

type SleepSheetContentProps = {
  log: PartnerLogData;
  onSave: (patch: Partial<PartnerLogData>) => void;
};

export function SleepSheetContent({ log, onSave }: SleepSheetContentProps) {
  const values = useMemo(() => SLEEP_VALUES, []);
  const [hours, setHours] = useState<number | null>(hoursFromLog(log));

  useEffect(() => {
    setHours(hoursFromLog(log));
  }, [log.sleepHours, log.sleepMinutes]);

  const handleSave = () => {
    if (hours == null) return;
    const whole = Math.floor(hours);
    const mins = Math.round((hours - whole) * 60);
    onSave({
      sleepHours: hours,
      sleepMinutes: mins,
    });
  };

  return (
    <PartnerSheetShell title="Sleep" onSave={handleSave} saveDisabled={hours == null}>
      <DialRulerPicker
        value={hours}
        values={values}
        onChange={setHours}
        unitLabel="hours"
        defaultValue={8}
      />
      <View style={styles.quickRow}>
        {SLEEP_QUICK_HOURS.map((h) => (
          <GlassChip
            key={h}
            label={`${h}h`}
            selected={hours === parseFloat(h)}
            onPress={() => setHours(parseFloat(h))}
          />
        ))}
      </View>
    </PartnerSheetShell>
  );
}

const styles = StyleSheet.create({
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 8,
  },
});
