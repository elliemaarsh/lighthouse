import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { routes } from '@/constants/routes';
import { widgetPalette } from '@/constants/widgetPalette';
import { fonts } from '@/constants/theme';

const CTA_SKY = '#80B9FE';

export function CheckInCTAWidget() {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(routes.checkinStep1)}
      accessibilityRole="button"
      accessibilityLabel="Begin today's check-in"
    >
      <View style={styles.left}>
        <Text style={styles.title}>Begin today&apos;s check-in</Text>
        <Text style={styles.sub}>Track your cycle, mood, and symptoms</Text>
      </View>
      <View style={styles.btn}>
        <Ionicons name="chevron-forward" size={18} color={widgetPalette.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CTA_SKY,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: CTA_SKY,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontFamily: fonts.extraLight,
    fontSize: 16,
    color: widgetPalette.ink,
  },
  sub: {
    fontSize: 13,
    fontFamily: fonts.light,
    color: 'rgba(26, 36, 34, 0.55)',
    marginTop: 4,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
