
import { create } from "zustand";

type StationsState = {
  stations: Record<string, { level: number }>;
  updateStation: (id: string, level: number) => void;
};

export const useInventoryStore = create<StationsState>((set) => ({
  stations: {},
  updateStation: (id, level) =>
    set((state) => ({
      stations: { ...state.stations, [id]: { level } }
    }))
}));
