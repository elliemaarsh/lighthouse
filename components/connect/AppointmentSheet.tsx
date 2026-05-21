import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from '@react-native-community/blur';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APPOINTMENT_TYPES } from '@/constants/connect';
import { glass } from '@/constants/glass';
import { colors, connectDashboard, fontSizes, fonts } from '@/constants/theme';
import type { Appointment, AppointmentType } from '@/types/connect';

type AppointmentSheetProps = {
  selectedDate: string;
  onSave: (draft: Omit<Appointment, 'id' | 'userId'>) => void;
};

function SheetBackground() {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.backgroundTransparent }]}
      />
    );
  }
  return (
    <BlurView
      style={StyleSheet.absoluteFill}
      blurType="light"
      blurAmount={24}
      reducedTransparencyFallbackColor={glass.fallbackLight}
    />
  );
}

export const AppointmentSheet = forwardRef<BottomSheetModal, AppointmentSheetProps>(
  function AppointmentSheet({ selectedDate, onSave }, ref) {
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ['85%'], []);

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(selectedDate);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [type, setType] = useState<AppointmentType>('doctor');
    const [notes, setNotes] = useState('');
    const [shared, setShared] = useState(true);

    useEffect(() => {
      setDate(selectedDate);
    }, [selectedDate]);

    const handleSave = () => {
      if (!title.trim()) return;
      onSave({
        partnerId: null,
        title: title.trim(),
        date,
        startTime,
        endTime,
        type,
        notes: notes.trim(),
        shared,
      });
      if (ref && 'current' in ref && ref.current) {
        ref.current.dismiss();
      }
      setTitle('');
      setNotes('');
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundComponent={SheetBackground}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          <View style={styles.wrap}>
            <Text style={styles.title}>Add appointment</Text>

            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Consultation, scan, blood test…"
              placeholderTextColor={connectDashboard.textMuted}
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Date</Text>
            <Text style={styles.dateValue}>{date}</Text>

            <Text style={styles.fieldLabel}>Time</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeField}>
                <Text style={styles.timeLabel}>Start</Text>
                <TextInput
                  value={startTime}
                  onChangeText={setStartTime}
                  style={styles.timeInput}
                  placeholder="09:00"
                  placeholderTextColor={connectDashboard.textMuted}
                />
              </View>
              <View style={styles.timeField}>
                <Text style={styles.timeLabel}>End</Text>
                <TextInput
                  value={endTime}
                  onChangeText={setEndTime}
                  style={styles.timeInput}
                  placeholder="10:00"
                  placeholderTextColor={connectDashboard.textMuted}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Type</Text>
            <View style={styles.typeRow}>
              {APPOINTMENT_TYPES.map((t) => (
                <Pressable
                  key={t.value}
                  onPress={() => setType(t.value)}
                  style={[
                    styles.typePill,
                    type === t.value && styles.typePillOn,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      type === t.value && styles.typeTextOn,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Notes (optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              style={[styles.input, styles.notes]}
              textAlignVertical="top"
              placeholder="Anything to remember"
              placeholderTextColor={connectDashboard.textMuted}
            />

            <View style={styles.shareRow}>
              <Text style={styles.shareLabel}>Share with partner</Text>
              <Pressable
                onPress={() => setShared((s) => !s)}
                style={[styles.shareToggle, shared && styles.shareToggleOn]}
              >
                <View style={[styles.shareThumb, shared && styles.shareThumbOn]} />
              </Pressable>
            </View>

            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save appointment</Text>
            </Pressable>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  handle: {
    backgroundColor: connectDashboard.sheetHandle,
    width: 36,
  },
  wrap: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.semiBold,
    color: connectDashboard.textPrimary,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 1.5,
    color: connectDashboard.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: connectDashboard.inputBg,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: connectDashboard.textPrimary,
  },
  dateValue: {
    fontSize: fontSizes.body,
    fontFamily: fonts.medium,
    color: connectDashboard.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  timeLabel: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: connectDashboard.textMuted,
    marginBottom: 6,
  },
  timeInput: {
    backgroundColor: connectDashboard.inputBg,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: connectDashboard.textPrimary,
    textAlign: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typePill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 100,
    backgroundColor: colors.cardUnselectedBg,
    borderWidth: 1,
    borderColor: connectDashboard.cardBorder,
  },
  typePillOn: {
    backgroundColor: colors.cardSelectedBg,
    borderColor: colors.cardSelectedBorder,
  },
  typeText: {
    fontSize: fontSizes.label,
    fontFamily: fonts.medium,
    color: connectDashboard.textPrimary,
  },
  typeTextOn: {
    color: connectDashboard.buttonText,
  },
  notes: {
    borderRadius: 20,
    minHeight: 100,
    marginTop: 4,
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  shareLabel: {
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: connectDashboard.textPrimary,
  },
  shareToggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 3,
    justifyContent: 'center',
  },
  shareToggleOn: {
    backgroundColor: colors.cardSelectedBg,
    alignItems: 'flex-end',
  },
  shareThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: connectDashboard.buttonText,
  },
  shareThumbOn: {},
  saveBtn: {
    marginTop: 24,
    backgroundColor: connectDashboard.buttonBg,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveText: {
    fontSize: fontSizes.body,
    fontFamily: fonts.medium,
    color: connectDashboard.buttonText,
  },
});
