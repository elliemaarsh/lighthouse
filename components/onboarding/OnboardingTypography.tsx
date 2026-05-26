import type { ReactNode } from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';

import { onboardingTheme } from '@/app/onboarding/theme';
import { fontSizes, fonts, spacing, typography } from '@/constants/theme';

type OnboardingTypographyProps = {
  children: ReactNode;
  variant?: 'display' | 'headline' | 'headlineName' | 'headlineRole' | 'subtext' | 'caption';
  style?: TextStyle;
};

export function OnboardingTypography({
  children,
  variant = 'headline',
  style,
}: OnboardingTypographyProps) {
  return <Text style={[styles[variant], style]}>{children}</Text>;
}

const textColor = onboardingTheme.textPrimary;

const styles = StyleSheet.create({
  display: {
    fontSize: fontSizes.display,
    fontFamily: typography.display.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: textColor,
    lineHeight: 52,
    textAlign: 'center',
  },
  headline: {
    fontSize: fontSizes.displaySm,
    fontFamily: typography.headline.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: textColor,
    lineHeight: fontSizes.displaySm * 1.2,
    marginBottom: spacing.md,
  },
  headlineName: {
    fontSize: fontSizes.displaySm,
    fontFamily: typography.headline.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: textColor,
    lineHeight: fontSizes.displaySm * 1.2,
    marginTop: 80,
    marginBottom: spacing.md,
  },
  headlineRole: {
    fontSize: fontSizes.h1,
    fontFamily: typography.headline.fontFamily,
    letterSpacing: typography.headline.letterSpacing,
    color: textColor,
    lineHeight: fontSizes.h1 * 1.2,
    marginBottom: spacing.lg,
  },
  subtext: {
    fontSize: fontSizes.body,
    fontFamily: typography.subtext.fontFamily,
    color: textColor,
    lineHeight: typography.subtext.lineHeight,
    marginTop: spacing.md,
  },
  caption: {
    fontSize: fontSizes.label,
    fontFamily: fonts.light,
    color: textColor,
    letterSpacing: 1,
  },
});
