export type HeatLevel = 'low' | 'medium' | 'high';

export type PartnerLogData = {
  sleepHours: number | null;
  sleepMinutes: number | null;
  exerciseActive: boolean | null;
  exerciseMinutes: number | null;
  exerciseTypes: string[];
  heatLevel: HeatLevel | null;
  substances: string[];
  alcoholDrinks: number | null;
  stressLevel: number | null;
  notes: string;
};

export const initialPartnerLog: PartnerLogData = {
  sleepHours: null,
  sleepMinutes: null,
  exerciseActive: null,
  exerciseMinutes: null,
  exerciseTypes: [],
  heatLevel: null,
  substances: [],
  alcoholDrinks: null,
  stressLevel: null,
  notes: '',
};

export type PartnerCategoryId =
  | 'sleep'
  | 'exercise'
  | 'heat'
  | 'substances'
  | 'stress'
  | 'notes';
