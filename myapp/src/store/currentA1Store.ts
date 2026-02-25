import { create } from "zustand";

export type A1CurrentItem = {
  id: string;
  partCode: string;
  arrivalTs: number;   // kiedy część dotarła na A1
  travelMs: number;    // czas przejazdu QR → linia
  lastStep?: string;
};

type CurrentA1State = {
  items: A1CurrentItem[];
  addOrUpdateItem: (item: Omit<A1CurrentItem, "id">) => void;
  removeItem: (code: string) => void;
  clear: () => void;
};

export const useCurrentA1Store = create<CurrentA1State>((set, _get) => ({
  items: [],

  addOrUpdateItem: ({ partCode, arrivalTs, travelMs, lastStep }: any) =>
    set((state) => {
      const others = state.items.filter(
        (x) => x.partCode.toUpperCase() !== partCode.toUpperCase()
      );

      return {
        items: [
          {
            id: crypto.randomUUID(),
            partCode,
            arrivalTs,
            travelMs,
            lastStep,
          },
          ...others,
        ],
      };
    }),

  removeItem: (code: string) =>
    set((state) => ({
      items: state.items.filter(
        (x) => x.partCode.toUpperCase() !== code.toUpperCase()
      ),
    })),

  clear: () => set({ items: [] }),
}));