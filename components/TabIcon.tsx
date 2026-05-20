import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

export type TabIconName = 'home' | 'track' | 'connect' | 'learn' | 'community';

const ICONS: Record<
  TabIconName,
  { outline: keyof typeof Ionicons.glyphMap; filled: keyof typeof Ionicons.glyphMap }
> = {
  home: { outline: 'home-outline', filled: 'home' },
  track: { outline: 'pulse-outline', filled: 'pulse' },
  connect: { outline: 'heart-outline', filled: 'heart' },
  learn: { outline: 'book-outline', filled: 'book' },
  community: { outline: 'chatbubbles-outline', filled: 'chatbubbles' },
};

type TabIconProps = {
  name: TabIconName;
  color: string;
  focused: boolean;
};

export function TabIcon({ name, color, focused }: TabIconProps) {
  const glyph = focused ? ICONS[name].filled : ICONS[name].outline;

  return (
    <View style={styles.wrap}>
      <Ionicons
        name={glyph}
        size={focused ? 25 : 24}
        color={color}
        style={focused ? styles.iconFocused : styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 28,
  },
  icon: {
    opacity: 0.88,
  },
  iconFocused: {
    opacity: 1,
  },
});
