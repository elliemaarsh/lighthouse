import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const EASE_OUT = Easing.out(Easing.ease);

export function useRevealAnimation(active: boolean, duration = 400) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    if (!active) {
      opacity.setValue(0);
      translateY.setValue(16);
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
    ]).start();
  }, [active, duration, opacity, translateY]);

  return {
    style: {
      opacity,
      transform: [{ translateY }],
    },
  };
}
