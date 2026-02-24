
import React, { useState } from "react";
import { sendScanEvent } from "../services/api";
import { saveOffline } from "../services/offlineQueue";
import { useScanStore } from "../store/scanStore";

/**
 * ScanInput
 * - przy Enter wysyła „skan” na backend (REST)
 * - rozpoznaje QR w formacie JSON: {"ts": <number>, "sid": "<uuid>"}
 * - zapisuje ostatni timestamp z QR do store (lastQrTs)
 * - mierzy czas od ostatniego QR do bieżącego skanu i loguje wynik
 * - buforuje offline przy błędzie
 */
export default function ScanInput() {
  const [value, setValue] = useState("");
  const mode = useScanStore((s) => s.mode);
  const lastQrTs = useScanStore((s) => s.lastQrTs);
  const setLastQrTs = useScanStore((s) => s.setLastQrTs);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const raw = value.trim();
    console.log("[ScanInput] ENTER pressed, value:", raw);

    if (!raw) return;

    // 1) Wykryj QR (JSON) i zapisz timestamp sesji
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const qr = JSON.parse(raw);
        if (typeof qr.ts === "number") {
          setLastQrTs(qr.ts);
          console.log(
            `[QR] zapisano lastQrTs=${qr.ts} (sid=${qr.sid ?? "—"})`
          );
          setValue("");
          return; // sam QR nie wysyłamy jako „scan-event”
        }
      } catch (err) {
        console.warn("[QR] Nieprawidłowy JSON w QR:", err);
        // kontynuujemy jak zwykły skan
      }
    }

    // 2) Jeśli mamy lastQrTs, policz czas od QR do skanu
    let travelMs: number | undefined;
    if (lastQrTs && Number.isFinite(lastQrTs)) {
      travelMs = Date.now() - lastQrTs;
      const sec = Math.round(travelMs / 1000);
      console.log(`[METRICS] czas od QR: ${sec}s (${travelMs} ms)`);
    }

    // 3) Zbuduj event i wyślij
    const event = {
      code: raw,
      mode,                         // "MAGAZYN" albo "LINIA"
      ts: new Date().toISOString(), // timestamp skanu
      source: "HID",                // skaner jako klawiatura
      lastQrTs: lastQrTs ?? null,   // ostatni QR (start)
      travelMs: travelMs ?? null    // różnica czasu (ms) jeśli dostępna
    };

    try {
      await sendScanEvent(event);
      console.log("[REST] sent", event);
    } catch (err) {
      console.error("[REST] failed", err);
      // bufor offline – wyśle się automatycznie później
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
      placeholder="Zeskanuj kod lub QR..."
      style={{ fontSize: 28, padding: 12, width: "100%" }}
    />
  );
}
