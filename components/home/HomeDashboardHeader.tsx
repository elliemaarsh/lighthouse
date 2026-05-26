import { StyleSheet, Text, View } from 'react-native';

import { LighthouseLogo } from '@/components/brand/LighthouseLogo';
import { HomeHeaderActions } from '@/components/home/HomeHeaderActions';
import {
  fonts,
  fontSizes,
  homeDashboard,
  typography,
} from '@/constants/theme';

type HomeDashboardHeaderProps = {
  greeting: string;
  dateLabel: string;
};

export function HomeDashboardHeader({ greeting, dateLabel }: HomeDashboardHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <LighthouseLogo />
        <HomeHeaderActions />
      </View>

      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.date}>{dateLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 28,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  greeting: {
    ...typography.h1,
    color: homeDashboard.textPrimary,
  },
  date: {
    marginTop: 8,
    fontSize: fontSizes.body,
    fontFamily: fonts.regular,
    color: homeDashboard.textSecondary,
  },
});
