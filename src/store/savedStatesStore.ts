import { create } from 'zustand';
import { LevelState } from '../types';
import { devtools } from 'zustand/middleware';

interface SavedStatesStore {
  states: Record<string, LevelState>;
  saveState: (id: string, state: LevelState) => void;
  getState: (id: string) => LevelState | undefined;
  removeState: (id: string) => void;
  resetStore: () => void;
}

export const useSavedStates = create<SavedStatesStore>() (
  devtools((set, get) => ({
      states: {},
      saveState: (id, state) => set((prev) => ({ states: { ...prev.states, [id]: state } })),
      getState: (id) => get().states[id],
      removeState: (id) => set((prev) => {
        const { [id]: _, ...rest } = prev.states;
        return { states: rest };
      }),
      resetStore: () => set({ states: {} }),
    }),
    { name: 'SavedStates' }
  )
);