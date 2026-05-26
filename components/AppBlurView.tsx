import { BlurView as CommunityBlurView } from '@react-native-community/blur';
import { BlurView as ExpoBlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  blurIntensityFromAmount,
  expoBlurTint,
  shouldUseExpoBlur,
  type AppBlurType,
} from '@/lib/blur';

type AppBlurViewProps = {
  blurType?: AppBlurType;
  blurAmount?: number;
  style?: StyleProp<ViewStyle>;
  reducedTransparencyFallbackColor?: string;
  children?: ReactNode;
};

export function AppBlurView({
  blurType = 'light',
  blurAmount = 16,
  style,
  reducedTransparencyFallbackColor,
  children,
}: AppBlurViewProps) {
  const flat = StyleSheet.flatten(style);
  const borderRadius = flat?.borderRadius;

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          style,
          reducedTransparencyFallbackColor
            ? { backgroundColor: reducedTransparencyFallbackColor }
            : null,
        ]}
      >
        {children}
      </View>
    );
  }

  if (shouldUseExpoBlur()) {
    return (
      <ExpoBlurView
        intensity={blurIntensityFromAmount(blurAmount)}
        tint={expoBlurTint(blurType)}
        style={[
          style,
          borderRadius != null ? { overflow: 'hidden', borderRadius } : null,
        ]}
      >
        {reducedTransparencyFallbackColor ? (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: reducedTransparencyFallbackColor },
            ]}
          />
        ) : null}
        {children}
      </ExpoBlurView>
    );
  }

  return (
    <CommunityBlurView
      blurType={blurType}
      blurAmount={blurAmount}
      style={style}
      reducedTransparencyFallbackColor={reducedTransparencyFallbackColor}
    >
      {children}
    </CommunityBlurView>
  );
}
