import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingProgress } from '@/components/OnboardingProgress';
import { OnboardingGlassPillButton } from '@/app/onboarding/components/OnboardingGlassPillButton';
import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts, spacing } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

type OnboardingShellProps = {
  children: ReactNode;
  headline: string;
  subtext?: string;
  progress?: { current: number; total?: number };
  showBack?: boolean;
  onBack?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
  skipLabel?: string;
  continueLabel?: string;
  onContinue?: () => void;
  continueDisabled?: boolean;
  scrollable?: boolean;
  footerExtra?: ReactNode;
};

export function OnboardingShell({
  children,
  headline,
  subtext,
  progress,
  showBack = false,
  onBack,
  showSkip = false,
  onSkip,
  skipLabel = 'Skip',
  continueLabel = 'Continue',
  onContinue,
  continueDisabled = true,
  scrollable = true,
  footerExtra,
}: OnboardingShellProps) {
  const body = (
    <>
      <Text style={styles.headline}>{headline}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
      <View style={styles.body}>{children}</View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topRow}>
        {showBack && onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color={onboardingTheme.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
        {showSkip && onSkip ? (
          <Pressable onPress={onSkip} hitSlop={12}>
            <Text style={styles.skip}>{skipLabel}</Text>
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>

      {progress ? (
        <View style={styles.progressWrap}>
          <OnboardingProgress current={progress.current} total={progress.total} />
        </View>
      ) : null}

      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      ) : (
        <View style={styles.scrollContent}>{body}</View>
      )}

      <View style={styles.footer}>
        {footerExtra}
        {onContinue ? (
          <OnboardingGlassPillButton
            label={continueLabel}
            onPress={onContinue}
            disabled={continueDisabled}
            tone="dark"
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: onboardingTheme.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
    minHeight: 44,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  skip: {
    fontSize: fontSizes.label,
    fontFamily: fonts.light,
    color: onboardingTheme.textPrimary,
    textAlign: 'right',
  },
  progressWrap: {
    paddingHorizontal: spacing.lg,
    marginTop: 8,
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headline: {
    fontSize: 32,
    fontFamily: fonts.extraLight,
    color: onboardingTheme.textPrimary,
    lineHeight: 40,
    marginTop: spacing.sm,
  },
  subtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: onboardingTheme.textMuted,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 8,
  },
  body: {
    marginTop: spacing.lg,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.footer,
    gap: 12,
    alignItems: 'stretch',
    width: '100%',
  },
});
