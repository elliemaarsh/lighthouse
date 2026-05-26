import { fonts } from '@/constants/theme';

/** Non-carrying partner log bottom sheets — white surface, dark type */
export const partnerSheet = {
  background: '#FFFFFF',
  handle: 'rgba(26, 26, 26, 0.15)',
  titleColor: '#1A1A1A',
  titleSize: 22,
  labelColor: '#1A1A1A',
  labelSize: 16,
  subtextColor: '#9BB0AC',
  subtextSize: 12,
  stepperNumberColor: '#1A1A1A',
  stepperNumberSize: 24,
  stepperBtnColor: '#1A1A1A',
  stepperBorderColor: '#1A1A1A',
  selectedBg: 'rgba(39, 53, 158, 0.08)',
  selectedBorder: '#27359E',
  selectedText: '#27359E',
  unselectedBg: '#FFFFFF',
  unselectedBorder: '#1A1A1A',
  unselectedText: '#1A1A1A',
} as const;

export const partnerSheetTypography = {
  title: {
    fontFamily: fonts.light,
    fontSize: partnerSheet.titleSize,
    lineHeight: 28,
    color: partnerSheet.titleColor,
  },
  label: {
    fontFamily: fonts.light,
    fontSize: partnerSheet.labelSize,
    color: partnerSheet.labelColor,
  },
  subtext: {
    fontFamily: fonts.light,
    fontSize: partnerSheet.subtextSize,
    lineHeight: 18,
    color: partnerSheet.subtextColor,
  },
  stepperValue: {
    fontFamily: fonts.extraLight,
    fontSize: partnerSheet.stepperNumberSize,
    color: partnerSheet.stepperNumberColor,
  },
  stepperBtn: {
    fontFamily: fonts.light,
    fontSize: 24,
    lineHeight: 44,
    color: partnerSheet.stepperBtnColor,
    textAlign: 'center' as const,
  },
  sectionLabel: {
    fontFamily: fonts.light,
    fontSize: partnerSheet.subtextSize,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: partnerSheet.subtextColor,
  },
} as const;
