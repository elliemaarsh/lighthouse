import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { HeatSheetContent } from '@/components/partner/sheets/HeatSheetContent';
import { useHomeWidgetContext } from '@/components/widgets/useHomeWidgetContext';
import { WidgetCornerArc } from '@/components/widgets/decor/WidgetCornerArc';
import { widgetCard } from '@/components/widgets/widgetStyles';
import { colors, fonts, homeMist } from '@/constants/theme';
import { partnerLogSession } from '@/lib/partnerLogSession';
import { savePartnerLog } from '@/lib/partnerLogs';
import { ensureLocalUserId } from '@/lib/localUserId';
import type { HeatLevel, PartnerLogData } from '@/types/partnerLog';
import { useUserStore } from '@/store/useUserStore';

function heatLabel(level: HeatLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function heatColor(level: HeatLevel): string {
  if (level === 'low') return homeMist.textMuted;
  if (level === 'medium') return colors.heatMedium;
  return colors.heatHigh;
}

function heatFillHeight(level: HeatLevel): number {
  if (level === 'low') return 12;
  if (level === 'medium') return 20;
  return 32;
}

export function HeatExposureWidget() {
  const userId = useUserStore((s) => s.userId);
  const { heatLevel: placeholderLevel } = useHomeWidgetContext();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%'], []);

  const [log, setLog] = useState<PartnerLogData>(() => partnerLogSession.getToday());
  const level: HeatLevel = log.heatLevel ?? placeholderLevel;

  const openSheet = () => sheetRef.current?.present();

  const handleSave = useCallback(
    async (patch: Partial<PartnerLogData>) => {
      const next = { ...partnerLogSession.getToday(), ...patch };
      partnerLogSession.setToday(next);
      setLog(next);
      const uid = userId || ensureLocalUserId();
      if (uid) {
        await savePartnerLog(uid, next);
      }
      sheetRef.current?.dismiss();
    },
    [userId],
  );

  return (
    <>
      <Pressable onPress={openSheet} style={widgetCard.card}>
        <View style={widgetCard.inner}>
          <WidgetCornerArc rx={52} />
          <Text style={widgetCard.label}>HEAT</Text>
          <View style={styles.row}>
            <Text style={[styles.value, { color: heatColor(level) }]}>
              {heatLabel(level)}
            </Text>
            <Svg width={4} height={40}>
              <Rect
                x={0}
                y={0}
                width={4}
                height={40}
                rx={2}
                fill={homeMist.track}
              />
              <Rect
                x={0}
                y={40 - heatFillHeight(level)}
                width={4}
                height={heatFillHeight(level)}
                rx={2}
                fill={heatColor(level)}
              />
            </Svg>
          </View>
        </View>
      </Pressable>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetScroll}>
          <HeatSheetContent log={log} onSave={handleSave} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  value: {
    fontFamily: fonts.extraLight,
    fontSize: 28,
    zIndex: 1,
  },
  sheetBg: {
    backgroundColor: colors.background,
  },
  sheetHandle: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  sheetScroll: {
    paddingBottom: 32,
  },
});
