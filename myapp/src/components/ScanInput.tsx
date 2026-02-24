
import React, { useState } from "react";
import { sendScanEvent } from "../services/api";
import { saveOffline } from "../services/offlineQueue";
import { useScanStore } from "../store/scanStore";
import { useDeliveryStore } from "../store/deliveryStore"; // tabela dla A1
import { useDeliveryStore as useA1 } from "../store/deliveryStore";

export default function ScanInput() {
  const [value, setValue] = useState("");

  const lastQrTs = useScanStore((s) => s.lastQrTs);
  const setLastQrTs = useScanStore((s) => s.setLastQrTs);

  const isA1Part = useA1((s) => s.isA1Part);
  const addDelivery = useA1((s) => s.addDelivery);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const raw = value.trim();
    console.log("[SCAN] ENTER:", raw);

    if (!raw) return;

    // -----------------------------------------------------------
    // 1) MAGAZYN → QR: JSON {"ts":..., "sid":...}
    // -----------------------------------------------------------
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed.ts === "number") {
          setLastQrTs(parsed.ts);
          console.log("[QR] zapisano timestamp startu =", parsed.ts);
          setValue("");
          return; // QR nie jest eventem części
        }
      } catch (err) {
        console.warn("Błędny format QR JSON", err);
      }
    }

    // -----------------------------------------------------------
    // 2) LINIA → skanujemy komponent
    // -----------------------------------------------------------
    const now = Date.now();

    let travelMs: number | null = null;

    if (typeof lastQrTs === "number") {
      travelMs = now - lastQrTs;
      console.log("[METRYKA] czas przejazdu =", travelMs, "ms");
    } else {
      console.warn("[WARN] Brak QR start → nie można policzyć travelMs");
    }

    // jeśli komponent należy do linii A1 → dopisujemy do tabeli
    if (isA1Part(raw) && typeof lastQrTs === "number") {
      addDelivery({
        partCode: raw,
        startTs: lastQrTs,
        endTs: now,
        travelMs,
      });
      console.log("[A1] Dopisano pomiar komponentu:", raw);
    }

    // -----------------------------------------------------------
    // 3) Wyślij event do backendu
    // -----------------------------------------------------------
    const event = {
      code: raw,
      ts: new Date(now).toISOString(),
      lastQrTs: lastQrTs ?? null,
      travelMs,
      isA1: isA1Part(raw),
    };

    try {
      await sendScanEvent(event);
      console.log("[REST] sent", event);
    } catch (err) {
      console.error("[REST] failed", err);
      await saveOffline(event);
    } finally {
      setValue("");
    }
  };

  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Zeskanuj QR (magazyn) lub komponent (linia)…"
      style={{ fontSize: 28, padding: 12, width: "100%" }}
    />
  );
}
