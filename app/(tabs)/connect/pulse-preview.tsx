import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { PillButton } from '@/components/onboarding/PillButton';
import { inputFieldStyle } from '@/constants/surfaces';
import { colors, fonts } from '@/constants/theme';
import { lightCardShadow } from '@/constants/glass';
import { pulseDraftSession } from '@/lib/pulseDraft';
import {
  getTodayDateString,
  savePulseCheck,
} from '@/lib/pulseChecks';
import { ensureLocalUserId } from '@/lib/localUserId';
import type { PulseCheckDraft } from '@/types/pulseCheck';
import { useUserStore } from '@/store/useUserStore';

export default function PulsePreviewScreen() {
  const userId = useUserStore((s) => s.userId);
  const setLastPulseCheckDate = useUserStore((s) => s.setLastPulseCheckDate);

  const [draft, setDraft] = useState<PulseCheckDraft | null>(null);
  const [translatedNote, setTranslatedNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = pulseDraftSession.get();
    if (!stored) {
      router.replace(routes.connectPulseCheck);
      return;
    }
    setDraft(stored);
    setTranslatedNote(stored.translatedNote);
  }, []);

  if (!draft) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator color={colors.textMuted} />
      </View>
    );
  }

  const persist = async (shareNote: boolean) => {
    if (saving) return;
    setSaving(true);
    const uid = userId ?? ensureLocalUserId();
    await savePulseCheck(uid, {
      connectionScore: draft.connectionScore,
      capacityScore: draft.capacityScore,
      currentNeed: draft.currentNeed,
      translatedNote: shareNote ? translatedNote.trim() || null : null,
    });
    setLastPulseCheckDate(getTodayDateString());
    pulseDraftSession.clear();
    setSaving(false);
    router.replace(routes.connect);
  };

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Before we share this</Text>
          <Text style={styles.subtitle}>
            Here's what your partner will see. You can edit or remove it before
            sending.
          </Text>

          <View style={styles.previewCard}>
            <View style={styles.previewInner}>
              <Text style={styles.previewLabel}>WHAT YOUR PARTNER WILL SEE</Text>
              {translatedNote ? (
                <TextInput
                  style={styles.previewInput}
                  value={translatedNote}
                  onChangeText={setTranslatedNote}
                  multiline
                  placeholderTextColor={colors.textMuted}
                />
              ) : (
                <Text style={styles.removedNote}>
                  No note will be shared — your scores and need still help your
                  partner understand the week.
                </Text>
              )}
            </View>
          </View>

          {translatedNote ? (
            <Pressable
              onPress={() => setTranslatedNote('')}
              style={styles.removeLink}
            >
              <Text style={styles.removeLinkText}>Remove this note</Text>
            </Pressable>
          ) : null}

          <Text style={styles.summaryKicker}>YOUR CHECK-IN SUMMARY</Text>
          <SummaryRow label="Connection" value={`${draft.connectionScore}/5`} />
          <SummaryRow label="Capacity" value={`${draft.capacityScore}/5`} />
          <SummaryRow label="I need" value={draft.currentNeed} />

          <View style={styles.ctaGroup}>
            <PillButton
              label={saving ? 'Sending…' : 'Send Check-in'}
              tier={2}
              onPress={() => void persist(true)}
              disabled={saving}
            />

            <PillButton
              label="Save for myself only"
              tier={1}
              onPress={() => void persist(false)}
              disabled={saving}
              style={styles.ctaSecondary}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  topBar: {
    width: '100%',
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardUnselectedBg,
    borderWidth: 1,
    borderColor: colors.cardUnselectedBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 20,
  },
  previewCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: colors.white,
    ...lightCardShadow,
  },
  previewInner: {
    padding: 24,
  },
  previewLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 12,
  },
  previewInput: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 26,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    minHeight: 80,
  },
  removedNote: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  removeLink: {
    marginTop: 12,
    alignItems: 'center',
  },
  removeLinkText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  summaryKicker: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    marginTop: 32,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
  },
  ctaGroup: {
    marginTop: 32,
    gap: 12,
    alignSelf: 'stretch',
    width: '100%',
  },
  ctaSecondary: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
