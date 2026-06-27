import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ContestState {
  isFreezeMode: boolean;
  toggleFreezeMode: () => void;
}

export const useContestStore = create<ContestState>()(
  persist(
    (set) => ({
      isFreezeMode: false,
      toggleFreezeMode: () => set((state) => ({ isFreezeMode: !state.isFreezeMode })),
    }),
    {
      name: 'contest-storage', // key in local storage
    }
  )
);
