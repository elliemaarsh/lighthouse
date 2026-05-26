import { forwardRef, type ComponentRef } from 'react';
import type { ViewStyle } from 'react-native';

import { AppButton, type AppButtonTier } from '@/components/ui/AppButton';

type PillButtonProps = {
  label: string;
  onPress?: () => void;
  /** @deprecated Use `tier` — primary = 2, outline/ghost/glass = 1 */
  variant?: 'primary' | 'ghost' | 'glass' | 'outline';
  tier?: AppButtonTier;
  disabled?: boolean;
  style?: ViewStyle;
};

function tierFromVariant(variant: PillButtonProps['variant']): AppButtonTier {
  return variant === 'primary' ? 2 : 1;
}

export const PillButton = forwardRef<ComponentRef<typeof AppButton>, PillButtonProps>(
  function PillButton(
    { label, onPress, variant = 'primary', tier, disabled = false, style },
    ref,
  ) {
    const resolvedTier = tier ?? tierFromVariant(variant);

    return (
      <AppButton
        ref={ref}
        label={label}
        onPress={onPress}
        tier={resolvedTier}
        disabled={disabled}
        style={style}
      />
    );
  },
);
