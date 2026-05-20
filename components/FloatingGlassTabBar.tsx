import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/GlassSurface';
import { useTabBarStore } from '@/store/useTabBarStore';
import { TabIcon, type TabIconName } from '@/components/TabIcon';
import { colors, fontSizes, fonts, radius, spacing } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

const TAB_ICONS: Record<string, TabIconName> = {
  index: 'home',
  track: 'track',
  connect: 'connect',
  learn: 'learn',
  community: 'community',
};

const TAB_ACTIVE_CONTENT = '#9AA8B2';

const PILL_HEIGHT = 56;
const PILL_PAD_H = 12;
const ROW_EDGE_INSET = 6;

const SPRING = { damping: 22, stiffness: 280, mass: 0.8 };

type TabMetrics = {
  tabX: number;
  tabWidth: number;
  contentWidth: number;
};

function tabPillGeometry(metrics: TabMetrics, containerWidth: number) {
  const inset = (metrics.tabWidth - metrics.contentWidth) / 2;
  let left = metrics.tabX + inset - PILL_PAD_H;
  let width = metrics.contentWidth + PILL_PAD_H * 2;

  if (containerWidth > 0) {
    const maxRight = containerWidth - ROW_EDGE_INSET;
    const minLeft = ROW_EDGE_INSET;
    if (left + width > maxRight) {
      left = maxRight - width;
    }
    if (left < minLeft) {
      left = minLeft;
    }
    width = Math.min(width, containerWidth - minLeft * 2);
  }

  return { left, width };
}

type SlidingGlassPillProps = {
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
};

function SlidingGlassPill({ animatedStyle }: SlidingGlassPillProps) {
  return (
    <Animated.View style={[styles.slidingPillOuter, animatedStyle]} pointerEvents="none">
      <GlassSurface
        variant="selected"
        borderRadius={radius.pill}
        shadow="soft"
        style={styles.slidingPillGlass}
      >
        <View style={styles.slidingPillInner} />
      </GlassSurface>
    </Animated.View>
  );
}

export function FloatingGlassTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const hidden = useTabBarStore((s) => s.hidden);
  const activeIndex = state.index;
  const slideY = useSharedValue(0);

  const [metricsByIndex, setMetricsByIndex] = useState<Partial<Record<number, TabMetrics>>>({});
  const metricsRef = useRef(metricsByIndex);
  metricsRef.current = metricsByIndex;
  const rowWidthRef = useRef(0);

  const pillLeft = useSharedValue(ROW_EDGE_INSET);
  const pillWidth = useSharedValue(72);

  const applyPillPosition = useCallback(
    (index: number, map: Partial<Record<number, TabMetrics>>) => {
      const metrics = map[index];
      if (!metrics) return;
      const { left, width } = tabPillGeometry(metrics, rowWidthRef.current);
      pillLeft.value = withSpring(left, SPRING);
      pillWidth.value = withSpring(width, SPRING);
    },
    [pillLeft, pillWidth],
  );

  useEffect(() => {
    applyPillPosition(activeIndex, metricsByIndex);
  }, [activeIndex, metricsByIndex, applyPillPosition]);

  useEffect(() => {
    const offscreen = PILL_HEIGHT + 36 + Math.max(insets.bottom, 12);
    slideY.value = withSpring(hidden ? offscreen : 0, SPRING);
  }, [hidden, insets.bottom, slideY]);

  const barSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillLeft.value }],
    width: pillWidth.value,
  }));

  const updateMetrics = useCallback(
    (index: number, partial: Partial<TabMetrics>) => {
      setMetricsByIndex((prev) => {
        const next = {
          ...prev,
          [index]: { ...prev[index], ...partial } as TabMetrics,
        };
        const m = next[index];
        if (
          m &&
          m.tabWidth > 0 &&
          m.contentWidth > 0 &&
          typeof m.tabX === 'number' &&
          index === activeIndex
        ) {
          const { left, width } = tabPillGeometry(m, rowWidthRef.current);
          pillLeft.value = withSpring(left, SPRING);
          pillWidth.value = withSpring(width, SPRING);
        }
        return next;
      });
    },
    [activeIndex, pillLeft, pillWidth],
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
        <GlassSurface
          variant="card"
          borderRadius={radius.pill}
          shadow="card"
          style={styles.barBackdrop}
        >
          <View style={styles.barBackdropFill} />
        </GlassSurface>

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
                  ? options.title
                  : route.name;
            const focused = activeIndex === index;
            const iconName = TAB_ICONS[route.name] ?? 'home';
            const contentColor = focused ? TAB_ACTIVE_CONTENT : colors.textMuted;

            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                }}
                onLayout={(e: LayoutChangeEvent) => {
                  const { x, width } = e.nativeEvent.layout;
                  updateMetrics(index, { tabX: x, tabWidth: width });
                }}
                style={[styles.tab, noFocusRing]}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={label}
              >
                <View
                  style={styles.tabContent}
                  onLayout={(e: LayoutChangeEvent) => {
                    const { width } = e.nativeEvent.layout;
                    updateMetrics(index, { contentWidth: width });
                  }}
                >
                  <TabIcon name={iconName} color={contentColor} focused={focused} />
                  <Text
                    style={[styles.label, { color: contentColor }, focused && styles.labelActive]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </View>
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
  },
  barBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  barBackdropFill: {
    minHeight: PILL_HEIGHT + 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: ROW_EDGE_INSET,
    minHeight: PILL_HEIGHT + 16,
    position: 'relative',
    zIndex: 1,
  },
  slidingPillOuter: {
    position: 'absolute',
    left: 0,
    top: 8,
    height: PILL_HEIGHT,
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
  slidingPillGlass: {
    width: '100%',
    height: '100%',
  },
  slidingPillInner: {
    width: '100%',
    height: PILL_HEIGHT,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: PILL_HEIGHT,
    zIndex: 2,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 6,
  },
  label: {
    fontSize: fontSizes.tabLabel,
    fontFamily: fonts.medium,
    letterSpacing: 0.35,
    marginTop: 2,
  },
  labelActive: {
    fontFamily: fonts.semiBold,
  },
});
