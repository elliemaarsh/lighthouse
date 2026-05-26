import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { mistGradient } from '@/constants/gradient';

/**
 * Soft four-corner mesh (no image): cool grey top-left, near-white top-right,
 * warm cream bottom-left, pale mint bottom-right.
 */
export function MistMeshGradientLayers() {
  const { topLeft, topRight, bottomLeft, bottomRight, center } = mistGradient;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[topLeft, center, bottomRight]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={[topRight, 'rgba(253, 253, 253, 0)']}
        locations={[0, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.12, y: 0.55 }}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['rgba(241, 243, 231, 0)', bottomLeft]}
        locations={[0, 1]}
        start={{ x: 0.7, y: 0.25 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['rgba(232, 239, 235, 0)', bottomRight]}
        locations={[0, 1]}
        start={{ x: 0.15, y: 0.55 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
