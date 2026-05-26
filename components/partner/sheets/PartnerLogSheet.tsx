import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExerciseSheetContent } from '@/components/partner/sheets/ExerciseSheetContent';
import { HeatSheetContent } from '@/components/partner/sheets/HeatSheetContent';
import { NotesSheetContent } from '@/components/partner/sheets/NotesSheetContent';
import { SleepSheetContent } from '@/components/partner/sheets/SleepSheetContent';
import { StressSheetContent } from '@/components/partner/sheets/StressSheetContent';
import { SubstancesSheetContent } from '@/components/partner/sheets/SubstancesSheetContent';
import { partnerSheet } from '@/constants/partnerSheet';
import type { PartnerCategoryId, PartnerLogData } from '@/types/partnerLog';

type PartnerLogSheetProps = {
  category: PartnerCategoryId | null;
  log: PartnerLogData;
  onSaveCategory: (patch: Partial<PartnerLogData>) => void | Promise<void>;
  onDismiss: () => void;
};

function SheetBackground() {
  return <View style={styles.sheetBgFill} />;
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
        <BottomSheetScrollView
          contentContainerStyle={styles.scroll}
          style={styles.scrollView}
        >
          {content}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBgFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: partnerSheet.background,
  },
  sheetBg: {
    backgroundColor: partnerSheet.background,
  },
  handle: {
    backgroundColor: partnerSheet.handle,
    width: 36,
  },
  scrollView: {
    backgroundColor: partnerSheet.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 24,
    backgroundColor: partnerSheet.background,
  },
});
