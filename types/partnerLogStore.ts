export type TodayLog = {
  sleep: { hours: number; minutes: number } | null;
  exercise: {
    active: boolean;
    minutes: number | null;
    types: string[];
  } | null;
  heat: string | null;
  substances: string[];
  alcoholDrinks: number;
  stress: number | null;
  notes: string | null;
  loggedAt: string | null;
};

export type PartnerWeekDayLog = TodayLog & { date: string };
