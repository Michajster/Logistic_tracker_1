import { create } from "zustand";

export type QrPayload = {
  ts: number;   // epoch ms
  sid: string;  // session id
};

type QrState = {
  current: QrPayload;
  regenerate: () => void;
  setFromValue: (v: QrPayload) => void; // optional setter if you ever need to restore
};

const makePayload = (): QrPayload => ({
  ts: Date.now(),
  sid: crypto.randomUUID(),
});

export const useQrStore = create<QrState>((set) => ({
  current: makePayload(),
  regenerate: () => set({ current: makePayload() }),
  setFromValue: (v) => set({ current: v }),
}));