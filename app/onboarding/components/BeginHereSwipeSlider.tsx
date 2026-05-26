import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ONBOARDING_TEXT } from '@/app/onboarding/theme';
import { fonts } from '@/constants/theme';

const HANDLE_SIZE = 46;
const TRACK_PADDING = 4;
const COMPLETE_RATIO = 0.82;
const SPRING_FRICTION = 7;

type BeginHereSwipeSliderProps = {
  onComplete?: () => void;
  nextRoute?: string;
};

export function BeginHereSwipeSlider({
  onComplete,
  nextRoute = '/onboarding/name',
}: BeginHereSwipeSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const dragX = useRef(new Animated.Value(0)).current;
  const dragStart = useRef(0);
  const completed = useRef(false);
  const maxDragRef = useRef(0);

  const maxDrag = Math.max(0, trackWidth - HANDLE_SIZE - TRACK_PADDING * 2);

  useEffect(() => {
    maxDragRef.current = maxDrag;
  }, [maxDrag]);

  const resetSlider = useCallback(() => {
    completed.current = false;
    dragStart.current = 0;
    dragX.stopAnimation();
    dragX.setValue(0);
  }, [dragX]);

  useFocusEffect(
    useCallback(() => {
      resetSlider();
    }, [resetSlider]),
  );

  const finish = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    onComplete?.();
    router.push(nextRoute);
  }, [nextRoute, onComplete]);

  const snapBack = useCallback(() => {
    Animated.spring(dragX, {
      toValue: 0,
      useNativeDriver: true,
      friction: SPRING_FRICTION,
    }).start();
  }, [dragX]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !completed.current,
        onMoveShouldSetPanResponder: () => !completed.current,
        onPanResponderGrant: () => {
          dragX.stopAnimation((value) => {
            dragStart.current = value;
          });
        },
        onPanResponderMove: (_, gesture) => {
          const limit = maxDragRef.current;
          const next = Math.max(
            0,
            Math.min(limit, dragStart.current + gesture.dx),
          );
          dragX.setValue(next);
        },
        onPanResponderRelease: (_, gesture) => {
          const limit = maxDragRef.current;
          const next = Math.max(
            0,
            Math.min(limit, dragStart.current + gesture.dx),
          );
          if (limit > 0 && next >= limit * COMPLETE_RATIO) {
            Animated.timing(dragX, {
              toValue: limit,
              duration: 120,
              useNativeDriver: true,
            }).start(() => finish());
          } else {
            snapBack();
          }
        },
        onPanResponderTerminate: snapBack,
      }),
    [dragX, finish, snapBack],
  );

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.wrap} onLayout={onTrackLayout}>
      <View style={styles.track}>
        <Text style={styles.label} pointerEvents="none">
          BEGIN HERE
        </Text>
        <Animated.View
          style={[
            styles.handle,
            {
              transform: [{ translateX: dragX }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Ionicons name="arrow-forward" size={14} color={ONBOARDING_TEXT} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  track: {
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: TRACK_PADDING,
  },
  label: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: fonts.light,
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  handle: {
    position: 'absolute',
    left: TRACK_PADDING,
    top: TRACK_PADDING,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
