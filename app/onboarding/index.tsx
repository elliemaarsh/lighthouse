import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/onboarding/PillButton';
import { routes } from '@/constants/routes';
import { colors, fontSizes, spacing, textContrast, typography } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Text style={styles.wordmark}>LIGHTHOUSE</Text>

        <View style={styles.hero}>
          <Text style={styles.headline}>
            Your journey,{'\n'}together.
          </Text>
          <Text style={styles.subtext}>
            Lighthouse helps couples navigate conception, fertility, and pregnancy loss —
            together.
          </Text>
        </View>

        <View style={styles.footer}>
          <PillButton
            label="Get Started"
            onPress={() => router.push(routes.name)}
            variant="glass"
          />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  wordmark: {
    ...typography.wordmark,
    textAlign: 'center',
    marginTop: 60,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  headline: {
    fontSize: fontSizes.display,
    fontFamily: typography.headline.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: typography.headline.color,
    textAlign: 'center',
    lineHeight: 52,
    maxWidth: 320,
    ...textContrast,
  },
  subtext: {
    fontSize: fontSizes.body,
    fontFamily: typography.subtext.fontFamily,
    color: typography.subtext.color,
    textAlign: 'center',
    lineHeight: typography.subtext.lineHeight,
    maxWidth: 280,
    marginTop: spacing.lg,
    ...textContrast,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.footer,
  },
});
