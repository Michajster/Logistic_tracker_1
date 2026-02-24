
import { create } from "zustand";

export type Mode = "MAGAZYN" | "LINIA";

type ScanState = {
  mode: Mode;
  setMode: (m: Mode) => void;

  /**
   * Ostatni timestamp odczytany z QR (ms od epoch)
   * Wykorzystywany do obliczania czasu przejazdu (travelMs)
   */
  lastQrTs: number | null;
  setLastQrTs: (ts: number | null) => void;
};

export const useScanStore = create<ScanState>((set) => ({
  mode: "MAGAZYN",
  setMode: (m) => set({ mode: m }),

  lastQrTs: null,
  setLastQrTs: (ts) => set({ lastQrTs: ts }),
}));
