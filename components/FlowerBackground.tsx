import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { MistMeshGradientLayers } from '@/components/MistMeshGradientLayers';
import { mistGradient } from '@/constants/gradient';

type FlowerBackgroundProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Optional tint over the mesh (default: none) */
  overlayColor?: string;
};

/**
 * Global mist mesh background (code-only, no image).
 * Mounted once in app/_layout.tsx; screens should use transparent contentStyle.
 */
export function FlowerBackground({
  children,
  style,
  overlayColor = 'transparent',
}: FlowerBackgroundProps) {
  return (
    <View style={[styles.root, style]}>
      <MistMeshGradientLayers />
      <View style={[styles.fill, { backgroundColor: overlayColor }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: mistGradient.center,
  },
  fill: {
    flex: 1,
  },
});
