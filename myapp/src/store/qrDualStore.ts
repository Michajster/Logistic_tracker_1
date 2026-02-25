import { create } from "zustand";

export type DualQrPayload = {
  sessionId: string;
  tsMagazyn: number; // timestamp used for displayed MAGAZYN QR
  tsWozek: number | null; // timestamp used for displayed WOZEK QR
};

const makeSession = (): DualQrPayload => ({
  sessionId: crypto.randomUUID(),
  tsMagazyn: Date.now(),
  tsWozek: null,
});

type DualQrState = {
  current: DualQrPayload;
  // last scanned values (used for timing calculations)
  lastMagazynScan: number | null;
  lastWozekScan: number | null;
  regenerateMagazyn: () => void;
  regenerateWozek: () => void;
  setMagazynScan: (ts: number) => void; // record scanned ts (keep sessionId for WOZEK pairing)
  setWozekScan: (ts: number) => void; // record scanned ts and start new pair
  finalizePair: () => void; // finalize pair and create new sessionId
};

export const useDualQrStore = create<DualQrState>((set, _get) => ({
  current: makeSession(),
  lastMagazynScan: null,
  lastWozekScan: null,

  regenerateMagazyn: () =>
    set({
      current: {
        ...makeSession(),
      },
    }),

  regenerateWozek: () =>
    set((state) => ({
      current: {
        ...state.current,
        tsWozek: Date.now(),
      },
    })),

  setMagazynScan: (ts: number) =>
    set((state) => ({
      // keep scanned ts for calculations, but keep sessionId same for WOZEK pairing
      lastMagazynScan: ts,
      current: {
        ...state.current,
        tsMagazyn: ts,
      },
    })),

  setWozekScan: (ts: number) =>
    set((state) => ({
      lastWozekScan: ts,
      current: {
        ...state.current,
        tsWozek: ts,
      },
    })),

  finalizePair: () =>
    set(() => ({
      current: makeSession(),
      lastMagazynScan: null,
      lastWozekScan: null,
    })),
}));