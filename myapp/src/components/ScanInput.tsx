import React, { useState } from "react";
import { sendScanEvent } from "../services/api";
import { saveOffline } from "../services/offlineQueue";
import { useQrStore } from "../store/qrStore";

// QR timestamp store (start)
import { useScanStore } from "../store/scanStore";

// Historia pomiarów A1
import { useDeliveryStore as useA1 } from "../store/deliveryStore";

// Aktualny stan komponentów na A1
import { useCurrentA1Store } from "../store/currentA1Store";

export default function ScanInput() {
  const [value, setValue] = useState("");

  const regenerateQr = useQrStore((s) => s.regenerate);
  // AKTUALNY STAN A1 (itemy na linii)
  const addCurrentA1 = useCurrentA1Store((s) => s.addOrUpdateItem);

  // QR timestamp (start)
  const lastQrTs = useScanStore((s) => s.lastQrTs);
  const setLastQrTs = useScanStore((s) => s.setLastQrTs);

  // DETEKCJA KOMPONENTÓW A1 + historia transportów
  const isA1Part = useA1((s) => s.isA1Part);
  const addDelivery = useA1((s) => s.addDelivery);

  // --------------------------------------------
  // HANDLER ENTER / SKAN
  // --------------------------------------------
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const raw = value.trim();
    console.log("[SCAN] ENTER:", raw);

    if (!raw) return;

    // 1) MAGAZYN → QR: JSON {"ts":..., "sid":...}
if (raw.startsWith("{") && raw.endsWith("}")) {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.ts === "number") {
      // Save the QR 'start' timestamp for travel-time math
      setLastQrTs(parsed.ts);
      console.log("[QR] start timestamp set =", parsed.ts);

      // Immediately rotate the QR so the next 'start' uses a fresh code
      regenerateQr();
      console.log("[QR] regenerated for next run");

      setValue("");
      return; // QR is not a component scan
    }
  } catch (err) {
    console.warn("[QR] Invalid JSON:", err);
  }
}

    // --------------------------------------------
    // 2) SKAN KOMPONENTU NA LINII
    // --------------------------------------------
    const now = Date.now();
    let travelMs: number | null = null;

    if (typeof lastQrTs === "number") {
      travelMs = now - lastQrTs;
      console.log("[METRYKA] czas przejazdu =", travelMs, "ms");
    } else {
      console.warn("[WARN] Nie zeskanowano QR → brak lastQrTs");
    }

    // Jeżeli komponent należy do A1 → zapisujemy historię + stan bieżący
    if (isA1Part(raw) && typeof lastQrTs === "number") {
      // Historia pomiarów A1
      addDelivery({
        partCode: raw,
        startTs: lastQrTs,
        endTs: now,
        travelMs,
      });

      // Stan aktualny na A1
      addCurrentA1({
        partCode: raw,
        arrivalTs: now,
        travelMs,
      });

      console.log(`[A1] Dopisano rekord: ${raw} (travelMs=${travelMs}ms)`);
    }

    // --------------------------------------------
    // 3) WYSYŁKA DO BACKENDU
    // --------------------------------------------
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

  // --------------------------------------------
  // RENDER
  // --------------------------------------------
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