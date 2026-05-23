import { fetchPartnerLogForToday } from '@/lib/partnerLogs';
import { ensureLocalUserId } from '@/lib/localUserId';
import { initialPartnerLog } from '@/types/partnerLog';
import type { PartnerLogData } from '@/types/partnerLog';

/** In-memory cache for today's partner log (hydrated on Track focus). */
let todayPartnerLog: PartnerLogData = initialPartnerLog;

export const partnerLogSession = {
  getToday: (): PartnerLogData => todayPartnerLog,
  setToday: (log: PartnerLogData) => {
    todayPartnerLog = log;
  },
  async hydrate(userId: string | null): Promise<PartnerLogData> {
    const uid = userId ?? ensureLocalUserId();
    const { data } = await fetchPartnerLogForToday(uid);
    todayPartnerLog = data ?? initialPartnerLog;
    return todayPartnerLog;
  },
};
