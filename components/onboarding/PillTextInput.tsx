import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { inputFieldStyle, SURFACE } from '@/constants/surfaces';
import { colors, fontSizes, radius, typography } from '@/constants/theme';

type PillTextInputProps = TextInputProps;

export function PillTextInput({ style, onFocus, onBlur, ...props }: PillTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
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
      style={[styles.input, focused && styles.inputFocused, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...inputFieldStyle,
    height: 56,
    borderRadius: radius.pill,
    paddingHorizontal: 24,
    fontSize: fontSizes.body,
    fontFamily: typography.subtext.fontFamily,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: SURFACE.stroke,
  },
});
