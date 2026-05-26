import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { BUTTON_OPTION_SELECTED, OPTION_PRIMARY } from '@/constants/buttons';
import { SURFACE } from '@/constants/surfaces';
import {
  colors,
  fontSizes,
  fonts,
  radius,
  spacing,
  textContrast,
  typography,
} from '@/constants/theme';

type RoleCardProps = {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

export function RoleCard({ title, description, selected, onPress }: RoleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, noFocusRing, pressed && styles.pressed]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <GlassSurface
        variant={selected ? 'selected' : 'pill'}
        borderRadius={radius.card}
        shadow={selected ? 'card' : 'soft'}
        style={styles.card}
      >
        <View style={styles.inner}>
          <View style={styles.copy}>
            <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={[styles.ring, selected && styles.ringSelected]}>
            {selected ? (
              <Feather name="check" size={16} color={OPTION_PRIMARY} />
            ) : null}
          </View>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  card: {
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 20,
    minHeight: 108,
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: fontSizes.h3,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    letterSpacing: 0.1,
    ...textContrast,
  },
  titleSelected: {
    ...BUTTON_OPTION_SELECTED.label,
  },
  description: {
    fontSize: 14,
    fontFamily: typography.subtext.fontFamily,
    color: colors.textSecondary,
    lineHeight: 21,
    ...textContrast,
  },
  ring: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: SURFACE.strokeWidth,
    borderColor: SURFACE.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  ringSelected: {
    borderColor: OPTION_PRIMARY,
    backgroundColor: BUTTON_OPTION_SELECTED.container.backgroundColor,
  },
});
