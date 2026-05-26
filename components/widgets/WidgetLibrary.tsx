import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WIDGET_LIBRARY_CATEGORIES } from '@/constants/widgets';
import { fonts, homeMist } from '@/constants/theme';
import { useWidgetStore } from '@/store/useWidgetStore';
import type { WidgetId } from '@/constants/widgets';

export const WidgetLibrary = forwardRef<BottomSheetModal>(function WidgetLibrary(
  _props,
  ref,
) {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['75%', '92%'], []);
  const activeWidgets = useWidgetStore((s) => s.activeWidgets);

  const toggleWidget = useCallback((id: WidgetId) => {
    const { activeWidgets: current, addWidget, removeWidget } = useWidgetStore.getState();
    if (current.includes(id)) {
      removeWidget(id);
    } else {
      addWidget(id);
    }
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.sheet}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetScrollView
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
      >
        <Text style={styles.title}>Customize</Text>
        <Text style={styles.subtitle}>Tap to add or remove widgets</Text>

        {WIDGET_LIBRARY_CATEGORIES.map((category) => (
          <View key={category.key}>
            <Text style={styles.categoryLabel}>{category.label}</Text>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
              keyboardShouldPersistTaps="handled"
            >
              {category.widgets.map((widget) => {
                const active = activeWidgets.includes(widget.id);
                return (
                  <Pressable
                    key={widget.id}
                    onPress={() => toggleWidget(widget.id)}
                    style={[styles.preview, active && styles.previewActive]}
                  >
                    <Text style={styles.previewName}>{widget.name}</Text>
                    <Text style={styles.previewDesc}>{widget.desc}</Text>
                    <View style={styles.status}>
                      {active ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={homeMist.fertileDotPeak}
                        />
                      ) : (
                        <Ionicons
                          name="add-circle-outline"
                          size={18}
                          color="rgba(26, 36, 34, 0.35)"
                        />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: homeMist.ctaBackground,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(26, 36, 34, 0.2)',
    alignSelf: 'center',
    marginTop: 12,
  },
  scroll: {
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.semiBold,
    color: homeMist.ctaText,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: homeMist.ctaTextSecondary,
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  categoryLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: fonts.medium,
    color: 'rgba(26, 36, 34, 0.45)',
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    marginBottom: 10,
    marginTop: 20,
  },
  hScroll: {
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  preview: {
    width: 150,
    height: 90,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    padding: 14,
    marginRight: 10,
  },
  previewActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderColor: 'rgba(255, 255, 255, 0.85)',
  },
  previewName: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: homeMist.ctaText,
  },
  previewDesc: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: homeMist.ctaTextSecondary,
    marginTop: 3,
    flex: 1,
  },
  status: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
});
