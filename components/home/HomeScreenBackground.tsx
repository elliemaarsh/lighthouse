import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { mistGradient } from '@/constants/gradient';

type HomeScreenBackgroundProps = {
  children: ReactNode;
};

/**
 * Soft diagonal mesh-style gradient (top-left cool grey → top-right off-white,
 * bottom-left warm cream → bottom-right pale mint). Built from layered linear
 * gradients — no image asset.
 */
export function HomeScreenBackground({ children }: HomeScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[mistGradient.topLeft, mistGradient.center, mistGradient.bottomRight]}
        locations={[0, 0.48, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[mistGradient.topRight, 'rgba(253, 253, 253, 0)']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.15, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(241, 243, 231, 0)', mistGradient.bottomLeft]}
        start={{ x: 0.75, y: 0.3 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: mistGradient.center,
  },
});
