import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBlurView } from '@/components/AppBlurView';

import { ExerciseSheetContent } from '@/components/partner/sheets/ExerciseSheetContent';
import { HeatSheetContent } from '@/components/partner/sheets/HeatSheetContent';
import { NotesSheetContent } from '@/components/partner/sheets/NotesSheetContent';
import { SleepSheetContent } from '@/components/partner/sheets/SleepSheetContent';
import { StressSheetContent } from '@/components/partner/sheets/StressSheetContent';
import { SubstancesSheetContent } from '@/components/partner/sheets/SubstancesSheetContent';
import { glass } from '@/constants/glass';
import { colors } from '@/constants/theme';
import type { PartnerCategoryId, PartnerLogData } from '@/types/partnerLog';

type PartnerLogSheetProps = {
  category: PartnerCategoryId | null;
  log: PartnerLogData;
  onSaveCategory: (patch: Partial<PartnerLogData>) => void | Promise<void>;
  onDismiss: () => void;
};

function SheetBackground() {
  return (
    <AppBlurView
      style={StyleSheet.absoluteFill}
      blurType="light"
      blurAmount={24}
      reducedTransparencyFallbackColor="rgba(48, 82, 130, 0.85)"
    />
  );
}

export const PartnerLogSheet = forwardRef<BottomSheetModal, PartnerLogSheetProps>(
  function PartnerLogSheet({ category, log, onSaveCategory, onDismiss }, ref) {
    const snapPoints = useMemo(() => ['72%', '90%'], []);

    const handleSave = useCallback(
      async (patch: Partial<PartnerLogData>) => {
        await onSaveCategory(patch);
        if (ref && 'current' in ref && ref.current) {
          ref.current.dismiss();
        }
      },
      [onSaveCategory, ref],
    );

    const content = useMemo(() => {
      switch (category) {
        case 'sleep':
          return <SleepSheetContent log={log} onSave={handleSave} />;
        case 'exercise':
          return <ExerciseSheetContent log={log} onSave={handleSave} />;
        case 'heat':
          return <HeatSheetContent log={log} onSave={handleSave} />;
        case 'substances':
          return <SubstancesSheetContent log={log} onSave={handleSave} />;
        case 'stress':
          return <StressSheetContent log={log} onSave={handleSave} />;
        case 'notes':
          return <NotesSheetContent log={log} onSave={handleSave} />;
        default:
          return null;
      }
    }, [category, log, handleSave]);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={onDismiss}
        backgroundComponent={SheetBackground}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView contentContainerStyle={styles.scroll}>
          {content}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: colors.backgroundTransparent,
  },
  handle: {
    backgroundColor: glass.lineStrong,
    width: 36,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
