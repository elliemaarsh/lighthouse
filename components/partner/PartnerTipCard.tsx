import { StyleSheet, Text, View } from 'react-native';

import { PartnerGlassCard } from '@/components/partner/PartnerGlassCard';
import { PartnerCategoryArt } from '@/components/partner/PartnerCategoryArt';
import { PARTNER_TIPS_BY_DAY } from '@/constants/partner';
import { colors, fonts, textContrast } from '@/constants/theme';
import { glass } from '@/constants/glass';

export function PartnerTipCard() {
  const tip = PARTNER_TIPS_BY_DAY[new Date().getDay()];

  return (
    <PartnerGlassCard borderRadius={20} padding={20} style={styles.card}>
      <View style={styles.art}>
        <PartnerCategoryArt type="dna" width={60} height={60} color={glass.line} />
      </View>
      <Text style={styles.label}>TODAY'S TIP</Text>
      <Text style={styles.tip}>{tip}</Text>
    </PartnerGlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 16,
    minHeight: 100,
  },
  art: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
    paddingRight: 72,
    ...textContrast,
  },
  tip: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 22,
    marginTop: 8,
    paddingRight: 56,
    ...textContrast,
  },
});
