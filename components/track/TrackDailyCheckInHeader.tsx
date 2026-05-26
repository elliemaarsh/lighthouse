import { Pressable, StyleSheet, Text, View } from 'react-native';

import { flatPillOutline, FLAT_PILL_INK } from '@/constants/flatPill';
import { fontSizes, fonts, radius } from '@/constants/theme';

type TrackDailyCheckInHeaderProps = {
  onBegin: () => void;
};

export function TrackDailyCheckInHeader({ onBegin }: TrackDailyCheckInHeaderProps) {
  return (
    <View style={styles.block}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.title}>Your daily check-in</Text>
          <Text style={styles.sub}>Takes about 2 minutes</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.beginBtn, pressed && styles.beginBtnPressed]}
          onPress={onBegin}
          accessibilityRole="button"
          accessibilityLabel="Begin check-in"
        >
          <Text style={styles.beginBtnText}>Begin →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingTop: 28,
    paddingBottom: 32,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: FLAT_PILL_INK,
  },
  sub: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: FLAT_PILL_INK,
    opacity: 0.65,
    marginTop: 6,
  },
  beginBtn: {
    flexShrink: 0,
    borderRadius: radius.pill,
    ...flatPillOutline,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beginBtnPressed: {
    opacity: 0.88,
  },
  beginBtnText: {
    fontSize: fontSizes.body,
    fontFamily: fonts.medium,
    color: FLAT_PILL_INK,
    letterSpacing: 0.2,
  },
});
