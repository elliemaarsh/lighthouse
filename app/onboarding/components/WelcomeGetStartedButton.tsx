import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { OnboardingGlassPillButton } from '@/app/onboarding/components/OnboardingGlassPillButton';

const PULSE_MS = 2600;

export function WelcomeGetStartedButton() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.025],
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.22, 0.45],
  });

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.cluster}>
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
          pointerEvents="none"
        />
        <Animated.View style={{ transform: [{ scale }] }}>
          <OnboardingGlassPillButton
            label="Begin Here"
            onPress={() => router.push('/onboarding/name')}
            tone="light"
            style={styles.centeredPill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
  cluster: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 156,
    height: 58,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  centeredPill: {
    alignSelf: 'center',
  },
});
