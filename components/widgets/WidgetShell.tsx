import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { widgetCard } from '@/components/widgets/widgetStyles';
import { fonts, homeMist } from '@/constants/theme';

type WidgetShellProps = {
  label: string;
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function WidgetShell({ label, children, onPress, style }: WidgetShellProps) {
  const inner = (
    <>
      <Text style={widgetCard.label}>{label}</Text>
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={[widgetCard.card, style]}>
        <View style={widgetCard.inner}>{inner}</View>
      </Pressable>
    );
  }

  return (
    <View style={[widgetCard.card, style]}>
      <View style={widgetCard.inner}>{inner}</View>
    </View>
  );
}

export const widgetText = StyleSheet.create({
  valueHero: {
    fontFamily: fonts.extraLight,
    fontSize: 42,
    color: homeMist.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 46,
  },
  valueLarge: {
    fontFamily: fonts.extraLight,
    fontSize: 38,
    color: homeMist.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 42,
  },
  valueMedium: {
    fontFamily: fonts.extraLight,
    fontSize: 26,
    color: homeMist.textPrimary,
    lineHeight: 32,
  },
  valueSmall: {
    fontFamily: fonts.light,
    fontSize: 20,
    color: homeMist.textPrimary,
    lineHeight: 26,
  },
  body: {
    fontFamily: fonts.light,
    fontSize: 15,
    color: homeMist.textPrimary,
    lineHeight: 23,
  },
  muted: {
    fontFamily: fonts.light,
    fontSize: 13,
    color: homeMist.textMuted,
    marginTop: 4,
  },
  caption: {
    fontFamily: fonts.light,
    fontSize: 11,
    color: homeMist.textMuted,
    marginTop: 6,
  },
});
