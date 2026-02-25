import { create } from "zustand";

export type DualQrPayload = {
  sessionId: string;
  tsMagazyn: number;  // timestamp QR #1
  tsWozek: number | null; // timestamp QR #2 (gdy zeskanowany)
};

const makeSession = (): DualQrPayload => ({
  sessionId: crypto.randomUUID(),
  tsMagazyn: Date.now(),
  tsWozek: null,
});

type DualQrState = {
  current: DualQrPayload;
  regenerateMagazyn: () => void;
  regenerateWozek: () => void;
  setMagazynScan: (ts: number) => void;
  setWozekScan: (ts: number) => void;
};

export const useDualQrStore = create<DualQrState>((set, get) => ({
  current: makeSession(),

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
      current: {
        ...state.current,
        tsMagazyn: ts,
      },
    })),

  setWozekScan: (ts: number) =>
    set((state) => ({
      current: {
        ...state.current,
        tsWozek: ts,
      },
    })),
}));