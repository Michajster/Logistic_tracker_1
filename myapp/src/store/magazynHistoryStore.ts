import { create } from "zustand";

import type { ProcessStep } from "./processStep";
import { STEP_MAGAZYN, STEP_WOZEK } from "./processStep";

export type MagazynEntry = {
  id: string;
  sessionId: string;
  tsMagazyn: number | null;
  tsWozek: number | null;
  step: ProcessStep;
  magToWozek?: number | null;
  finalized?: boolean;
  completedAt?: number | null;
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
        // update existing entry's tsMagazyn and step
        return {
          entries: state.entries.map((e) =>
            e.sessionId === sessionId
              ? {
                  ...e,
                  tsMagazyn: ts,
                  step: STEP_MAGAZYN,
                  // if we already have tsWozek, finalize and compute difference
                  magToWozek: e.tsWozek != null ? (e.tsWozek - ts) : e.magToWozek ?? null,
                  finalized: e.tsWozek != null ? true : false,
                  completedAt: e.tsWozek != null ? Date.now() : e.completedAt ?? null,
                }
              : e
          ),
        };
      }

      const entry: MagazynEntry = {
        id: crypto.randomUUID(),
        sessionId,
        tsMagazyn: ts,
        tsWozek: null,
        step: STEP_MAGAZYN,
        magToWozek: null,
        finalized: false,
        completedAt: null,
        createdAt: Date.now(),
      };

      return { entries: [entry, ...state.entries] };
    }),

  addWozekScan: (sessionId, ts) =>
    set((state) => {
      const idx = state.entries.findIndex((e) => e.sessionId === sessionId);
      if (idx !== -1) {
        const entries = [...state.entries];
        const existing = entries[idx];
        const finalized = existing.tsMagazyn != null;
        entries[idx] = {
          ...existing,
          tsWozek: ts,
          step: STEP_WOZEK,
          magToWozek: existing.tsMagazyn != null ? (ts - existing.tsMagazyn) : existing.magToWozek ?? null,
          finalized: finalized,
          completedAt: finalized ? Date.now() : existing.completedAt ?? null,
        };
        // If finalized, move entry to top (most recent completed)
        if (finalized) {
          const e = entries.splice(idx, 1)[0];
          return { entries: [e, ...entries] };
        }
        return { entries };
      }

      // if no matching magazyn found, create a stub entry with null tsMagazyn
      const entry: MagazynEntry = {
        id: crypto.randomUUID(),
        sessionId,
        tsMagazyn: null,
        tsWozek: ts,
        step: STEP_WOZEK,
        magToWozek: null,
        finalized: false,
        completedAt: null,
        createdAt: Date.now(),
      };

      return { entries: [entry, ...state.entries] };
    }),

  clear: () => set({ entries: [] }),
}));
