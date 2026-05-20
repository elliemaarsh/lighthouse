import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { PartnerGlassCard } from '@/components/partner/PartnerGlassCard';
import { colors, fontSizes, fonts, textContrast } from '@/constants/theme';

type PartnerTrainingCardProps = {
  trainingOn: boolean;
  onToggle: (value: boolean) => void;
  onOpenDetails?: () => void;
};

export function PartnerTrainingCard({
  trainingOn,
  onToggle,
  onOpenDetails,
}: PartnerTrainingCardProps) {
  return (
    <PartnerGlassCard style={styles.card} padding={16} selected={trainingOn}>
      <Text style={styles.label}>Training</Text>
      <View style={styles.bottomRow}>
        <Pressable
          onPress={trainingOn ? onOpenDetails : undefined}
          style={styles.hintWrap}
          disabled={!trainingOn}
        >
          <Text style={styles.hint} numberOfLines={2}>
            {trainingOn ? 'Tap for activity' : 'Rest day'}
          </Text>
        </Pressable>
        <Switch
          value={trainingOn}
          onValueChange={onToggle}
          trackColor={{
            false: 'rgba(255, 255, 255, 0.15)',
            true: 'rgba(255, 255, 255, 0.35)',
          }}
          thumbColor={colors.white}
          ios_backgroundColor="rgba(255, 255, 255, 0.15)"
        />
      </View>
    </PartnerGlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 128,
    minHeight: 148,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    ...textContrast,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
  },
  hintWrap: {
    flex: 1,
    minWidth: 0,
  },
  hint: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    lineHeight: 17,
    ...textContrast,
  },
});
