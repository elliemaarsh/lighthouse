import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/constants/theme';

/** Floating glass tab bar (pill + vertical padding) */
const FLOATING_TAB_BAR_HEIGHT = 68;

type Options = {
  /** Extra space for tall card grids (e.g. partner category rows) */
  extra?: number;
};

/**
 * Bottom inset so scroll content clears the floating tab bar.
 */
export function useTabBarScrollPadding(options: Options = {}) {
  const insets = useSafeAreaInsets();
  const { extra = 0 } = options;

  return FLOATING_TAB_BAR_HEIGHT + Math.max(insets.bottom, 12) + spacing.lg + extra;
}
