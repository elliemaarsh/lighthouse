import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { ConnectBlurCard } from '@/components/connect/ConnectBlurCard';
import {
  SUPPORT_PLACEHOLDERS_CARRYING,
  SUPPORT_PLACEHOLDERS_NON_CARRYING,
} from '@/constants/connect';
import { connectDashboard, fontSizes, fonts, textContrast } from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export function ConnectSupportCard() {
  const role = useUserStore((s) => s.role);
  const suggestions = useMemo(
    () =>
      role === 'non-carrying'
        ? [...SUPPORT_PLACEHOLDERS_NON_CARRYING]
        : [...SUPPORT_PLACEHOLDERS_CARRYING],
    [role],
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [role]);

  const text = suggestions[index % suggestions.length] ?? suggestions[0];

  const refresh = () => {
    setIndex((i) => (i + 1) % suggestions.length);
  };

  return (
    <ConnectBlurCard style={styles.card} padding={16}>
      <Text style={styles.label}>SUPPORT</Text>
      <Text style={styles.body}>{text}</Text>
      <Pressable onPress={refresh} style={styles.refresh} hitSlop={12}>
        <Ionicons name="refresh" size={14} color={connectDashboard.textMuted} />
      </Pressable>
      <Svg width={52} height={52} style={styles.art} pointerEvents="none">
        <Circle cx={30} cy={26} r={18} stroke={connectDashboard.decoration} strokeWidth={1} fill="none" />
        <Circle cx={42} cy={20} r={12} stroke={connectDashboard.decoration} strokeWidth={1} fill="none" />
      </Svg>
    </ConnectBlurCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: connectDashboard.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  body: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: connectDashboard.textPrimary,
    lineHeight: 20,
    paddingRight: 24,
    ...textContrast,
  },
  refresh: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },
  art: {
    position: 'absolute',
    top: 8,
    right: 6,
  },
});
