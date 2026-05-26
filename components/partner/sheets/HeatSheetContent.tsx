import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GlassStopSlider } from '@/components/ui/GlassStopSlider';
import { PartnerSheetShell } from '@/components/partner/sheets/PartnerSheetShell';
import { HEAT_OPTIONS } from '@/constants/partner';
import { colors, fontSizes, fonts, textContrast } from '@/constants/theme';
import type { HeatLevel, PartnerLogData } from '@/types/partnerLog';

type HeatSheetContentProps = {
  log: PartnerLogData;
  onSave: (patch: Partial<PartnerLogData>) => void;
};

export function HeatSheetContent({ log, onSave }: HeatSheetContentProps) {
  const [level, setLevel] = useState<HeatLevel | null>(log.heatLevel);

  useEffect(() => {
    setLevel(log.heatLevel);
  }, [log.heatLevel]);

  const stops = useMemo(
    () =>
      HEAT_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.value.charAt(0).toUpperCase() + opt.value.slice(1),
      })),
    [],
  );

  const activeOption = level != null ? HEAT_OPTIONS.find((o) => o.value === level) : null;

  const handleSave = () => {
    onSave({ heatLevel: level });
  };

  return (
    <PartnerSheetShell title="Heat exposure" onSave={handleSave} saveDisabled={level == null}>
      {activeOption ? (
        <Text style={styles.subtitle}>{activeOption.title}</Text>
      ) : (
        <Text style={styles.prompt}>Slide to your heat exposure level</Text>
      )}

      <GlassStopSlider
        stops={stops}
        value={level}
        onChange={setLevel}
        leftLabel="Heat"
        formatDisplay={(_, stop) => stop.label}
      />

      <Text style={styles.hint}>
        Heat above 99°F can affect sperm production for up to 3 months
      </Text>
    </PartnerSheetShell>
  );
}

const styles = StyleSheet.create({
  prompt: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textOnDarkFaint,
    textAlign: 'center',
    marginBottom: 20,
    ...textContrast,
  },
  subtitle: {
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 8,
    ...textContrast,
  },
  hint: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textOnDarkFaint,
    marginTop: 20,
    lineHeight: 18,
    textAlign: 'center',
    ...textContrast,
  },
});
