import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { colors, fontSizes, fonts, radius, spacing, typography } from '@/constants/theme';

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
        borderRadius={radius.pill}
        shadow={selected ? 'card' : 'soft'}
        style={styles.card}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: spacing.md,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.92,
  },
  card: {
    width: '100%',
  },
  inner: {
    padding: spacing.lg,
    paddingVertical: 22,
  },
  title: {
    fontSize: fontSizes.body,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 0.15,
  },
  description: {
    fontSize: 14,
    fontFamily: typography.subtext.fontFamily,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
