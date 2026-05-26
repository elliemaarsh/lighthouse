import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type AnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBlurView } from '@/components/AppBlurView';
import { TabIcon, type TabIconName } from '@/components/TabIcon';
import { tabBarGlass } from '@/constants/glass';
import { colors, radius, spacing } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';
import { useTabBarStore, type TabName } from '@/store/useTabBarStore';

const TAB_ICONS: Record<string, TabIconName> = {
  index: 'home',
  track: 'track',
  connect: 'connect',
  learn: 'learn',
  community: 'community',
};

const BAR_HEIGHT = 58;
const ICON_PILL_SIZE = 50;
const ROW_EDGE_INSET = 8;
const SPRING = { damping: 22, stiffness: 280, mass: 0.8 };

type TabMetrics = {
  tabX: number;
  tabWidth: number;
};

function pillLeftForTab(metrics: TabMetrics, containerWidth: number) {
  const center = metrics.tabX + metrics.tabWidth / 2;
  let left = center - ICON_PILL_SIZE / 2;
  const minLeft = ROW_EDGE_INSET;
  const maxLeft = containerWidth - ROW_EDGE_INSET - ICON_PILL_SIZE;
  return Math.max(minLeft, Math.min(maxLeft, left));
}

type SlidingGlassPillProps = {
  animatedStyle: AnimatedStyle<ViewStyle>;
};

function SlidingGlassPill({ animatedStyle }: SlidingGlassPillProps) {
  return (
    <Animated.View style={[styles.slidingPillOuter, animatedStyle]} pointerEvents="none">
      <View style={styles.slidingPillFill} />
    </Animated.View>
  );
}

function TabBarGlassBackdrop() {
  return (
    <View style={styles.barBackdrop}>
      <AppBlurView
        blurType={tabBarGlass.blurType}
        blurAmount={tabBarGlass.blurAmount}
        style={StyleSheet.absoluteFill}
        reducedTransparencyFallbackColor={tabBarGlass.fallback}
      />
      <View style={[StyleSheet.absoluteFill, styles.barFrost]} />
    </View>
  );
}

export function FloatingGlassTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const hidden = useTabBarStore((s) => s.hidden);
  const setLastTab = useTabBarStore((s) => s.setLastTab);
  const activeIndex = state.index;
  const slideY = useSharedValue(0);

  const [metricsByIndex, setMetricsByIndex] = useState<Partial<Record<number, TabMetrics>>>({});
  const metricsRef = useRef(metricsByIndex);
  metricsRef.current = metricsByIndex;
  const rowWidthRef = useRef(0);

  const pillLeft = useSharedValue(ROW_EDGE_INSET);
  const pillWidth = useSharedValue(ICON_PILL_SIZE);

  const applyPillPosition = useCallback(
    (index: number, map: Partial<Record<number, TabMetrics>>) => {
      const metrics = map[index];
      if (!metrics) return;
      const left = pillLeftForTab(metrics, rowWidthRef.current);
      pillLeft.value = withSpring(left, SPRING);
      pillWidth.value = withSpring(ICON_PILL_SIZE, SPRING);
    },
    [pillLeft, pillWidth],
  );

  useEffect(() => {
    applyPillPosition(activeIndex, metricsByIndex);
  }, [activeIndex, metricsByIndex, applyPillPosition]);

  useEffect(() => {
    const offscreen = BAR_HEIGHT + 28 + Math.max(insets.bottom, 12);
    slideY.value = withSpring(hidden ? offscreen : 0, SPRING);
  }, [hidden, insets.bottom, slideY]);

  const barSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillLeft.value }],
    width: pillWidth.value,
  }));

  const updateTabLayout = useCallback(
    (index: number, layout: TabMetrics) => {
      setMetricsByIndex((prev) => {
        const next = { ...prev, [index]: layout };
        if (index === activeIndex) {
          const left = pillLeftForTab(layout, rowWidthRef.current);
          pillLeft.value = withSpring(left, SPRING);
        }
        return next;
      });
    },
    [activeIndex, pillLeft],
  );

  return (
    <Animated.View
      style={[
        styles.outer,
        { paddingBottom: Math.max(insets.bottom, 12) },
        barSlideStyle,
      ]}
      pointerEvents={hidden ? 'none' : 'box-none'}
    >
      <View style={styles.barContainer}>
        <TabBarGlassBackdrop />

        <View
          style={styles.row}
          onLayout={(e: LayoutChangeEvent) => {
            rowWidthRef.current = e.nativeEvent.layout.width;
            applyPillPosition(activeIndex, metricsRef.current);
          }}
        >
          <SlidingGlassPill animatedStyle={pillAnimatedStyle} />

          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? String(options.tabBarLabel)
                : options.title !== undefined
                  ? String(options.title)
                  : route.name;
            const focused = activeIndex === index;
            const iconName = TAB_ICONS[route.name] ?? 'home';

            const iconColor = focused
              ? colors.buttonPrimaryText
              : 'rgba(28, 24, 20, 0.42)';

            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (event.defaultPrevented) return;

                  const currentTab = state.routes[activeIndex]?.name as TabName | undefined;

                  if (focused) {
                    // Re-tap: pop this tab's nested stack back to its root screen.
                    if (route.name === 'index') {
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: 'index',
                          merge: false,
                        }),
                      );
                    } else {
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: route.name,
                          params: { screen: 'index' },
                          merge: false,
                        }),
                      );
                    }
                    return;
                  }

                  if (currentTab && currentTab !== route.name) {
                    setLastTab(currentTab);
                  }

                  navigation.navigate(route.name, route.params);
                }}
                onLayout={(e: LayoutChangeEvent) => {
                  const { x, width } = e.nativeEvent.layout;
                  updateTabLayout(index, { tabX: x, tabWidth: width });
                }}
                style={[styles.tab, noFocusRing]}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={label}
              >
                <TabIcon
                  name={iconName}
                  color={iconColor}
                  focused={focused}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: 0,
  },
  barContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'visible',
    borderRadius: radius.pill,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  barBackdrop: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
  barFrost: {
    backgroundColor: tabBarGlass.frost,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: ROW_EDGE_INSET,
    minHeight: BAR_HEIGHT,
    position: 'relative',
    zIndex: 1,
  },
  slidingPillOuter: {
    position: 'absolute',
    left: 0,
    top: 4,
    height: ICON_PILL_SIZE,
    overflow: 'hidden',
    borderRadius: ICON_PILL_SIZE / 2,
  },
  slidingPillFill: {
    flex: 1,
    borderRadius: ICON_PILL_SIZE / 2,
    backgroundColor: tabBarGlass.selectedFill,
    borderWidth: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: ICON_PILL_SIZE,
    zIndex: 2,
  },
});
