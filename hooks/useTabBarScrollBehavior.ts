import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { useTabBarStore } from '@/store/useTabBarStore';

const SCROLL_DELTA_THRESHOLD = 10;
const TOP_OFFSET_THRESHOLD = 16;

type Options = {
  /** Set false on screens that manage tab bar visibility themselves (e.g. check-in). */
  enabled?: boolean;
};

/**
 * Hides the floating tab bar when the user scrolls down; shows it again on scroll up.
 * Resets to visible when the screen gains focus.
 */
export function useTabBarScrollBehavior(options: Options = {}) {
  const { enabled = true } = options;
  const setHidden = useTabBarStore((s) => s.setHidden);
  const lastOffsetY = useRef(0);
  const scrollHidden = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;
      setHidden(false);
      lastOffsetY.current = 0;
      scrollHidden.current = false;
      return () => setHidden(false);
    }, [enabled, setHidden]),
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!enabled) return;

      const y = event.nativeEvent.contentOffset.y;
      const delta = y - lastOffsetY.current;

      if (y <= TOP_OFFSET_THRESHOLD) {
        if (scrollHidden.current) {
          scrollHidden.current = false;
          setHidden(false);
        }
      } else if (delta > SCROLL_DELTA_THRESHOLD) {
        if (!scrollHidden.current) {
          scrollHidden.current = true;
          setHidden(true);
        }
      } else if (delta < -SCROLL_DELTA_THRESHOLD) {
        if (scrollHidden.current) {
          scrollHidden.current = false;
          setHidden(false);
        }
      }

      lastOffsetY.current = y;
    },
    [enabled, setHidden],
  );

  return {
    onScroll,
    scrollEventThrottle: 16 as const,
  };
}
