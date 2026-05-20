import { create } from 'zustand';

type TabBarState = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

export const useTabBarStore = create<TabBarState>((set) => ({
  hidden: false,
  setHidden: (hidden) => set({ hidden }),
}));
