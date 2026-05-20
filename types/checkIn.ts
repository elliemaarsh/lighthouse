export type PeriodStatus =
  | 'period_started'
  | 'period_ongoing'
  | 'period_ended'
  | 'no_period';

export type TempUnit = 'F' | 'C';

export type CheckInData = {
  periodStatus: PeriodStatus | null;
  temperature: number | null;
  temperatureNotMeasured: boolean;
  tempUnit: TempUnit;
  mood: number | null;
  moodNote: string;
  symptoms: string[];
  notes: string;
};

export const initialCheckInData: CheckInData = {
  periodStatus: null,
  temperature: null,
  temperatureNotMeasured: false,
  tempUnit: 'F',
  mood: null,
  moodNote: '',
  symptoms: [],
  notes: '',
};

export type TodayLogSummary = CheckInData & {
  date: string;
};
