import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PillButton } from '@/components/onboarding/PillButton';
import { OnboardingTypography } from '@/components/onboarding/OnboardingTypography';
import { glass } from '@/constants/glass';

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
      <OnboardingTypography variant="headlineRole" style={styles.title}>
        {title}
      </OnboardingTypography>
      <View style={styles.body}>{children}</View>
      <PillButton
        label="Save"
        onPress={onSave}
        disabled={saveDisabled}
        variant="glass"
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
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: glass.lineStrong,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 16,
  },
  body: {
    flex: 1,
  },
  saveBtn: {
    marginTop: 20,
  },
});
