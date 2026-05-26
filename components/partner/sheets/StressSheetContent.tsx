import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GlassStopSlider } from '@/components/ui/GlassStopSlider';
import { PartnerSheetShell } from '@/components/partner/sheets/PartnerSheetShell';
import { STRESS_LEVELS } from '@/constants/partner';
import { partnerSheet, partnerSheetTypography } from '@/constants/partnerSheet';
import { fonts } from '@/constants/theme';
import type { PartnerLogData } from '@/types/partnerLog';

type StressSheetContentProps = {
  log: PartnerLogData;
  onSave: (patch: Partial<PartnerLogData>) => void;
};

export function StressSheetContent({ log, onSave }: StressSheetContentProps) {
  const [level, setLevel] = useState<number | null>(log.stressLevel);

  useEffect(() => {
    setLevel(log.stressLevel);
  }, [log.stressLevel]);

  const stops = useMemo(
    () =>
      STRESS_LEVELS.map((s) => ({
        value: s.level,
        label: s.label,
      })),
    [],
  );

  const meta = level != null ? STRESS_LEVELS.find((s) => s.level === level) : null;

  const handleSave = () => {
    onSave({ stressLevel: level });
  };

  return (
    <PartnerSheetShell title="Stress" onSave={handleSave} saveDisabled={level == null}>
      {meta ? (
        <View style={styles.readout}>
          <Text style={styles.readoutNum}>{meta.level}</Text>
          <Text style={styles.readoutLabel}>{meta.label}</Text>
          <Text style={styles.readoutDesc}>{meta.description}</Text>
        </View>
      ) : (
        <Text style={styles.prompt}>Slide to set how stressed you feel today</Text>
      )}

      <GlassStopSlider
        stops={stops}
        value={level}
        onChange={setLevel}
        leftLabel="Stress"
        palette="mist"
        formatDisplay={(v, stop) => `${v} — ${stop.label}`}
      />
    </PartnerSheetShell>
  );
}

const styles = StyleSheet.create({
  prompt: {
    ...partnerSheetTypography.subtext,
    textAlign: 'center',
    marginBottom: 20,
  },
  readout: {
    alignItems: 'center',
    marginBottom: 24,
  },
  readoutNum: {
    fontSize: 56,
    fontFamily: fonts.extraLight,
    color: partnerSheet.titleColor,
    letterSpacing: 2,
  },
  readoutLabel: {
    ...partnerSheetTypography.label,
    marginTop: 4,
  },
  readoutDesc: {
    ...partnerSheetTypography.subtext,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
