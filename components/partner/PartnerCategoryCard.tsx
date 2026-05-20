import { StyleSheet, Text, View } from 'react-native';

import { PartnerGlassCard } from '@/components/partner/PartnerGlassCard';
import { PartnerCategoryArt } from '@/components/partner/PartnerCategoryArt';
import { PARTNER_CATEGORY_LABELS } from '@/constants/partner';
import { colors, fonts, textContrast } from '@/constants/theme';
import type { PartnerCategoryId } from '@/types/partnerLog';

type PartnerCategoryCardProps = {
  category: PartnerCategoryId;
  value: string;
  valueColor?: string;
  valueSize?: number;
  valueFont?: 'light' | 'medium' | 'regular';
  logged: boolean;
  onPress: () => void;
};

export function PartnerCategoryCard({
  category,
  value,
  valueColor = colors.textPrimary,
  valueSize = 18,
  valueFont = 'medium',
  logged,
  onPress,
}: PartnerCategoryCardProps) {
  return (
    <PartnerGlassCard style={styles.card} borderRadius={20} padding={18} onPress={onPress}>
      <Text style={styles.label}>{PARTNER_CATEGORY_LABELS[category]}</Text>
      <Text
        style={[
          styles.value,
          {
            fontSize: valueSize,
            color: valueColor,
            fontFamily:
              valueFont === 'light'
                ? fonts.light
                : valueFont === 'regular'
                  ? fonts.regular
                  : fonts.medium,
          },
        ]}
        numberOfLines={category === 'notes' ? 2 : 1}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
      {logged ? <View style={styles.dot} /> : null}
      <View style={styles.art}>
        <PartnerCategoryArt type={category} width={52} height={52} />
      </View>
    </PartnerGlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    height: 140,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
    ...textContrast,
  },
  value: {
    marginTop: 10,
    maxWidth: '78%',
    ...textContrast,
  },
  dot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.loggedDot,
  },
  art: {
    position: 'absolute',
    right: 8,
    bottom: 6,
  },
});
