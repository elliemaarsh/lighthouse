import { Platform, type ViewStyle } from 'react-native';

/** Removes the default web focus outline (blue ring) on pressables. */
export const noFocusRing: ViewStyle = Platform.select({
  web: {
    outlineStyle: 'solid',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  default: {},
}) as ViewStyle;
