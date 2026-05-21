export type AppointmentType = 'doctor' | 'scan' | 'blood' | 'ivf' | 'other';

export type IvfPhaseId = 'stimulation' | 'retrieval' | 'transfer' | 'two-week-wait';

export type PulseCheckRecord = {
  userId: string;
  weekStart: string;
  connectionScore: number;
  capacityScore: number;
  currentNeed: string;
  translatedNote: string | null;
};

export type SharingPrefs = {
  moodShared: boolean;
  symptomsShared: boolean;
  cycleShared: boolean;
};

export type Appointment = {
  id: string;
  userId: string;
  partnerId: string | null;
  title: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  type: AppointmentType;
  notes: string;
  shared: boolean;
};

export type IvfStatus = {
  currentPhase: IvfPhaseId;
  phaseStartDate: string | null;
};
