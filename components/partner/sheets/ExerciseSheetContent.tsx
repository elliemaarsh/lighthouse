import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GlassChip } from '@/components/GlassChip';
import { DialRulerPicker } from '@/components/ui/DialRulerPicker';
import { PartnerSheetShell } from '@/components/partner/sheets/PartnerSheetShell';
import { EXERCISE_TYPES } from '@/constants/partner';
import { partnerSheetTypography } from '@/constants/partnerSheet';
import type { PartnerLogData } from '@/types/partnerLog';

const MINUTE_VALUES = Array.from({ length: 25 }, (_, i) => (i + 1) * 5);

type ExerciseSheetContentProps = {
  log: PartnerLogData;
  onSave: (patch: Partial<PartnerLogData>) => void;
};

export function ExerciseSheetContent({ log, onSave }: ExerciseSheetContentProps) {
  const [minutes, setMinutes] = useState<number | null>(log.exerciseMinutes ?? 30);
  const [types, setTypes] = useState<string[]>(log.exerciseTypes);
  const minuteValues = useMemo(() => MINUTE_VALUES, []);

  const toggleType = (t: string) => {
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const handleSave = () => {
    onSave({
      exerciseActive: true,
      exerciseMinutes: minutes ?? 30,
      exerciseTypes: types,
    });
  };

  return (
    <PartnerSheetShell title="Training" onSave={handleSave}>
      <DialRulerPicker
        value={minutes}
        values={minuteValues}
        onChange={setMinutes}
        unitLabel="minutes"
        defaultValue={30}
        palette="mist"
      />
      <Text style={styles.sectionLabel}>Activity</Text>
      <View style={styles.chips}>
        {EXERCISE_TYPES.map((t) => (
          <GlassChip
            key={t}
            label={t}
            selected={types.includes(t)}
            onPress={() => toggleType(t)}
            tone="partner"
          />
        ))}
      </View>
    </PartnerSheetShell>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...partnerSheetTypography.sectionLabel,
    marginTop: 8,
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
