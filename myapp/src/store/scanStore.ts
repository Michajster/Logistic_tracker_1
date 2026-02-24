
import { create } from "zustand";

type ScanState = {
  lastQrTs: number | null;
  setLastQrTs: (ts: number | null) => void;
};

export const useScanStore = create<ScanState>((set) => ({
  lastQrTs: null,
  setLastQrTs: (ts) => set({ lastQrTs: ts }),
}));
