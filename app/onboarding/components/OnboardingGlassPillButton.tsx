import type { StyleProp, ViewStyle } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';

type OnboardingGlassPillButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  /** `light` = tier 1 (photo bg). `dark` = tier 2 full-width CTA */
  tone?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
};

export function OnboardingGlassPillButton({
  label,
  onPress,
  disabled = false,
  tone = 'dark',
  style,
}: OnboardingGlassPillButtonProps) {
  const tier = tone === 'dark' ? 2 : 1;

  return (
    <AppButton
      label={label}
      onPress={onPress}
      tier={tier}
      disabled={disabled}
      style={style}
    />
  );
}
