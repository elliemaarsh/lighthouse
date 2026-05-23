import type { DailyLogEntry, PartnerLogEntry } from '@/lib/logsInRange';
import { moodLabel } from '@/constants/mood';

export type ReportSections = {
  cycleSummary: boolean;
  bbtChart: boolean;
  moodPatterns: boolean;
  symptomFrequency: boolean;
  medicationLog: boolean;
  observations: boolean;
};

export type MedicalReportInput = {
  userName: string;
  dateFrom: string;
  dateTo: string;
  generatedAt: string;
  isPartnerTrack: boolean;
  sections: ReportSections;
  dailyLogs: DailyLogEntry[];
  partnerLogs: PartnerLogEntry[];
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statRow(label: string, value: string): string {
  return `<div class="stat-row"><span class="stat-label">${escapeHtml(label)}</span><span class="stat-value">${escapeHtml(value)}</span></div>`;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isPeriodDay(status: DailyLogEntry['periodStatus']): boolean {
  return status === 'period_started' || status === 'period_ongoing';
}

function periodDays(logs: DailyLogEntry[]): number {
  return logs.filter((l) => isPeriodDay(l.periodStatus)).length;
}

function avgMood(logs: DailyLogEntry[]): string {
  const moods = logs.map((l) => l.mood).filter((m): m is number => m != null);
  if (!moods.length) return '—';
  const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
  return avg.toFixed(1);
}

function symptomCounts(logs: DailyLogEntry[]): string {
  const counts = new Map<string, number>();
  for (const log of logs) {
    for (const s of log.symptoms) {
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
  }
  if (!counts.size) return statRow('Symptoms logged', 'None in range');
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, n]) => statRow(name, `${n} day${n === 1 ? '' : 's'}`))
    .join('');
}

export function buildMedicalReportHtml(input: MedicalReportInput): string {
  const { userName, dateFrom, dateTo, generatedAt, sections, dailyLogs, partnerLogs, isPartnerTrack } =
    input;

  let body = '';

  if (!isPartnerTrack && sections.cycleSummary) {
    const daysLogged = dailyLogs.length;
    const periodCount = periodDays(dailyLogs);
    body += `<h2>Cycle Summary</h2>`;
    body += statRow('Days with logs', String(daysLogged));
    body += statRow('Period / heavy flow days', String(periodCount));
    if (daysLogged > 0) {
      const lengths: number[] = [];
      let run = 0;
      for (const log of dailyLogs) {
        if (isPeriodDay(log.periodStatus)) {
          run += 1;
        } else if (run > 0) {
          lengths.push(run);
          run = 0;
        }
      }
      if (run > 0) lengths.push(run);
      if (lengths.length) {
        const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        body += statRow('Avg period length (logged)', `${avgLen.toFixed(1)} days`);
      }
    }
    for (const log of dailyLogs.slice(-14)) {
      const status = log.periodStatus ?? '—';
      body += statRow(formatDate(log.date), status);
    }
  }

  if (!isPartnerTrack && sections.bbtChart) {
    body += `<h2>Temperature Log</h2>`;
    const temps = dailyLogs.filter((l) => l.temperature != null && !l.temperatureNotMeasured);
    if (!temps.length) {
      body += statRow('BBT entries', 'No temperatures in range');
    } else {
      for (const log of temps) {
        const unit = log.tempUnit === 'C' ? '°C' : '°F';
        body += statRow(formatDate(log.date), `${log.temperature}${unit}`);
      }
    }
  }

  if (!isPartnerTrack && sections.moodPatterns) {
    body += `<h2>Mood &amp; Symptoms</h2>`;
    body += statRow('Average mood score', avgMood(dailyLogs));
    body += symptomCounts(dailyLogs);
    for (const log of dailyLogs.filter((l) => l.mood != null).slice(-10)) {
      const label = moodLabel(log.mood) ?? String(log.mood);
      body += statRow(formatDate(log.date), label);
    }
  }

  if (!isPartnerTrack && sections.symptomFrequency) {
    body += `<h2>Symptom Frequency</h2>`;
    body += symptomCounts(dailyLogs);
  }

  if (!isPartnerTrack && sections.medicationLog) {
    body += `<h2>Medication / Supplements</h2>`;
    body += statRow('Note', 'Log medications in daily notes when applicable.');
    const notes = dailyLogs.filter((l) => l.notes?.trim());
    if (!notes.length) {
      body += statRow('Entries', 'None in range');
    } else {
      for (const log of notes) {
        body += statRow(formatDate(log.date), log.notes.trim());
      }
    }
  }

  if (!isPartnerTrack && sections.observations) {
    body += `<h2>Key Observations</h2>`;
    const withNotes = dailyLogs.filter((l) => l.moodNote?.trim() || l.notes?.trim());
    if (!withNotes.length) {
      body += statRow('Notes', 'None in range');
    } else {
      for (const log of withNotes) {
        const text = [log.moodNote, log.notes].filter(Boolean).join(' — ');
        body += statRow(formatDate(log.date), text);
      }
    }
  }

  if (isPartnerTrack) {
    body += `<h2>Partner Health Log</h2>`;
    body += statRow('Days logged', String(partnerLogs.length));
    for (const log of partnerLogs) {
      const parts: string[] = [];
      if (log.sleepHours != null) parts.push(`Sleep ${log.sleepHours}h`);
      if (log.exerciseMinutes != null) parts.push(`Exercise ${log.exerciseMinutes}m`);
      if (log.stressLevel != null) parts.push(`Stress ${log.stressLevel}/5`);
      if (log.substances.length) parts.push(log.substances.join(', '));
      body += statRow(formatDate(log.date), parts.join(' · ') || 'Logged');
      if (log.notes?.trim()) {
        body += statRow('Notes', log.notes.trim());
      }
    }
  }

  if (!body) {
    body = statRow('Report', 'No sections selected or no data in range.');
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * {
    color: #000000;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 40px;
    color: #000000;
    max-width: 800px;
    margin: 0 auto;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 4px;
  }
  h2 {
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #000000;
    margin-top: 32px;
    margin-bottom: 12px;
    border-bottom: 1px solid #000000;
    padding-bottom: 8px;
  }
  .meta {
    font-size: 13px;
    color: #000000;
    margin-bottom: 32px;
  }
  .stat-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #000000;
    font-size: 14px;
    gap: 16px;
    color: #000000;
  }
  .stat-label {
    color: #000000;
    flex-shrink: 0;
  }
  .stat-value {
    color: #000000;
    font-weight: 600;
    text-align: right;
  }
  .note {
    font-size: 12px;
    color: #000000;
    margin-top: 48px;
    text-align: center;
    font-style: italic;
  }
</style>
</head>
<body>
  <h1>Lighthouse Health Report</h1>
  <div class="meta">
    Patient: ${escapeHtml(userName || 'Lighthouse user')} ·
    Generated: ${escapeHtml(formatDate(generatedAt.slice(0, 10)))} ·
    Period: ${escapeHtml(formatDate(dateFrom))} to ${escapeHtml(formatDate(dateTo))}
  </div>
  ${body}
  <p class="note">
    Generated by Lighthouse · For clinical reference only ·
    Not a substitute for medical advice
  </p>
</body>
</html>`;
}
