import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { gradient } from '@/constants/gradient';

type AppGradientBackgroundProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Monsoon Glow — 45° linear gradient (#305282 → #98AFC7 → #E9ECEF).
 * Mounted once at the app root so every screen shares the backdrop.
 */
export function AppGradientBackground({ children, style }: AppGradientBackgroundProps) {
  return (
    <View style={[styles.root, style]} pointerEvents="box-none">
      <LinearGradient
        colors={[gradient.top, gradient.mid, gradient.bottom]}
        locations={[0, 0.48, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
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
    backgroundColor: gradient.top,
  },
});
