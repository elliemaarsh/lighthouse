import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { partnerSheet, partnerSheetTypography } from '@/constants/partnerSheet';

type PartnerSheetShellProps = {
  title: string;
  children: ReactNode;
  onSave: () => void;
  saveDisabled?: boolean;
};

export function PartnerSheetShell({
  title,
  children,
  onSave,
  saveDisabled = false,
}: PartnerSheetShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.handle} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
      <AppButton
        label="Save"
        onPress={onSave}
        tier={2}
        disabled={saveDisabled}
        style={styles.saveBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    backgroundColor: partnerSheet.background,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: partnerSheet.handle,
    marginBottom: 20,
  },
  title: {
    ...partnerSheetTypography.title,
    marginBottom: 16,
  },
  body: {
    flex: 1,
  },
  saveBtn: {
    marginTop: 20,
  },
});
