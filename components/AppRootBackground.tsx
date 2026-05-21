import type { StyleProp, ViewStyle } from 'react-native';

import { AppGradientBackground } from '@/components/AppGradientBackground';

type AppRootBackgroundProps = {
  style?: StyleProp<ViewStyle>;
};

/** Single flat light-blue backdrop for the whole app. */
export function AppRootBackground({ style }: AppRootBackgroundProps) {
  return <AppGradientBackground style={style} />;
}
