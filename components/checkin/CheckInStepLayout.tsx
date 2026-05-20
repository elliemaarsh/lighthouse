import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/GlassSurface';
import { PillButton } from '@/components/onboarding/PillButton';
import { colors, fontSizes, fonts, radius, spacing, textContrast, typography } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

type CheckInStepLayoutProps = {
  step: number;
  totalSteps?: number;
  question: string;
  subtext?: string;
  canContinue: boolean;
  onContinue: () => void;
  onSkip: () => void;
  skipLabel?: string;
  continueLabel?: string;
  children: ReactNode;
};

export function CheckInStepLayout({
  step,
  totalSteps = 4,
  question,
  subtext,
  canContinue,
  onContinue,
  onSkip,
  skipLabel = 'Skip',
  continueLabel = 'Continue →',
  children,
}: CheckInStepLayoutProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <GlassSurface
        variant="pill"
        borderRadius={radius.pill}
        shadow="none"
        style={styles.progressGlass}
      >
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </GlassSurface>

      <View style={styles.topRow}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, noFocusRing]}
        >
          <GlassSurface variant="pill" borderRadius={radius.pill} shadow="none">
            <View style={styles.backInner}>
              <Feather name="chevron-left" size={22} color={colors.textPrimary} />
            </View>
          </GlassSurface>
        </Pressable>
        <Pressable onPress={onSkip} hitSlop={12} style={noFocusRing}>
          <Text style={styles.skip}>{skipLabel}</Text>
        </Pressable>
      </View>

      <Text style={styles.stepLabel}>
        STEP {step} OF {totalSteps}
      </Text>
      <Text style={styles.question}>{question}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}

      <View style={styles.answerArea}>{children}</View>

      <View style={styles.footer}>
        <PillButton
          label={continueLabel}
          onPress={onContinue}
          disabled={!canContinue}
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
  progressGlass: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.accentLime,
    borderRadius: 100,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  backButton: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  backInner: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skip: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    ...textContrast,
  },
  stepLabel: {
    fontSize: fontSizes.statLabel,
    fontFamily: fonts.medium,
    letterSpacing: 2.5,
    color: colors.textMuted,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...textContrast,
  },
  question: {
    fontSize: 32,
    fontFamily: typography.headline.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: colors.textPrimary,
    lineHeight: 40,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    ...textContrast,
  },
  subtext: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    ...textContrast,
  },
  answerArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.footer,
  },
});
