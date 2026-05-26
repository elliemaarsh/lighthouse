import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/onboarding/PillButton';
import { resetAppForDev } from '@/lib/resetApp';
import {
  colors,
  fontSizes,
  fonts,
  spacing,
  typography,
} from '@/constants/theme';
import { useUserStore } from '@/store/useUserStore';

export default function SettingsScreen() {
  const displayName = useUserStore((s) => s.displayName);
  const role = useUserStore((s) => s.role);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (resetting) return;
    setResetting(true);
    try {
      await resetAppForDev();
    } catch (error) {
      console.warn('[Lighthouse] Reset app failed:', error);
      setResetting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{displayName?.trim() || '—'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>
            {role === 'carrying'
              ? 'Carrying partner'
              : role === 'non-carrying'
                ? 'Non-carrying partner'
                : '—'}
          </Text>
        </View>

        {__DEV__ ? (
          <View style={styles.devSection}>
            <PillButton
              label={resetting ? 'Resetting…' : 'Reset App (Dev Only)'}
              onPress={() => void handleReset()}
              disabled={resetting}
              variant="ghost"
            />
            {resetting ? (
              <ActivityIndicator color={colors.textMuted} style={styles.spinner} />
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.textOnDark,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  value: {
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  devSection: {
    marginTop: 'auto',
    paddingTop: spacing.xl * 2,
    alignItems: 'center',
    gap: 12,
  },
  spinner: {
    marginTop: 4,
  },
});
