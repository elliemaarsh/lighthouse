import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WelcomeGetStartedButton } from '@/app/onboarding/components/WelcomeGetStartedButton';
import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts, spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Text style={styles.wordmark}>LIGHTHOUSE</Text>

        <View style={styles.hero}>
          <Text style={styles.headline}>
            Your journey,{'\n'}together.
          </Text>
          <Text style={styles.subtext}>
            A home for couples navigating conception, fertility, and pregnancy loss.
          </Text>
        </View>

        <View style={styles.footer}>
          <WelcomeGetStartedButton />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: onboardingTheme.background,
  },
  safe: {
    flex: 1,
  },
  wordmark: {
    fontSize: 11,
    fontFamily: fonts.medium,
    letterSpacing: 5,
    color: onboardingTheme.textMuted,
    textAlign: 'center',
    marginTop: 60,
    textTransform: 'uppercase',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    maxWidth: 320,
  },
  headline: {
    fontSize: 44,
    fontFamily: fonts.semiBold,
    color: onboardingTheme.textPrimary,
    textAlign: 'left',
    lineHeight: 52,
  },
  subtext: {
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: onboardingTheme.textSecondary,
    textAlign: 'left',
    lineHeight: 24,
    marginTop: spacing.lg,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.footer,
  },
});
