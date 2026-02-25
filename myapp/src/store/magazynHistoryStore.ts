import { create } from "zustand";

export type MagazynEntry = {
  id: string;
  sessionId: string;
  tsMagazyn: number | null;
  tsWozek: number | null;
  createdAt: number;
};

type MagazynHistoryState = {
  entries: MagazynEntry[];
  addMagazynScan: (sessionId: string, ts: number) => void;
  addWozekScan: (sessionId: string, ts: number) => void;
  clear: () => void;
};

export const useMagazynHistoryStore = create<MagazynHistoryState>((set) => ({
  entries: [],

  addMagazynScan: (sessionId, ts) =>
    set((state) => {
      const existing = state.entries.find((e) => e.sessionId === sessionId);
      if (existing) {
        // update existing entry's tsMagazyn
        return {
          entries: state.entries.map((e) =>
            e.sessionId === sessionId ? { ...e, tsMagazyn: ts } : e
          ),
        };
      }

      const entry: MagazynEntry = {
        id: crypto.randomUUID(),
        sessionId,
        tsMagazyn: ts,
        tsWozek: null,
        createdAt: Date.now(),
      };

      return { entries: [entry, ...state.entries] };
    }),

  addWozekScan: (sessionId, ts) =>
    set((state) => {
      const idx = state.entries.findIndex((e) => e.sessionId === sessionId);
      if (idx !== -1) {
        const entries = [...state.entries];
        entries[idx] = { ...entries[idx], tsWozek: ts };
        return { entries };
      }

      // if no matching magazyn found, create a stub entry with null tsMagazyn
      const entry: MagazynEntry = {
        id: crypto.randomUUID(),
        sessionId,
        tsMagazyn: null,
        tsWozek: ts,
        createdAt: Date.now(),
      };

      return { entries: [entry, ...state.entries] };
    }),

  clear: () => set({ entries: [] }),
}));
