import { useSegments } from 'expo-router';
import type { StyleProp, ViewStyle } from 'react-native';

import { AppGradientBackground } from '@/components/AppGradientBackground';
import type { GradientVariant } from '@/constants/gradient';
import { useUserStore } from '@/store/useUserStore';

type AppRootBackgroundProps = {
  style?: StyleProp<ViewStyle>;
};

/**
 * Onboarding keeps Monsoon Glow; main app tabs use role-specific backdrops.
 */
export function AppRootBackground({ style }: AppRootBackgroundProps) {
  const segments = useSegments();
  const role = useUserStore((s) => s.role);

  const inTabs = segments[0] === '(tabs)';

  let variant: GradientVariant = 'onboarding';
  if (inTabs) {
    if (role === 'non-carrying') {
      variant = 'non-carrying';
    } else if (role === 'carrying') {
      variant = 'carrying';
    }
  }

  return <AppGradientBackground variant={variant} style={style} />;
}
