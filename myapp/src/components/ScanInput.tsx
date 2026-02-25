import React, { useState } from "react";
import { sendScanEvent } from "../services/api";
import { saveOffline } from "../services/offlineQueue";

import { useDualQrStore } from "../store/qrDualStore";           // QR #1 (Magazyn) + QR #2 (Wózek)
import { useQrStore } from "../store/qrStore";                  // globalny QR header
import { useDeliveryStore } from "../store/deliveryStore";       // historia
import { useCurrentA1Store } from "../store/currentA1Store";     // aktualne części na A1

export default function ScanInput() {
  const [value, setValue] = useState("");

  // DUAL QR STATE (sessionId + oba starty)
  const { current, lastMagazynScan, lastWozekScan, setMagazynScan, setWozekScan, regenerateMagazyn, regenerateWozek } = useDualQrStore();
  const { sessionId } = current;
  const tsMagazyn = lastMagazynScan;
  const tsWozek = lastWozekScan;

  // A1 — lista części
  const isA1Part     = useDeliveryStore((s) => s.isA1Part);
  const addDelivery  = useDeliveryStore((s) => s.addDelivery);

  // A1 — stan aktualny
  const addCurrentA1 = useCurrentA1Store((s) => s.addOrUpdateItem);
  const regenerateGlobalQr = useQrStore((s) => s.regenerate);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const raw = value.trim();
    console.log("[SCAN] ENTER:", raw);

    if (!raw) return;

    // --------------------------------------------------------------------
    // 1) QR JSON — dopasowujemy MAGAZYN lub WÓZEK
    // --------------------------------------------------------------------
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const parsed = JSON.parse(raw);

        if (parsed.type === "MAGAZYN") {
          console.log("[QR#1] MAGAZYN scanned:", parsed);
          setMagazynScan(parsed.ts);
          setValue("");
          return;
        }

        if (parsed.type === "WOZEK") {
          console.log("[QR#2] WOZEK scanned:", parsed);
          setWozekScan(Date.now());
          setValue("");
          return;
        }

      } catch (err) {
        console.warn("[QR] invalid JSON format", err);
      }
    }

    // --------------------------------------------------------------------
    // 2) SKAN KOMPONENTU NA LINII
    // --------------------------------------------------------------------
    const now = Date.now();

    let magToWozek: number | null = null;
    let wozekToLine: number | null = null;
    let magToLine: number | null = null;

    // MAGAZYN -> WÓZEK
    if (tsMagazyn !== null) {
      const end = tsWozek ?? now;
      magToWozek = end - tsMagazyn;
    }

    // WÓZEK -> LINIA
    if (tsWozek !== null) {
      wozekToLine = now - tsWozek;
    }

    // MAGAZYN -> LINIA (suma)
    if (tsMagazyn !== null) {
      magToLine = now - tsMagazyn;
    }

    console.log("[TIMES]", {
      magToWozek,
      wozekToLine,
      magToLine
    });

    // --------------------------------------------------------------------
    // 3) Jeśli komponent jest A1 → zapisujemy historię i aktualny stan
    // --------------------------------------------------------------------
    if (isA1Part(raw)) {
      // HISTORIA
      addDelivery({
        partCode: raw,
        startTs: tsMagazyn ?? now,
        endTs: now,
        travelMs: magToLine ?? 0,
      });

      // STAN AKTUALNY
      addCurrentA1({
        partCode: raw,
        arrivalTs: now,
        travelMs: magToLine ?? 0,
      });

      console.log(`[A1] Updated: ${raw}`, {
        sessionId,
        magToWozek,
        wozekToLine,
        magToLine
      });
    }

    // --------------------------------------------------------------------
    // 4) Wyślij EV na backend (opcjonalnie — ale nadal działa)
    // --------------------------------------------------------------------
    const evt = {
      code: raw,
      sessionId,
      ts: new Date(now).toISOString(),
      tsMagazyn,
      tsWozek,
      magToWozek,
      wozekToLine,
      magToLine,
      isA1: isA1Part(raw)
    };

    try {
      await sendScanEvent(evt);
      console.log("[REST] sent", evt);
    } catch (err) {
      console.error("[REST] failed", err);
      await saveOffline(evt);
    }

    // Po każdym poprawnym skanie komponentu odświeżamy wyświetlane kody
    try {
      regenerateMagazyn?.();
      regenerateWozek?.();
      regenerateGlobalQr?.();
    } catch (err) {
      console.warn('[QR] regenerate failed', err);
    }

    setValue("");
  };

  // --------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------
  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Zeskanuj QR (magazyn/wózek) lub komponent linii…"
      style={{ fontSize: 28, padding: 12, width: "100%" }}
    />
  );
}