import type { ReactNode } from 'react';
import { AppBlurView } from '@/components/AppBlurView';
import { useEffect } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  connectCardGlass,
  GLASS_SELECT_DURATION,
  glass,
  glassShadow,
  glassShadowSoft,
  lightCardShadow,
} from '@/constants/glass';
import { SURFACE } from '@/constants/surfaces';

export type GlassVariant =
  | 'card'
  | 'pill'
  | 'input'
  | 'dark'
  | 'data'
  | 'selected'
  | 'light';

function isContentCardVariant(variant: GlassVariant): boolean {
  return variant === 'card' || variant === 'light' || variant === 'data';
}

type GlassSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  variant?: GlassVariant;
  shadow?: 'none' | 'soft' | 'card';
};

function isLightVariant(variant: GlassVariant): boolean {
  return variant === 'light';
}

function baseFrostForVariant(variant: GlassVariant): string {
  if (isLightVariant(variant)) {
    return glass.frostLight;
  }
  if (variant === 'pill' || variant === 'data') {
    return glass.frostBare;
  }
  if (variant === 'input') {
    return SURFACE.inputBackground;
  }
  if (variant === 'selected') {
    return glass.frostSelected;
  }
  return glass.frostCard;
}

function blurConfig(variant: GlassVariant) {
  if (variant === 'card') {
    return {
      blurType: connectCardGlass.blurType,
      blurAmount: connectCardGlass.blurAmount,
      reducedTransparencyFallbackColor: connectCardGlass.fallback,
      baseFrost: connectCardGlass.frost,
      borderColor: connectCardGlass.border,
      borderStrong: connectCardGlass.borderStrong,
      isSelected: false,
    };
  }

  const light = isLightVariant(variant);
  return {
    blurType: light ? glass.blurTypeLight : glass.blurTypeDark,
    blurAmount: light ? glass.blurAmountLight : glass.blurAmountDark,
    reducedTransparencyFallbackColor: light ? glass.fallbackLight : glass.fallbackDark,
    baseFrost: baseFrostForVariant(variant),
    borderColor: light ? glass.borderLight : glass.borderDark,
    borderStrong: light ? glass.borderLightStrong : glass.borderDarkStrong,
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
  const {
    blurType,
    blurAmount,
    reducedTransparencyFallbackColor,
    baseFrost,
    borderColor,
    borderStrong,
    isSelected,
  } = blurConfig(variant);
  const isCard = isContentCardVariant(variant);
  const useLightShadow = isLightVariant(variant) || isCard;
  const shadowStyle =
    shadow === 'card'
      ? useLightShadow
        ? lightCardShadow
        : glassShadow
      : shadow === 'soft'
        ? useLightShadow
          ? lightCardShadow
          : glassShadowSoft
        : null;

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

  const shellBorderStyle = isCard
    ? styles.shellCard
    : variant === 'selected'
      ? styles.shellSelected
      : styles.shellOutlined;

  return (
    <View
      style={[
        styles.shell,
        shadowStyle,
        shellBorderStyle,
        { borderRadius, overflow: 'hidden' as const },
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
          <AppBlurView
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

      {!isCard && variant === 'selected' ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius,
              borderWidth: 0,
            },
            selectionBorderStyle,
          ]}
        />
      ) : null}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {},
  shellCard: {
    borderWidth: 0,
  },
  shellOutlined: {
    borderWidth: SURFACE.strokeWidth,
    borderColor: SURFACE.stroke,
  },
  shellSelected: {
    borderWidth: SURFACE.strokeWidth,
    borderColor: SURFACE.optionSelectedBorder,
    backgroundColor: SURFACE.selectedFill,
  },
  content: {
    zIndex: 3,
  },
});
