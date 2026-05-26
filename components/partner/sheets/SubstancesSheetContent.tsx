import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassChip } from '@/components/GlassChip';
import { PartnerSheetShell } from '@/components/partner/sheets/PartnerSheetShell';
import { SUBSTANCE_OPTIONS } from '@/constants/partner';
import { partnerSheet, partnerSheetTypography } from '@/constants/partnerSheet';
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
            <Pressable
              onPress={() => setDrinks((d) => Math.max(0, d - 1))}
              style={styles.stepBtn}
              accessibilityLabel="Decrease drinks"
            >
              <Text style={styles.stepBtnText}>−</Text>
            </Pressable>
            <Text style={styles.stepValue}>{drinks}</Text>
            <Pressable
              onPress={() => setDrinks((d) => d + 1)}
              style={styles.stepBtn}
              accessibilityLabel="Increase drinks"
            >
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </PartnerSheetShell>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...partnerSheetTypography.subtext,
    marginBottom: 16,
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
    ...partnerSheetTypography.subtext,
    marginBottom: 12,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: partnerSheet.stepperBorderColor,
    backgroundColor: partnerSheet.unselectedBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    ...partnerSheetTypography.stepperBtn,
  },
  stepValue: {
    ...partnerSheetTypography.stepperValue,
    minWidth: 32,
    textAlign: 'center',
  },
});
