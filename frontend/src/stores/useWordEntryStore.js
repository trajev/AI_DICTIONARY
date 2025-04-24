import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export const useWordEntryStore = create(
  devtools(
    persist(
      (set) => ({
        wordEntry: null, // store the entire word object
        setWordEntry: (entry) => set({ wordEntry: entry }),
        clearWordEntry: () => set({ wordEntry: null }),
      }),
      {
        name: 'word-entry-storage', // localStorage key
      }
    )
  )
);
