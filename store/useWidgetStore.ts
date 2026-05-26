import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  CARRYING_DEFAULT_WIDGETS,
  NON_CARRYING_DEFAULT_WIDGETS,
  type WidgetId,
} from '@/constants/widgets';
import { getUserStorage, isClient } from '@/lib/storage';
import type { UserRole } from '@/store/useUserStore';

const WIDGET_STORAGE_KEY = 'lighthouse-widgets';

type WidgetStore = {
  activeWidgets: WidgetId[];
  setActiveWidgets: (widgets: WidgetId[]) => void;
  addWidget: (id: WidgetId) => void;
  removeWidget: (id: WidgetId) => void;
};

export function defaultWidgetsForRole(role: UserRole | null): WidgetId[] {
  if (role === 'non-carrying') {
    return [...NON_CARRYING_DEFAULT_WIDGETS];
  }
  return [...CARRYING_DEFAULT_WIDGETS];
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set, get) => ({
      activeWidgets: [],
      setActiveWidgets: (widgets) => set({ activeWidgets: widgets }),
      addWidget: (id) => {
        set((state) => {
          if (state.activeWidgets.includes(id)) return state;
          const withoutCta = state.activeWidgets.filter((w) => w !== 'check-in-cta');
          return {
            activeWidgets: [...withoutCta, id, 'check-in-cta'],
          };
        });
      },
      removeWidget: (id) => {
        if (id === 'check-in-cta') return;
        set((state) => ({
          activeWidgets: state.activeWidgets.filter((w) => w !== id),
        }));
      },
    }),
    {
      name: WIDGET_STORAGE_KEY,
      storage: createJSONStorage(getUserStorage),
      skipHydration: !isClient,
    },
  ),
);
