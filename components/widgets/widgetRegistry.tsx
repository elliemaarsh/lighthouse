import type { ComponentType } from 'react';

import { AffirmationWidget } from '@/components/widgets/AffirmationWidget';
import { AlignmentScoreWidget } from '@/components/widgets/AlignmentScoreWidget';
import { AppointmentCountdownWidget } from '@/components/widgets/AppointmentCountdownWidget';
import { AppointmentWidget } from '@/components/widgets/AppointmentWidget';
import { ArticleRecWidget } from '@/components/widgets/ArticleRecWidget';
import { CheckInCTAWidget } from '@/components/widgets/CheckInCTAWidget';
import { CycleCounterWidget } from '@/components/widgets/CycleCounterWidget';
import { DidYouKnowWidget } from '@/components/widgets/DidYouKnowWidget';
import { ExerciseWidget } from '@/components/widgets/ExerciseWidget';
import { ExportWidget } from '@/components/widgets/ExportWidget';
import { FertileWindowWidget } from '@/components/widgets/FertileWindowWidget';
import { GratitudeWidget } from '@/components/widgets/GratitudeWidget';
import { HeatExposureWidget } from '@/components/widgets/HeatExposureWidget';
import { InsightWidget } from '@/components/widgets/InsightWidget';
import { IVFPhaseWidget } from '@/components/widgets/IVFPhaseWidget';
import { LogQuickWidget } from '@/components/widgets/LogQuickWidget';
import { MedicationWidget } from '@/components/widgets/MedicationWidget';
import { MilestoneWidget } from '@/components/widgets/MilestoneWidget';
import { MoodWidget } from '@/components/widgets/MoodWidget';
import { OvulationWidget } from '@/components/widgets/OvulationWidget';
import { PartnerMoodWidget } from '@/components/widgets/PartnerMoodWidget';
import { PartnerNeedsWidget } from '@/components/widgets/PartnerNeedsWidget';
import { PartnerStreakWidget } from '@/components/widgets/PartnerStreakWidget';
import { PeriodCountdownWidget } from '@/components/widgets/PeriodCountdownWidget';
import { SleepWidget } from '@/components/widgets/SleepWidget';
import { SpermHealthTipWidget } from '@/components/widgets/SpermHealthTipWidget';
import { StressWidget } from '@/components/widgets/StressWidget';
import { SubstanceStreakWidget } from '@/components/widgets/SubstanceStreakWidget';
import { TemperatureWidget } from '@/components/widgets/TemperatureWidget';
import { TwwCountdownWidget } from '@/components/widgets/TwwCountdownWidget';
import { WaterWidget } from '@/components/widgets/WaterWidget';
import { WeekCalendarWidget } from '@/components/widgets/WeekCalendarWidget';
import type { WidgetId } from '@/constants/widgets';

export const WIDGET_COMPONENTS: Record<WidgetId, ComponentType> = {
  'cycle-counter': CycleCounterWidget,
  'fertile-window': FertileWindowWidget,
  ovulation: OvulationWidget,
  'period-countdown': PeriodCountdownWidget,
  temperature: TemperatureWidget,
  mood: MoodWidget,
  sleep: SleepWidget,
  stress: StressWidget,
  water: WaterWidget,
  'partner-needs': PartnerNeedsWidget,
  'alignment-score': AlignmentScoreWidget,
  'partner-mood': PartnerMoodWidget,
  'partner-streak': PartnerStreakWidget,
  'ivf-phase': IVFPhaseWidget,
  medication: MedicationWidget,
  appointment: AppointmentWidget,
  'tww-countdown': TwwCountdownWidget,
  'heat-exposure': HeatExposureWidget,
  'sperm-health-tip': SpermHealthTipWidget,
  exercise: ExerciseWidget,
  'substance-streak': SubstanceStreakWidget,
  insight: InsightWidget,
  'did-you-know': DidYouKnowWidget,
  'article-rec': ArticleRecWidget,
  'week-calendar': WeekCalendarWidget,
  'appointment-countdown': AppointmentCountdownWidget,
  gratitude: GratitudeWidget,
  affirmation: AffirmationWidget,
  milestone: MilestoneWidget,
  'check-in-cta': CheckInCTAWidget,
  'log-quick': LogQuickWidget,
  export: ExportWidget,
};

export function renderWidget(id: WidgetId) {
  const Component = WIDGET_COMPONENTS[id];
  if (!Component) {
    return null;
  }
  return <Component />;
}
