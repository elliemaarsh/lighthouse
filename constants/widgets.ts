export type WidgetId = string;

/** Compact widgets — paired two per row when possible */
export const HALF_WIDTH_WIDGETS: WidgetId[] = [
  'temperature',
  'alignment-score',
  'heat-exposure',
  'mood',
  'period-countdown',
  'stress',
  'water',
  'did-you-know',
  'sperm-health-tip',
  'ovulation',
  'tww-countdown',
  'medication',
  'milestone',
  'gratitude',
  'affirmation',
];

export function isHalfWidthWidget(id: WidgetId): boolean {
  return HALF_WIDTH_WIDGETS.includes(id);
}

export const CARRYING_DEFAULT_WIDGETS: WidgetId[] = [
  'fertile-window',
  'partner-needs',
  'temperature',
  'alignment-score',
  'did-you-know',
  'ivf-phase',
  'week-calendar',
  'check-in-cta',
];

export const NON_CARRYING_DEFAULT_WIDGETS: WidgetId[] = [
  'partner-needs',
  'ovulation',
  'alignment-score',
  'heat-exposure',
  'ivf-phase',
  'sperm-health-tip',
  'check-in-cta',
];

export const DID_YOU_KNOW_BY_DAY: Record<number, string> = {
  0: 'Sperm take ~74 days to fully develop. Lifestyle changes today affect fertility in about 3 months.',
  1: 'BBT rises 0.2–0.5°F after ovulation, confirming it has occurred.',
  2: 'Stress hormones like cortisol can delay or suppress ovulation in some cycles.',
  3: 'An egg is viable for only 12–24 hours after ovulation — sperm can survive up to 5 days.',
  4: 'Vitamin D deficiency is linked to lower IVF success rates in multiple studies.',
  5: 'Couples who track together report feeling more connected during treatment.',
  6: 'Sleep quality directly affects LH and FSH — both are regulated during deep sleep.',
};

export type WidgetLibraryItem = {
  id: WidgetId;
  name: string;
  desc: string;
};

export type WidgetLibraryCategory = {
  key: string;
  label: string;
  widgets: WidgetLibraryItem[];
};

export const WIDGET_LIBRARY_CATEGORIES: WidgetLibraryCategory[] = [
  {
    key: 'cycle',
    label: 'CYCLE & FERTILITY',
    widgets: [
      { id: 'cycle-counter', name: 'Cycle Day', desc: 'Current cycle day' },
      { id: 'fertile-window', name: 'Fertile Window', desc: 'Fertility status today' },
      { id: 'ovulation', name: 'Ovulation', desc: 'Ovulation prediction' },
      { id: 'period-countdown', name: 'Period', desc: 'Days until next period' },
    ],
  },
  {
    key: 'body',
    label: 'BODY & HEALTH',
    widgets: [
      { id: 'temperature', name: 'Temperature', desc: 'Basal body temperature' },
      { id: 'mood', name: 'Mood', desc: "Today's mood" },
      { id: 'sleep', name: 'Sleep', desc: "Last night's sleep" },
      { id: 'stress', name: 'Stress', desc: 'Stress level today' },
      { id: 'water', name: 'Water', desc: 'Hydration tracker' },
    ],
  },
  {
    key: 'partner',
    label: 'PARTNER & CONNECTION',
    widgets: [
      { id: 'partner-needs', name: 'Partner Needs', desc: 'What your partner needs today' },
      { id: 'alignment-score', name: 'Alignment', desc: 'Weekly check-in score' },
      { id: 'partner-mood', name: 'Partner Mood', desc: 'How your partner is feeling' },
      { id: 'partner-streak', name: 'Streak', desc: "Days you've both logged" },
    ],
  },
  {
    key: 'ivf',
    label: 'IVF & TREATMENT',
    widgets: [
      { id: 'ivf-phase', name: 'IVF Phase', desc: 'Current treatment phase' },
      { id: 'medication', name: 'Medication', desc: "Today's reminders" },
      { id: 'appointment', name: 'Next Appointment', desc: 'Upcoming appointment' },
      { id: 'tww-countdown', name: 'Two-Week Wait', desc: 'TWW countdown' },
    ],
  },
  {
    key: 'lifestyle',
    label: 'LIFESTYLE',
    widgets: [
      { id: 'heat-exposure', name: 'Heat', desc: 'Heat exposure today' },
      { id: 'sperm-health-tip', name: 'Sperm Health', desc: "Today's tip" },
      { id: 'exercise', name: 'Exercise', desc: 'Activity today' },
      { id: 'substance-streak', name: 'Substance Streak', desc: 'Substance-free days' },
    ],
  },
  {
    key: 'insights',
    label: 'INSIGHTS & AI',
    widgets: [
      { id: 'insight', name: 'Daily Insight', desc: 'AI-powered message' },
      { id: 'did-you-know', name: 'Did You Know', desc: 'Rotating fertility fact' },
      { id: 'article-rec', name: 'Article', desc: 'Recommended reading' },
    ],
  },
  {
    key: 'calendar',
    label: 'CALENDAR',
    widgets: [
      { id: 'week-calendar', name: 'This Week', desc: '7-day calendar strip' },
      { id: 'appointment-countdown', name: 'Next Appointment', desc: 'Countdown to appointment' },
    ],
  },
  {
    key: 'wellbeing',
    label: 'WELLBEING',
    widgets: [
      { id: 'gratitude', name: 'Gratitude', desc: 'Daily journal prompt' },
      { id: 'affirmation', name: 'Affirmation', desc: 'Daily affirmation' },
      { id: 'milestone', name: 'Milestone', desc: 'Journey milestones' },
    ],
  },
  {
    key: 'actions',
    label: 'QUICK ACTIONS',
    widgets: [
      { id: 'check-in-cta', name: 'Check-in', desc: "Begin today's check-in" },
      { id: 'log-quick', name: 'Quick Log', desc: 'Fast logging shortcut' },
      { id: 'export', name: 'Export', desc: 'Export for doctor' },
    ],
  },
];
