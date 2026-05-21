import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { appBackground } from '@/constants/gradient';

type AppGradientBackgroundProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppGradientBackground({ children, style }: AppGradientBackgroundProps) {
  return (
    <View
      style={[styles.root, { backgroundColor: appBackground }, style]}
      pointerEvents="box-none"
    >
      {children}
    </View>
  );
}

export const MistyGlassBackground = AppGradientBackground;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    overflow: 'hidden',
  },
});
