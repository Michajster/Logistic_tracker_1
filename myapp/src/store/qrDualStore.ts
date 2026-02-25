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
  setMagazynScan: (ts: number) => void; // record scanned ts and rotate displayed QR
  setWozekScan: (ts: number) => void; // record scanned ts and rotate displayed WOZEK QR
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
    set(() => ({
      // keep scanned ts for calculations, but rotate displayed QR for next use
      lastMagazynScan: ts,
      current: {
        ...makeSession(),
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
}));