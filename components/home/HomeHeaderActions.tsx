import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { routes } from '@/constants/routes';

type HomeHeaderActionsProps = {
  onPlusPress?: () => void;
  onSettingsPress?: () => void;
};

/** Joined dual-circle control: + on gray, settings on white disc */
export function HomeHeaderActions({
  onPlusPress,
  onSettingsPress,
}: HomeHeaderActionsProps) {
  return (
    <View style={styles.peanut}>
      <Pressable
        onPress={onPlusPress ?? (() => router.push(routes.checkinStep1))}
        style={styles.plusZone}
        accessibilityRole="button"
        accessibilityLabel="Customize widgets"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
      <Pressable
        onPress={onSettingsPress ?? (() => router.push(routes.settings))}
        style={styles.settingsZone}
        accessibilityRole="button"
        accessibilityLabel="Settings"
      >
        <View style={styles.settingsDisc}>
          <Ionicons name="settings-sharp" size={22} color="#1A1A1A" />
        </View>
      </Pressable>
    </View>
  );
}

const PEANUT_GRAY = '#E5E5E5';
const CIRCLE = 56;
const OVERLAP = 14;

const styles = StyleSheet.create({
  peanut: {
    flexDirection: 'row',
    alignItems: 'center',
    width: CIRCLE * 2 - OVERLAP,
    height: CIRCLE,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  plusZone: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: PEANUT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  settingsZone: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    marginLeft: -OVERLAP,
    backgroundColor: PEANUT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  settingsDisc: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
