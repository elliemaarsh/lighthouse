import { BlurView } from '@react-native-community/blur';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  GLASS_SELECT_DURATION,
  glass,
  glassShadow,
  glassShadowSoft,
} from '@/constants/glass';

export type GlassVariant = 'card' | 'pill' | 'input' | 'dark' | 'data' | 'selected';

type GlassSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  variant?: GlassVariant;
  shadow?: 'none' | 'soft' | 'card';
};

function baseFrostForVariant(variant: GlassVariant): string {
  if (variant === 'pill' || variant === 'data') {
    return glass.frostBare;
  }
  if (variant === 'input') {
    return glass.frostInput;
  }
  /* card + selected share base; selection fog cross-fades on top */
  return glass.frostCard;
}

function blurConfig(variant: GlassVariant) {
  return {
    blurType: glass.blurTypeLight,
    blurAmount: glass.blurAmountLight,
    reducedTransparencyFallbackColor: glass.fallbackLight,
    baseFrost: baseFrostForVariant(variant),
    isSelected: variant === 'selected',
  };
}

export function GlassSurface({
  children,
  style,
  borderRadius = 20,
  variant = 'card',
  shadow = 'soft',
}: GlassSurfaceProps) {
  const { blurType, blurAmount, reducedTransparencyFallbackColor, baseFrost, isSelected } =
    blurConfig(variant);
  const shadowStyle =
    shadow === 'card' ? glassShadow : shadow === 'soft' ? glassShadowSoft : null;

  const selectionProgress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    selectionProgress.value = withTiming(isSelected ? 1 : 0, {
      duration: GLASS_SELECT_DURATION,
    });
  }, [isSelected, selectionProgress]);

  const selectionFrostStyle = useAnimatedStyle(() => ({
    opacity: selectionProgress.value,
  }));

  const selectionBorderStyle = useAnimatedStyle(() => ({
    opacity: selectionProgress.value,
  }));

  return (
    <View
      style={[
        styles.shell,
        shadowStyle,
        { borderRadius, borderColor: glass.borderLight, overflow: 'hidden' as const },
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
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius,
                backgroundColor: baseFrost,
                opacity: glass.webFrostOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius,
                backgroundColor: glass.frostSelectionOverlay,
                opacity: glass.webFrostOpacity,
              },
              selectionFrostStyle,
            ]}
            pointerEvents="none"
          />
        </>
      ) : (
        <>
          <BlurView
            style={[StyleSheet.absoluteFill, { borderRadius }]}
            blurType={blurType}
            blurAmount={blurAmount}
            reducedTransparencyFallbackColor="transparent"
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              { borderRadius, backgroundColor: baseFrost },
            ]}
            pointerEvents="none"
          />
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { borderRadius, backgroundColor: glass.frostSelectionOverlay },
              selectionFrostStyle,
            ]}
            pointerEvents="none"
          />
        </>
      )}

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            borderWidth: 1,
            borderColor: glass.borderLightStrong,
          },
          selectionBorderStyle,
        ]}
      />

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
