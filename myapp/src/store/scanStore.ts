
import { create } from "zustand";

type Mode = "MAGAZYN" | "LINIA";

export const useScanStore = create<{ mode: Mode; setMode: (m: Mode) => void }>((set) => ({
  mode: "MAGAZYN",
  setMode: (mode) => set({ mode })
}));
