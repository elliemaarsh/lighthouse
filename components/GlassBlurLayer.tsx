import { BlurView as CommunityBlurView } from '@react-native-community/blur';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

import type { GlassVariant } from '@/components/GlassSurface';
import { glass } from '@/constants/glass';
import { blurIntensityFromAmount, expoBlurTint, shouldUseExpoBlur } from '@/lib/blur';

type GlassBlurLayerProps = {
  variant: GlassVariant;
  borderRadius: number;
};

export function GlassBlurLayer({ variant, borderRadius }: GlassBlurLayerProps) {
  const isDark = variant === 'dark' || variant === 'data';
  const {
    blurType,
    blurAmount,
    reducedTransparencyFallbackColor,
  } = isDark
    ? {
        blurType: glass.blurTypeDark,
        blurAmount: glass.blurAmountDark,
        reducedTransparencyFallbackColor: glass.fallbackDark,
      }
    : {
        blurType: glass.blurTypeLight,
        blurAmount: glass.blurAmountLight,
        reducedTransparencyFallbackColor: glass.fallbackLight,
      };

  const tintOverlay = isDark
    ? 'rgba(28, 36, 34, 0.42)'
    : 'rgba(255, 255, 255, 0.38)';
  const sheenOverlay = isDark
    ? 'rgba(255, 255, 255, 0.06)'
    : 'rgba(255, 255, 255, 0.55)';

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            backgroundColor: reducedTransparencyFallbackColor,
            opacity: isDark ? 0.82 : 0.65,
          },
        ]}
      />
    );
  }

  if (shouldUseExpoBlur()) {
    return (
      <>
        <ExpoBlurView
          intensity={blurIntensityFromAmount(isDark ? glass.blurAmountDark : glass.blurAmountLight)}
          tint={expoBlurTint(isDark ? 'dark' : 'light')}
          style={[StyleSheet.absoluteFill, { borderRadius, overflow: 'hidden' }]}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, backgroundColor: tintOverlay },
          ]}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, backgroundColor: sheenOverlay },
          ]}
          pointerEvents="none"
        />
      </>
    );
  }

  return (
    <>
      <CommunityBlurView
        style={[StyleSheet.absoluteFill, { borderRadius, overflow: 'hidden' }]}
        blurType={blurType}
        blurAmount={blurAmount}
        reducedTransparencyFallbackColor={reducedTransparencyFallbackColor}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius, backgroundColor: tintOverlay },
        ]}
        pointerEvents="none"
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius, backgroundColor: sheenOverlay },
        ]}
        pointerEvents="none"
      />
    </>
  );
}
