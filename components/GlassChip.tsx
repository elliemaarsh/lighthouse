import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { colors, fontSizes, fonts, partnerDashboard, radius, textContrast } from '@/constants/theme';

type GlassChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Dark fill on light partner Track sheets */
  tone?: 'default' | 'partner';
};

export function GlassChip({ label, selected, onPress, tone = 'default' }: GlassChipProps) {
  if (tone === 'partner') {
    return (
      <Pressable onPress={onPress} style={[styles.wrap, noFocusRing]}>
        <View
          style={[
            styles.partnerChip,
            selected ? styles.partnerChipSelected : styles.partnerChipIdle,
          ]}
        >
          <Text
            style={[
              styles.partnerLabel,
              selected ? styles.partnerLabelSelected : styles.partnerLabelIdle,
            ]}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.wrap, noFocusRing]}>
      <GlassSurface
        variant={selected ? 'selected' : 'pill'}
        borderRadius={radius.pill}
        shadow="none"
      >
        <View style={styles.inner}>
          <Text style={styles.label}>{label}</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  inner: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    letterSpacing: 0.2,
    ...textContrast,
  },
  partnerChip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  partnerChipIdle: {
    backgroundColor: partnerDashboard.quickPillBg,
    borderColor: partnerDashboard.cardBorder,
  },
  partnerChipSelected: {
    backgroundColor: partnerDashboard.selectedBg,
    borderColor: partnerDashboard.selectedBg,
  },
  partnerLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    letterSpacing: 0.2,
  },
  partnerLabelIdle: {
    color: partnerDashboard.textPrimary,
  },
  partnerLabelSelected: {
    color: partnerDashboard.selectedText,
    fontFamily: fonts.semiBold,
  },
});
