import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';

type OnboardingOptionListProps = {
  children: ReactNode;
};

/** Vertical stack for glass option cards — `gap` keeps space visible between blur surfaces */
export function OnboardingOptionList({ children }: OnboardingOptionListProps) {
  return <View style={styles.list}>{children}</View>;
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});
