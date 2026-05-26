import type { ViewStyle } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';

type OnboardingPillButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
};

export function OnboardingPillButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: OnboardingPillButtonProps) {
  return (
    <AppButton
      label={label}
      onPress={onPress}
      tier={variant === 'primary' ? 2 : 1}
      disabled={disabled}
      style={style}
    />
  );
}
