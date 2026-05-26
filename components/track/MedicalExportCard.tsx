import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PillButton } from '@/components/onboarding/PillButton';
import { FLAT_PILL_INK } from '@/constants/flatPill';
import { routes } from '@/constants/routes';
import { fonts, spacing } from '@/constants/theme';
import { widgetCard } from '@/components/widgets/widgetStyles';

export function MedicalExportCard() {
  return (
    <View style={[widgetCard.card, styles.wrap]}>
      <View style={styles.inner}>
        <Text style={styles.kicker}>MEDICAL EXPORT</Text>
        <Text style={styles.title}>Export tracking history for your doctor</Text>
        <Text style={styles.subtext}>
          Creates a formatted PDF of your cycle summary and key metrics, ready to bring
          to an appointment.
        </Text>

        <View style={styles.reportBtnWrap}>
          <PillButton
            label="Generate Report →"
            tier={2}
            onPress={() => router.push(routes.trackExport)}
            style={styles.reportBtn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
    overflow: 'visible',
  },
  inner: {
    padding: 24,
    width: '100%',
  },
  kicker: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: FLAT_PILL_INK,
    opacity: 0.45,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: FLAT_PILL_INK,
    marginTop: 8,
    lineHeight: 22,
  },
  subtext: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: FLAT_PILL_INK,
    opacity: 0.65,
    lineHeight: 20,
    marginTop: 8,
  },
  reportBtnWrap: {
    paddingTop: spacing.xl,
    width: '100%',
  },
  reportBtn: {
    width: '100%',
    alignSelf: 'stretch',
  },
});
