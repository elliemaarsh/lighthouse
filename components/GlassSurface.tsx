import { BlurView } from '@react-native-community/blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { glass, glassShadow, glassShadowSoft } from '@/constants/glass';

export type GlassVariant = 'card' | 'pill' | 'input' | 'dark' | 'data' | 'selected';

type GlassSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  variant?: GlassVariant;
  shadow?: 'none' | 'soft' | 'card';
};

function blurConfig(variant: GlassVariant) {
  const frost =
    variant === 'selected'
      ? glass.frostSelected
      : variant === 'pill'
        ? glass.frostBare
        : variant === 'data'
          ? glass.frostBare
          : variant === 'input'
            ? glass.frostLight
            : glass.frostLight;

  const borderColor =
    variant === 'selected' ? glass.borderLightStrong : glass.borderLight;

  return {
    blurType: glass.blurTypeLight,
    blurAmount: glass.blurAmountLight,
    borderColor,
    frost,
    reducedTransparencyFallbackColor: glass.fallbackLight,
    webOpacity: 0.35,
  };
}

export function GlassSurface({
  children,
  style,
  borderRadius = 20,
  variant = 'card',
  shadow = 'soft',
}: GlassSurfaceProps) {
  const { blurType, blurAmount, borderColor, frost, reducedTransparencyFallbackColor, webOpacity } =
    blurConfig(variant);
  const shadowStyle =
    shadow === 'card' ? glassShadow : shadow === 'soft' ? glassShadowSoft : null;

  return (
    <View
      style={[
        styles.shell,
        shadowStyle,
        { borderRadius, borderColor, overflow: 'hidden' as const },
        style,
      ]}
    >
      {Platform.OS === 'web' ? (
        <>
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius,
                backgroundColor: reducedTransparencyFallbackColor,
              },
            ]}
          />
          {frost ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { borderRadius, backgroundColor: frost, opacity: webOpacity },
              ]}
            />
          ) : null}
        </>
      ) : (
        <>
          <BlurView
            style={[StyleSheet.absoluteFill, { borderRadius }]}
            blurType={blurType}
            blurAmount={blurAmount}
            reducedTransparencyFallbackColor="transparent"
          />
          {frost ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { borderRadius, backgroundColor: frost },
              ]}
            />
          ) : null}
        </>
      )}
      <View
        style={[
          styles.edgeHighlightTop,
          { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: 1,
  },
  edgeHighlightTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: glass.highlight,
    zIndex: 2,
  },
  content: {
    zIndex: 3,
  },
});
