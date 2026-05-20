import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  type GradientLayer,
  type GradientPreset,
  type GradientVariant,
  gradientPresets,
  onboardingGradient,
} from '@/constants/gradient';

type AppGradientBackgroundProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: GradientVariant;
};

function isLayeredPreset(
  preset: GradientPreset | typeof onboardingGradient,
): preset is GradientPreset {
  return 'layers' in preset;
}

function GradientLayerView({ layer }: { layer: GradientLayer }) {
  return (
    <LinearGradient
      colors={[...layer.colors]}
      locations={layer.locations ? [...layer.locations] : undefined}
      start={layer.start}
      end={layer.end}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}

export function AppGradientBackground({
  children,
  style,
  variant = 'onboarding',
}: AppGradientBackgroundProps) {
  const preset = gradientPresets[variant];
  const baseColor = isLayeredPreset(preset) ? preset.base : preset.base;

  return (
    <View style={[styles.root, { backgroundColor: baseColor }, style]} pointerEvents="box-none">
      {variant === 'onboarding' || !isLayeredPreset(preset) ? (
        <LinearGradient
          colors={[...onboardingGradient.colors]}
          locations={[...onboardingGradient.locations]}
          start={onboardingGradient.start}
          end={onboardingGradient.end}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : (
        preset.layers.map((layer, i) => <GradientLayerView key={i} layer={layer} />)
      )}
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
