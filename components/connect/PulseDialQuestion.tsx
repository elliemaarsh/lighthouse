import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DialRulerPicker } from '@/components/ui/DialRulerPicker';
import { colors, connectDashboard, fontSizes, fonts, textContrast } from '@/constants/theme';

type Option = { value: number; label: string };

type PulseDialQuestionProps = {
  question: string;
  options: readonly Option[];
  value: number | null;
  onChange: (value: number) => void;
};

export function PulseDialQuestion({
  question,
  options,
  value,
  onChange,
}: PulseDialQuestionProps) {
  const values = useMemo(() => options.map((o) => o.value), [options]);
  const labelByValue = useMemo(
    () => Object.fromEntries(options.map((o) => [o.value, o.label])),
    [options],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.question}>{question}</Text>
      <DialRulerPicker
        value={value}
        values={values}
        onChange={onChange}
        unitLabel={value != null ? labelByValue[value] : 'Scroll to select'}
        formatValue={(v) => labelByValue[v] ?? String(v)}
        defaultValue={3}
        palette="gradient"
      />
      <View style={styles.pills}>
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[styles.pill, selected && styles.pillOn]}
            >
              <Text style={[styles.pillText, selected && styles.pillTextOn]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 24,
  },
  question: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: connectDashboard.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: colors.cardUnselectedBg,
    borderWidth: 1,
    borderColor: connectDashboard.cardBorder,
  },
  pillOn: {
    backgroundColor: colors.cardSelectedBg,
    borderWidth: 0.5,
    borderColor: colors.cardSelectedBorder,
  },
  pillText: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: connectDashboard.textPrimary,
  },
  pillTextOn: {
    color: colors.cardSelectedBorder,
    fontFamily: fonts.light,
  },
});
