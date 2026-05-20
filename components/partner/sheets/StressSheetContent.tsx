import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GlassStopSlider } from '@/components/ui/GlassStopSlider';
import { PartnerSheetShell } from '@/components/partner/sheets/PartnerSheetShell';
import { STRESS_LEVELS } from '@/constants/partner';
import { colors, fontSizes, fonts, textContrast, typography } from '@/constants/theme';
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
        formatDisplay={(v, stop) => `${v} — ${stop.label}`}
      />
    </PartnerSheetShell>
  );
}

const styles = StyleSheet.create({
  prompt: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    ...textContrast,
  },
  readout: {
    alignItems: 'center',
    marginBottom: 24,
  },
  readoutNum: {
    fontSize: 56,
    fontFamily: typography.display.fontFamily,
    color: colors.textPrimary,
    letterSpacing: 2,
    ...textContrast,
  },
  readoutLabel: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginTop: 4,
    ...textContrast,
  },
  readoutDesc: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
    ...textContrast,
  },
});
