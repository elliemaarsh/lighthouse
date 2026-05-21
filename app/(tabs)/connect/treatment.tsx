import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConnectBlurCard } from '@/components/connect/ConnectBlurCard';
import { IVF_PHASES } from '@/constants/connect';
import { colors, connectDashboard, fontSizes, fonts, textContrast } from '@/constants/theme';
import { fetchIvfStatus, saveIvfStatus } from '@/lib/ivfStatus';
import type { IvfPhaseId } from '@/types/connect';
import { useUserStore } from '@/store/useUserStore';

export default function TreatmentScreen() {
  const userId = useUserStore((s) => s.userId);
  const [activePhase, setActivePhase] = useState<IvfPhaseId>('stimulation');

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        const status = await fetchIvfStatus(userId);
        if (status?.currentPhase) setActivePhase(status.currentPhase);
      })();
    }, [userId]),
  );

  const selectPhase = async (phase: IvfPhaseId) => {
    setActivePhase(phase);
    await saveIvfStatus(userId, phase);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={connectDashboard.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Treatment</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {IVF_PHASES.map((phase) => {
          const active = activePhase === phase.id;
          return (
            <Pressable
              key={phase.id}
              onPress={() => void selectPhase(phase.id)}
              style={[styles.phasePress, !active && styles.phaseDim]}
            >
              <ConnectBlurCard
                style={[styles.phaseCard, active && styles.phaseCardActive]}
                padding={20}
                blurAmount={16}
              >
                <Text style={styles.phaseTitle}>{phase.title}</Text>
                <Text style={styles.phaseDuration}>{phase.duration}</Text>
                <Text style={styles.phaseDesc}>{phase.description}</Text>
                <View style={styles.tags}>
                  {phase.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </ConnectBlurCard>
            </Pressable>
          );
        })}

        <Text style={styles.hint}>Both partners can see your current phase</Text>

        <ConnectBlurCard style={styles.noteCard} padding={16}>
          <Text style={styles.noteLabel}>PARTNER VIEW</Text>
          <Text style={styles.noteBody}>
            Your partner sees which phase you're in and gets tailored support suggestions.
          </Text>
        </ConnectBlurCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    color: connectDashboard.textPrimary,
    ...textContrast,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  phasePress: {
    marginBottom: 12,
  },
  phaseDim: {
    opacity: 0.5,
  },
  phaseCard: {
    marginBottom: 0,
  },
  phaseCardActive: {
    borderColor: colors.cardSelectedBorder,
    backgroundColor: colors.cardSelectedBg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  phaseTitle: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: connectDashboard.textPrimary,
  },
  phaseDuration: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: connectDashboard.textMuted,
    marginTop: 4,
    marginBottom: 10,
  },
  phaseDesc: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: connectDashboard.textSecondary,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: colors.cardUnselectedBg,
    borderWidth: 1,
    borderColor: connectDashboard.cardBorder,
  },
  tagText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: connectDashboard.textPrimary,
  },
  hint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: connectDashboard.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  noteCard: {
    marginTop: 4,
  },
  noteLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: connectDashboard.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  noteBody: {
    fontSize: fontSizes.label,
    fontFamily: fonts.regular,
    color: connectDashboard.textSecondary,
    lineHeight: 20,
  },
});
