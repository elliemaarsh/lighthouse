import type { Href } from 'expo-router';
import { create } from 'zustand';

import { routes } from '@/constants/routes';

/** Tab route names under `app/(tabs)/` */
export type TabName = 'index' | 'track' | 'connect' | 'learn' | 'community';

const TAB_HREFS: Record<TabName, Href> = {
  index: routes.home,
  track: routes.track,
  connect: routes.connect,
  learn: routes.learn,
  community: routes.community,
};

type TabBarState = {
  hidden: boolean;
  /** Last tab visited before switching — used when leaving community setup */
  lastTab: TabName;
  setHidden: (hidden: boolean) => void;
  setLastTab: (tab: TabName) => void;
};

export function hrefForTab(tab: TabName): Href {
  return TAB_HREFS[tab];
}

export const useTabBarStore = create<TabBarState>((set) => ({
  hidden: false,
  lastTab: 'index',
  setHidden: (hidden) => set({ hidden }),
  setLastTab: (lastTab) => set({ lastTab }),
}));
