import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { colors, fontSizes, radius, typography } from '@/constants/theme';

type PillTextInputProps = TextInputProps;

export function PillTextInput({ style, onFocus, onBlur, ...props }: PillTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <GlassSurface variant="input" borderRadius={radius.pill} shadow="soft">
      <View style={[styles.wrap, focused && styles.wrapFocused]}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, style]}
          {...props}
        />
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  wrapFocused: {
    borderColor: colors.inputBorderFocused,
  },
  input: {
    backgroundColor: 'transparent',
    height: 56,
    paddingHorizontal: 24,
    fontSize: fontSizes.body,
    fontFamily: typography.subtext.fontFamily,
    color: colors.textPrimary,
  },
});
