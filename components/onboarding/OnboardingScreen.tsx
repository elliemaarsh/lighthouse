import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/GlassSurface';
import { noFocusRing } from '@/lib/focusRing';
import { Wordmark } from '@/components/onboarding/Wordmark';
import { colors, spacing } from '@/constants/theme';

type OnboardingScreenProps = {
  children: ReactNode;
  showBack?: boolean;
  showWordmark?: boolean;
  scrollable?: boolean;
  footer?: ReactNode;
};

export function OnboardingScreen({
  children,
  showBack = false,
  showWordmark = true,
  scrollable = false,
  footer,
}: OnboardingScreenProps) {
  const content = (
    <View style={styles.content}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, noFocusRing]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <GlassSurface variant="input" borderRadius={100} shadow="none">
            <View style={styles.backInner}>
              <Feather name="arrow-left" size={20} color={colors.textPrimary} />
            </View>
          </GlassSurface>
        </Pressable>
      ) : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {showWordmark ? <Wordmark /> : null}
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{content}</View>
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backInner: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.footer,
  },
});
