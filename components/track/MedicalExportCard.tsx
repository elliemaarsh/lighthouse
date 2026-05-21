import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/GlassCard';
import { PillButton } from '@/components/onboarding/PillButton';
import { routes } from '@/constants/routes';
import { colors, fontSizes, fonts, spacing } from '@/constants/theme';

export function MedicalExportCard() {
  return (
    <GlassCard borderRadius={24} padding={24} style={styles.card}>
      <Text style={styles.kicker}>MEDICAL EXPORT</Text>
      <Text style={styles.title}>Export tracking history for your doctor</Text>
      <Text style={styles.subtext}>
        Creates a formatted PDF of your cycle summary and key metrics, ready to bring
        to an appointment.
      </Text>
      <PillButton
        label="Generate Report →"
        onPress={() => router.push(routes.trackExport)}
        variant="primary"
        style={styles.btn}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
  },
  kicker: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginTop: 8,
    lineHeight: 22,
  },
  subtext: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  btn: {
    alignSelf: 'stretch',
  },
});
