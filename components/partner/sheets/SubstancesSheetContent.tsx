import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassChip } from '@/components/GlassChip';
import { GlassSurface } from '@/components/GlassSurface';
import { PartnerSheetShell } from '@/components/partner/sheets/PartnerSheetShell';
import { SUBSTANCE_OPTIONS } from '@/constants/partner';
import { colors, fontSizes, fonts, radius, textContrast, typography } from '@/constants/theme';
import type { PartnerLogData } from '@/types/partnerLog';

const NONE = 'None';
const ALCOHOL = 'Alcohol';

type SubstancesSheetContentProps = {
  log: PartnerLogData;
  onSave: (patch: Partial<PartnerLogData>) => void;
};

export function SubstancesSheetContent({ log, onSave }: SubstancesSheetContentProps) {
  const [selected, setSelected] = useState<string[]>(log.substances);
  const [drinks, setDrinks] = useState(log.alcoholDrinks ?? 0);

  useEffect(() => {
    setSelected(log.substances);
    setDrinks(log.alcoholDrinks ?? 0);
  }, [log.substances, log.alcoholDrinks]);

  const toggle = (item: string) => {
    if (item === NONE) {
      setSelected(selected.includes(NONE) ? [] : [NONE]);
      return;
    }
    const withoutNone = selected.filter((s) => s !== NONE);
    if (withoutNone.includes(item)) {
      setSelected(withoutNone.filter((s) => s !== item));
    } else {
      setSelected([...withoutNone, item]);
    }
  };

  const handleSave = () => {
    onSave({
      substances: selected,
      alcoholDrinks: selected.includes(ALCOHOL) ? drinks : null,
    });
  };

  const showAlcohol = selected.includes(ALCOHOL);

  return (
    <PartnerSheetShell title="Substances" onSave={handleSave} saveDisabled={selected.length === 0}>
      <Text style={styles.hint}>Tracking helps you understand patterns over time.</Text>
      <View style={styles.grid}>
        {SUBSTANCE_OPTIONS.map((item) => (
          <GlassChip
            key={item}
            label={item}
            selected={selected.includes(item)}
            onPress={() => toggle(item)}
            tone="partner"
          />
        ))}
      </View>
      {showAlcohol ? (
        <View style={styles.stepperRow}>
          <Text style={styles.stepperLabel}>Drinks today</Text>
          <View style={styles.stepper}>
            <Pressable onPress={() => setDrinks((d) => Math.max(0, d - 1))} style={styles.stepBtn}>
              <GlassSurface variant="pill" borderRadius={radius.avatar} shadow="none">
                <Text style={styles.stepBtnText}>−</Text>
              </GlassSurface>
            </Pressable>
            <Text style={styles.stepValue}>{drinks}</Text>
            <Pressable onPress={() => setDrinks((d) => d + 1)} style={styles.stepBtn}>
              <GlassSurface variant="pill" borderRadius={radius.avatar} shadow="none">
                <Text style={styles.stepBtnText}>+</Text>
              </GlassSurface>
            </Pressable>
          </View>
        </View>
      ) : null}
    </PartnerSheetShell>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 16,
    lineHeight: 18,
    ...textContrast,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stepperRow: {
    marginTop: 24,
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    marginBottom: 12,
    ...textContrast,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepBtn: {
    borderRadius: radius.avatar,
    overflow: 'hidden',
  },
  stepBtnText: {
    width: 44,
    height: 44,
    lineHeight: 44,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    ...textContrast,
  },
  stepValue: {
    fontSize: 28,
    fontFamily: typography.display.fontFamily,
    color: colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
    ...textContrast,
  },
});
