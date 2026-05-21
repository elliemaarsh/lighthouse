import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { LineArt, type LineArtType } from '@/components/visuals/LineArt';
import { glass, metricText } from '@/constants/glass';
import { fonts, textContrast } from '@/constants/theme';

type DataMetricCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  art: LineArtType;
  size?: 'hero' | 'compact';
  style?: StyleProp<ViewStyle>;
  footer?: ReactNode;
};

export function DataMetricCard({
  label,
  value,
  subtitle,
  art,
  size = 'compact',
  style,
  footer,
}: DataMetricCardProps) {
  const isHero = size === 'hero';
  const artWidth = isHero ? 260 : 200;
  const artHeight = isHero ? 170 : 130;

  return (
    <GlassSurface
      variant="data"
      borderRadius={glass.dataRadius}
      shadow="soft"
      style={[isHero ? styles.hero : styles.compact, style]}
    >
      <View style={[styles.inner, isHero && styles.innerHero]}>
        <LineArt
          type={art}
          width={artWidth}
          height={artHeight}
          tone="dark"
          placement="background"
        />
        <View style={[styles.textStack, !isHero && styles.textStackCompact]}>
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
          <Text style={[styles.value, isHero && styles.valueHero]} numberOfLines={2}>
            {value}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={3}>
              {subtitle}
            </Text>
          ) : null}
          {footer}
        </View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    minHeight: 180,
  },
  compact: {
    flex: 1,
    minWidth: 0,
    minHeight: 152,
  },
  inner: {
    minHeight: 140,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  innerHero: {
    minHeight: 180,
  },
  textStack: {
    padding: 20,
    paddingTop: 28,
    zIndex: 2,
    justifyContent: 'flex-end',
    maxWidth: '72%',
  },
  textStackCompact: {
    padding: 16,
    paddingTop: 22,
    maxWidth: '100%',
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: metricText.label,
    marginBottom: 8,
    ...textContrast,
  },
  value: {
    fontSize: 22,
    fontFamily: fonts.semiBold,
    color: metricText.value,
    letterSpacing: 0.2,
    ...textContrast,
  },
  valueHero: {
    fontSize: 36,
    fontFamily: fonts.semiBold,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: metricText.sub,
    marginTop: 6,
    lineHeight: 17,
    ...textContrast,
  },
});
