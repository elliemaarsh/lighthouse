import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** True when running in Expo Go — use expo-blur instead of @react-native-community/blur. */
export function shouldUseExpoBlur(): boolean {
  if (Platform.OS === 'web') return false;
  return (
    Constants.executionEnvironment === 'storeClient' ||
    Constants.appOwnership === 'expo'
  );
}

export function blurIntensityFromAmount(blurAmount: number): number {
  return Math.min(100, Math.round(blurAmount * 2.5));
}

export type AppBlurType = 'light' | 'dark' | 'xlight' | 'prominent';

export function expoBlurTint(blurType: AppBlurType): 'light' | 'dark' | 'default' {
  return blurType === 'dark' ? 'dark' : 'light';
}
