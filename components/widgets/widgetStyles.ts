import { StyleSheet } from 'react-native';

import { fonts, homeMist } from '@/constants/theme';

export const widgetCard = StyleSheet.create({
  card: {
    backgroundColor: homeMist.card,
    borderRadius: 20,
    borderWidth: 0,
    shadowColor: homeMist.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: 'hidden',
  },
  inner: {
    padding: 20,
    overflow: 'hidden',
  },
  label: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontFamily: fonts.light,
    color: homeMist.textMuted,
    textTransform: 'uppercase',
    marginBottom: 10,
    zIndex: 1,
  },
});

export const widgetHalf = StyleSheet.create({
  wrap: {
    flex: 1,
    minWidth: 0,
  },
  spacer: {
    flex: 1,
    minWidth: 0,
  },
});
