import { useCallback, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { GlassSurface } from '@/components/GlassSurface';
import { colors, fontSizes, fonts, radius, textContrast } from '@/constants/theme';

const THUMB_WIDTH = 52;
const THUMB_HEIGHT = 44;
const TRACK_HEIGHT = 56;

export type GlassSliderStop<T extends string | number> = {
  value: T;
  label: string;
};

type GlassStopSliderProps<T extends string | number> = {
  stops: GlassSliderStop<T>[];
  value: T | null;
  onChange: (value: T) => void;
  leftLabel: string;
  formatDisplay?: (value: T, stop: GlassSliderStop<T>) => string;
  accentColor?: string;
};

function clampIndex(index: number, max: number) {
  return Math.max(0, Math.min(max, index));
}

export function GlassStopSlider<T extends string | number>({
  stops,
  value,
  onChange,
  leftLabel,
  formatDisplay,
  accentColor = colors.accentLime,
}: GlassStopSliderProps<T>) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);

  const activeIndex = useMemo(() => {
    if (value == null) return -1;
    const idx = stops.findIndex((s) => s.value === value);
    return idx >= 0 ? idx : 0;
  }, [stops, value]);

  const displayStop = activeIndex >= 0 ? stops[activeIndex] : null;
  const displayValue =
    value != null && displayStop
      ? formatDisplay
        ? formatDisplay(value, displayStop)
        : String(displayStop.label)
      : '—';

  const setIndex = useCallback(
    (index: number) => {
      const clamped = clampIndex(index, stops.length - 1);
      onChange(stops[clamped].value);
    },
    [onChange, stops],
  );

  const indexFromLocationX = useCallback(
    (locationX: number) => {
      if (trackWidthRef.current <= THUMB_WIDTH) return 0;
      const usable = trackWidthRef.current - THUMB_WIDTH;
      const ratio = Math.max(0, Math.min(1, (locationX - THUMB_WIDTH / 2) / usable));
      return Math.round(ratio * (stops.length - 1));
    },
    [stops.length],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          setIndex(indexFromLocationX(evt.nativeEvent.locationX));
        },
        onPanResponderMove: (evt) => {
          setIndex(indexFromLocationX(evt.nativeEvent.locationX));
        },
        onPanResponderRelease: (evt) => {
          setIndex(indexFromLocationX(evt.nativeEvent.locationX));
        },
      }),
    [indexFromLocationX, setIndex],
  );

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    trackWidthRef.current = w;
    setTrackWidth(w);
  };

  const thumbLeft =
    activeIndex >= 0 && trackWidth > THUMB_WIDTH
      ? (activeIndex / Math.max(1, stops.length - 1)) * (trackWidth - THUMB_WIDTH)
      : 0;

  const fillWidth =
    activeIndex >= 0 && trackWidth > 0
      ? thumbLeft + THUMB_WIDTH / 2
      : 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.leftLabel}>{leftLabel}</Text>
        <Text style={styles.rightValue}>{displayValue}</Text>
      </View>

      <View style={styles.trackTouch} {...panResponder.panHandlers}>
        <View style={styles.trackOuter} onLayout={onTrackLayout}>
          <GlassSurface variant="pill" borderRadius={radius.pill} shadow="none" style={styles.trackGlass}>
            <View style={[styles.trackInner, { height: TRACK_HEIGHT }]}>
              <View style={styles.tickRow} pointerEvents="none">
                {stops.map((stop, i) => {
                  const ratio = i / Math.max(1, stops.length - 1);
                  const left =
                    trackWidth > THUMB_WIDTH
                      ? ratio * (trackWidth - THUMB_WIDTH) + THUMB_WIDTH / 2 - 3
                      : `${ratio * 100}%`;
                  const isPast = activeIndex >= 0 && i <= activeIndex;
                  return (
                    <View
                      key={String(stop.value)}
                      style={[
                        styles.tickDot,
                        typeof left === 'number' ? { left } : { left, marginLeft: -3 },
                      ]}
                    >
                      <View style={[styles.dot, isPast && styles.dotActive]} />
                    </View>
                  );
                })}
              </View>

              {activeIndex >= 0 ? (
                <View
                  style={[
                    styles.progress,
                    {
                      width: fillWidth,
                      backgroundColor: accentColor,
                    },
                  ]}
                />
              ) : null}

              {activeIndex >= 0 ? (
                <View style={[styles.thumbWrap, { left: thumbLeft }]}>
                  <View style={styles.thumbGlow} />
                  <GlassSurface variant="selected" borderRadius={radius.pill} shadow="soft">
                    <View style={styles.thumb}>
                      <View style={styles.thumbLine} />
                    </View>
                  </GlassSurface>
                  <Svg width={THUMB_WIDTH + 8} height={THUMB_HEIGHT + 8} style={styles.thumbRingSvg}>
                    <Circle
                      cx={(THUMB_WIDTH + 8) / 2}
                      cy={(THUMB_HEIGHT + 8) / 2}
                      r={(THUMB_WIDTH + 4) / 2}
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth={1}
                      strokeDasharray="4 5"
                      fill="none"
                    />
                  </Svg>
                </View>
              ) : null}
            </View>
          </GlassSurface>
        </View>
      </View>

      <View style={styles.stopLabels}>
        {stops.map((stop) => (
          <Text key={String(stop.value)} style={styles.stopLabel} numberOfLines={1}>
            {stop.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  leftLabel: {
    fontSize: fontSizes.body,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    ...textContrast,
  },
  rightValue: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    ...textContrast,
  },
  trackOuter: {
    width: '100%',
  },
  trackGlass: {
    width: '100%',
  },
  trackInner: {
    width: '100%',
    justifyContent: 'center',
  },
  tickRow: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  tickDot: {
    position: 'absolute',
    top: TRACK_HEIGHT / 2 - 3,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  dotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  trackTouch: {
    width: '100%',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: TRACK_HEIGHT / 2 - 1.5,
    height: 3,
    borderRadius: 2,
    zIndex: 2,
    shadowColor: colors.accentLime,
    shadowOpacity: 0.65,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  thumbWrap: {
    position: 'absolute',
    top: (TRACK_HEIGHT - THUMB_HEIGHT) / 2,
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    zIndex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(200, 232, 106, 0.12)',
  },
  thumb: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbLine: {
    width: 2,
    height: 18,
    borderRadius: 1,
    backgroundColor: colors.white,
  },
  thumbRingSvg: {
    position: 'absolute',
    top: -4,
    left: -4,
  },
  stopLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  stopLabel: {
    flex: 1,
    fontSize: 10,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    textAlign: 'center',
    ...textContrast,
  },
});
