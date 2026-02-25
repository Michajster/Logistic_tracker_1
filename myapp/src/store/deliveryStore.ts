
import { create } from "zustand";
import { LINE_A1_PARTS } from "../data/lineA1";

export type DeliveryRow = {
  id: string;
  lineId: "A1";
  partCode: string;
  startTs: number; // timestamp z QR (ms)
  endTs: number;   // timestamp skanu na linii (ms)
  travelMs: number;
  magToWozek?: number | null;
  wozekToLine?: number | null;
};

import type { ProcessStep } from "./processStep";
import { STEP_LINIA } from "./processStep";

export type DeliveryRowWithStep = DeliveryRow & { step: ProcessStep };

type DeliveryState = {
  lineA1Parts: string[];
  deliveries: DeliveryRow[];
  isA1Part: (code: string) => boolean;
  addDelivery: (row: Omit<DeliveryRow, "id" | "lineId"> & { step?: ProcessStep }) => void;
  clear: () => void;
};

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  lineA1Parts: LINE_A1_PARTS,
  deliveries: [],
  isA1Part: (code: string) => {
    const { lineA1Parts } = get();
    return lineA1Parts.includes(code);
  },
 
addDelivery: ({ partCode, startTs, endTs, travelMs, magToWozek, wozekToLine, step }) =>
  set((s) => ({
    deliveries: [
      {
        id: crypto.randomUUID(),
        lineId: "A1",
        partCode,
        startTs,
        endTs,
        travelMs,
        magToWozek: magToWozek ?? null,
        wozekToLine: wozekToLine ?? null,
        step: step ?? STEP_LINIA,
      } as unknown as DeliveryRowWithStep,
      ...s.deliveries,
    ].slice(0, 100),
  })),

  clear: () => set({ deliveries: [] }),
}));
