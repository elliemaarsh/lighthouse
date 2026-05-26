import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PillButton } from '@/components/onboarding/PillButton';
import { SURFACE } from '@/constants/surfaces';
import { colors, fontSizes, fonts, homeMist, spacing, typography } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';
import { useTabBarStore } from '@/store/useTabBarStore';

const INK = '#1A1A1A';
/** Matches useTabBarScrollPadding — floating pill + bottom inset */
const FLOATING_TAB_BAR_CLEARANCE = 68;

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
  editMode?: boolean;
  /** Pull answer content toward the top (period step) */
  compactContent?: boolean;
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
  editMode = false,
  compactContent = false,
  children,
}: CheckInStepLayoutProps) {
  const progress = (step / totalSteps) * 100;
  const insets = useSafeAreaInsets();
  const tabBarHidden = useTabBarStore((s) => s.hidden);
  const footerBottomPad =
    Math.max(insets.bottom, 12) +
    spacing.md +
    (tabBarHidden ? 0 : FLOATING_TAB_BAR_CLEARANCE + spacing.sm);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backButton, noFocusRing]}
          >
            <Feather name="chevron-left" size={22} color={INK} />
          </Pressable>
          <Pressable onPress={onSkip} hitSlop={12} style={noFocusRing}>
            <Text style={styles.skip}>{skipLabel}</Text>
          </Pressable>
        </View>

        <Text style={styles.stepLabel}>
          {editMode ? `EDIT — STEP ${step} OF ${totalSteps}` : `STEP ${step} OF ${totalSteps}`}
        </Text>
        <Text style={styles.question}>{question}</Text>
        {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
      </View>

      <View style={styles.main}>
        <View
          style={[
            styles.answerArea,
            compactContent && styles.answerAreaCompact,
          ]}
        >
          {children}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: footerBottomPad }]}>
        <PillButton
          label={continueLabel}
          onPress={onContinue}
          disabled={!canContinue}
          tier={2}
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
  header: {
    flexShrink: 0,
  },
  main: {
    flex: 1,
    minHeight: 0,
  },
  progressWrap: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  progressTrack: {
    height: 3,
    backgroundColor: homeMist.checkInProgressTrack,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: homeMist.checkInProgressFill,
    borderRadius: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: SURFACE.strokeWidth,
    borderColor: SURFACE.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skip: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: INK,
    opacity: 0.55,
  },
  stepLabel: {
    fontSize: fontSizes.statLabel,
    fontFamily: fonts.medium,
    letterSpacing: 2.5,
    color: INK,
    opacity: 0.45,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  question: {
    fontSize: 32,
    fontFamily: typography.headline.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: INK,
    lineHeight: 40,
    marginTop: 4,
    paddingHorizontal: spacing.lg,
  },
  subtext: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: INK,
    opacity: 0.55,
    lineHeight: 20,
    marginTop: 4,
    paddingHorizontal: spacing.lg,
  },
  answerArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    overflow: 'visible',
  },
  answerAreaCompact: {
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  footer: {
    flexShrink: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    alignItems: 'stretch',
  },
});
