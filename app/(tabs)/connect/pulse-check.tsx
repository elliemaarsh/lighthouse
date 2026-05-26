import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/onboarding/PillButton';
import { PulseScoreDial } from '@/components/pulse/PulseScoreDial';
import {
  PULSE_CAPACITY_LABELS,
  PULSE_CONNECTION_LABELS,
  PULSE_NEED_OPTIONS,
} from '@/constants/pulseCheck';
import { routes } from '@/constants/routes';
import { inputFieldStyle } from '@/constants/surfaces';
import { colors, fonts } from '@/constants/theme';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import { partnerFirstName } from '@/lib/partnerDisplay';
import { pulseDraftSession } from '@/lib/pulseDraft';
import { translatePulseNote } from '@/lib/pulseTranslate';
import { useUserStore } from '@/store/useUserStore';

export default function PulseCheckScreen() {
  const partnerName = useUserStore((s) => s.partnerName);
  const partnerEmail = useUserStore((s) => s.partnerEmail);
  const partnerLabel = partnerFirstName(partnerName, partnerEmail);

  const [connectionScore, setConnectionScore] = useState<number | null>(null);
  const [capacityScore, setCapacityScore] = useState<number | null>(null);
  const [currentNeed, setCurrentNeed] = useState<string | null>(null);
  const [rawNote, setRawNote] = useState('');
  const [translating, setTranslating] = useState(false);

  const q1Reveal = useRevealAnimation(true);
  const q2Reveal = useRevealAnimation(connectionScore != null);
  const q3Reveal = useRevealAnimation(capacityScore != null);
  const noteReveal = useRevealAnimation(currentNeed != null);
  const continueReveal = useRevealAnimation(currentNeed != null);

  const translatePulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!translating) {
      translatePulse.setValue(0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translatePulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translatePulse, {
          toValue: 0.5,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [translating, translatePulse]);

  const handleContinue = async () => {
    if (
      connectionScore == null ||
      capacityScore == null ||
      currentNeed == null ||
      translating
    ) {
      return;
    }

    setTranslating(true);
    try {
      const translatedNote = await translatePulseNote({
        connectionScore,
        capacityScore,
        currentNeed,
        rawNote,
        partnerName,
      });

      pulseDraftSession.set({
        connectionScore,
        capacityScore,
        currentNeed,
        rawNote,
        translatedNote,
      });

      router.push(routes.connectPulsePreview);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerKicker}>HOW ARE WE DOING</Text>
          <View style={styles.backSpacer} />
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <Animated.View style={q1Reveal.style}>
              <Text style={styles.headline}>
                {`How connected do you feel\nto ${partnerLabel} this week?`}
              </Text>
              <PulseScoreDial
                value={connectionScore}
                onChange={setConnectionScore}
                leftLabel="Distant"
                rightLabel="Really close"
                scoreLabels={PULSE_CONNECTION_LABELS}
              />
            </Animated.View>

            {connectionScore != null ? (
              <Animated.View style={[styles.section, q2Reveal.style]}>
                <Text style={styles.headline}>
                  How full is your{'\n'}emotional tank right now?
                </Text>
                <PulseScoreDial
                  value={capacityScore}
                  onChange={setCapacityScore}
                  leftLabel="Running on empty"
                  rightLabel="I've got enough"
                  scoreLabels={PULSE_CAPACITY_LABELS}
                />
              </Animated.View>
            ) : null}

            {capacityScore != null ? (
              <Animated.View style={[styles.section, q3Reveal.style]}>
                <Text style={styles.headline}>Right now I most need...</Text>
                <View style={styles.needGrid}>
                  {PULSE_NEED_OPTIONS.map((option) => {
                    const selected = currentNeed === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() => setCurrentNeed(option)}
                        style={[styles.needCard, selected && styles.needCardSelected]}
                      >
                        <Text
                          style={[
                            styles.needCardText,
                            selected && styles.needCardTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Animated.View>
            ) : null}

            {currentNeed != null ? (
              <Animated.View style={[styles.section, noteReveal.style]}>
                <Text style={styles.noteLabel}>
                  Anything you want your partner to know?
                </Text>
                <Text style={styles.noteSub}>
                  Write freely — your AI companion will help translate it into
                  something they can receive. Your exact words stay private.
                </Text>
                <TextInput
                  style={styles.noteInput}
                  value={rawNote}
                  onChangeText={setRawNote}
                  placeholder="What's on your mind this week..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  textAlignVertical="top"
                />
                <Text style={styles.noteHint}>
                  Your partner will only see a gentle version of this, not your
                  exact words.
                </Text>
              </Animated.View>
            ) : null}

            {currentNeed != null ? (
              <Animated.View style={[continueReveal.style, styles.continueWrap]}>
                <PillButton
                  label={translating ? 'Translating…' : 'Continue →'}
                  tier={2}
                  onPress={() => void handleContinue()}
                  disabled={translating}
                />
              </Animated.View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>

        {translating ? (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <Animated.Text style={[styles.loadingText, { opacity: translatePulse }]}>
              Translating with care...
            </Animated.Text>
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundTransparent,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
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
  backSpacer: {
    width: 44,
  },
  headerKicker: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 3,
    color: colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 48,
  },
  section: {
    marginTop: 40,
  },
  headline: {
    fontSize: 26,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 20,
  },
  needGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  needCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#1A1A1A',
  },
  needCardSelected: {
    backgroundColor: 'rgba(39, 53, 158, 0.12)',
    borderWidth: 0.5,
    borderColor: '#27359E',
  },
  needCardText: {
    fontSize: 14,
    fontFamily: fonts.light,
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 20,
  },
  needCardTextSelected: {
    color: '#27359E',
  },
  noteLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  noteSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 16,
  },
  noteInput: {
    ...inputFieldStyle,
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: fonts.regular,
    lineHeight: 24,
  },
  noteHint: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 16,
  },
  continueWrap: {
    marginTop: 28,
    alignSelf: 'stretch',
    width: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(212, 227, 240, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
