import type { PartnerCategoryId } from '@/types/partnerLog';

export const PARTNER_CATEGORIES: PartnerCategoryId[] = [
  'sleep',
  'exercise',
  'heat',
  'substances',
  'stress',
  'notes',
];

export const PARTNER_CATEGORY_LABELS: Record<PartnerCategoryId, string> = {
  sleep: 'SLEEP',
  exercise: 'EXERCISE',
  heat: 'HEAT',
  substances: 'SUBSTANCES',
  stress: 'STRESS',
  notes: 'NOTES',
};

/** Day-of-week tips (0 = Sunday in JS getDay()) */
export const PARTNER_TIPS_BY_DAY: Record<number, string> = {
  0: 'Chronic stress elevates cortisol which can suppress testosterone. Take a moment today.',
  1: 'Avoid hot tubs and saunas — heat above 99°F can reduce sperm production for up to 3 months.',
  2: 'Aim for 7–9 hours of sleep. Poor sleep lowers testosterone and affects sperm quality.',
  3: '30 minutes of moderate exercise today supports healthy hormone levels.',
  4: 'Staying hydrated improves semen volume. Aim for 8 glasses today.',
  5: 'Antioxidant-rich foods like berries, nuts, and leafy greens protect sperm from oxidative stress.',
  6: 'Limit alcohol to 1–2 drinks. Heavy drinking reduces sperm count and motility.',
};

export const STRESS_LEVELS = [
  { level: 1, label: 'Calm', description: 'Feeling relaxed and at ease' },
  { level: 2, label: 'Low', description: 'Mild background tension' },
  { level: 3, label: 'Moderate', description: 'Noticeably stressed' },
  { level: 4, label: 'High', description: 'Overwhelmed or anxious' },
  { level: 5, label: 'Peak', description: 'Very difficult day' },
] as const;

export const HEAT_OPTIONS = [
  { value: 'low' as const, title: 'Low — Normal daily activity' },
  { value: 'medium' as const, title: 'Medium — Hot shower, brief sun exposure' },
  { value: 'high' as const, title: 'High — Sauna, hot tub, or prolonged heat' },
];

export const SUBSTANCE_OPTIONS = [
  'Alcohol',
  'Caffeine (3+ cups)',
  'Smoking',
  'Cannabis',
  'Recreational drugs',
  'None',
] as const;

export const EXERCISE_TYPES = [
  'Walking',
  'Running',
  'Gym',
  'Cycling',
  'Yoga',
  'Swimming',
  'Other',
] as const;

export const SLEEP_QUICK_HOURS = ['6', '7', '7.5', '8', '9'] as const;

export const NOTE_QUICK_INSERTS = [
  'Feeling supportive',
  'Stressful day',
  'Feeling hopeful',
] as const;
