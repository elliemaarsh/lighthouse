import { forwardRef, useCallback } from 'react';
import {
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
} from 'react-native';

import { useTabBarScrollBehavior } from '@/hooks/useTabBarScrollBehavior';

type TabScrollViewProps = ScrollViewProps & {
  /** Set false when a screen manages tab bar visibility itself */
  tabBarScrollEnabled?: boolean;
};

export const TabScrollView = forwardRef<ScrollView, TabScrollViewProps>(
  function TabScrollView(
    { onScroll, scrollEventThrottle, tabBarScrollEnabled = true, ...props },
    ref,
  ) {
    const { onScroll: hideTabBarOnScroll, scrollEventThrottle: defaultThrottle } =
      useTabBarScrollBehavior({ enabled: tabBarScrollEnabled });

    const handleScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        hideTabBarOnScroll(event);
        onScroll?.(event);
      },
      [hideTabBarOnScroll, onScroll],
    );

    return (
      <ScrollView
        ref={ref}
        {...props}
        onScroll={handleScroll}
        scrollEventThrottle={scrollEventThrottle ?? defaultThrottle}
      />
    );
  },
);
