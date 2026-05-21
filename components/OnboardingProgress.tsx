import { StyleSheet, View } from 'react-native';

import { onboardingTheme } from '@/app/onboarding/theme';

type OnboardingProgressProps = {
  current: number;
  total?: number;
};

export function OnboardingProgress({ current, total = 10 }: OnboardingProgressProps) {
  const progress = Math.max(0, Math.min(1, current / total));

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    borderRadius: 100,
    backgroundColor: onboardingTheme.progressTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 100,
    backgroundColor: onboardingTheme.progressFill,
  },
});
