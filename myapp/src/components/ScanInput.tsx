import React, { useState } from "react";
import { sendScanEvent } from "../services/api";
import { saveOffline } from "../services/offlineQueue";

import { useDualQrStore } from "../store/qrDualStore";           // QR #1 (Magazyn) + QR #2 (Wózek)
import { useQrStore } from "../store/qrStore";                  // globalny QR header
import { useDeliveryStore } from "../store/deliveryStore";       // historia
import { useCurrentA1Store } from "../store/currentA1Store";     // aktualne części na A1
import { useMagazynHistoryStore } from "../store/magazynHistoryStore";

export default function ScanInput() {
  const [value, setValue] = useState("");

  // DUAL QR STATE (sessionId + oba starty)
  const { current, lastMagazynScan, lastWozekScan, setMagazynScan, setWozekScan, finalizePair, regenerateMagazyn, regenerateWozek } = useDualQrStore();
  const { sessionId } = current;
  const tsMagazyn = lastMagazynScan;
  const tsWozek = lastWozekScan;

  const addMagazynHistory = useMagazynHistoryStore((s) => s.addMagazynScan);
  const addWozekHistory = useMagazynHistoryStore((s) => s.addWozekScan);

  // A1 — lista części
  const isA1Part     = useDeliveryStore((s) => s.isA1Part);
  const addDelivery  = useDeliveryStore((s) => s.addDelivery);

  // A1 — stan aktualny
  const addCurrentA1 = useCurrentA1Store((s) => s.addOrUpdateItem);
  const regenerateGlobalQr = useQrStore((s) => s.regenerate);
  const hasPendingMagazyn = useMagazynHistoryStore((s) => s.entries.some((e) => !e.finalized));

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const raw = value.trim();
    console.log("[SCAN] ENTER:", raw);

    if (!raw) return;

    // --------------------------------------------------------------------
    // 1) QR JSON — dopasowujemy MAGAZYN lub WÓZEK (zawsze akceptowane)
    // --------------------------------------------------------------------
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const parsed = JSON.parse(raw);

        if (parsed.type === "MAGAZYN") {
          console.log("[QR#1] MAGAZYN scanned:", parsed);
          const parsedTs = typeof parsed.ts === "number" ? parsed.ts : Date.now();
          const parsedSid = parsed.sessionId ?? current.sessionId;

          // Accept MAGAZYN scans (MAGAZYN-first flow): create pending entry
          setMagazynScan(parsedTs);
          // zapis do historii magazynowych skanów
          try {
            addMagazynHistory(parsedSid, parsedTs);
          } catch (err) {
            console.warn('[HISTORY] addMagazynScan failed', err);
          }
          // broadcast to other tabs so they can finalize or show pending
          if (typeof BroadcastChannel !== "undefined") {
            const bc = new BroadcastChannel("logistic-scans");
            bc.postMessage({ type: "MAGAZYN", sessionId: parsedSid, ts: parsedTs });
            bc.close();
          }

          // odśwież wyświetlane QR magazynu and global header
          try {
            regenerateMagazyn?.();
            regenerateGlobalQr?.();
          } catch (err) {
            console.warn('[QR] regenerate after MAGAZYN scan failed', err);
          }
          setValue("");
          return;
        }

        if (parsed.type === "WOZEK") {
          console.log("[QR#2] WOZEK scanned:", parsed);
          const nowTs = Date.now();
          
          // Use sessionId from JSON or fallback to current sessionId
          // (should match MAGAZYN since we don't rotate until pair is finalized)
          const parsedSid = parsed.sessionId ?? current.sessionId;
          
          setWozekScan(nowTs);
          try {
            addWozekHistory(parsedSid, nowTs);
          } catch (err) {
            console.warn('[HISTORY] addWozekScan failed', err);
          }
          
          // Finalize this pair and start a new sessionId for next MAGAZYN
          try {
            finalizePair?.();
          } catch (err) {
            console.warn('[PAIR] finalizePair failed', err);
          }
          
          // broadcast WOZEK scan to other tabs
          if (typeof BroadcastChannel !== "undefined") {
            const bc = new BroadcastChannel("logistic-scans");
            bc.postMessage({ type: "WOZEK", sessionId: parsedSid, ts: nowTs });
            bc.close();
          }
          // odśwież wyświetlane QR wózka i globalny header
          try {
            regenerateWozek?.();
            regenerateGlobalQr?.();
          } catch (err) {
            console.warn('[QR] regenerate after WOZEK scan failed', err);
          }
          setValue("");
          return;
        }

      } catch (err) {
        console.warn("[QR] invalid JSON format", err);
      }
    }

    // --------------------------------------------------------------------
    // 2) SKAN KOMPONENTU NA LINII
    // (Zablokowany jeśli czekają nieukończone wpisy magazynowe)
    // --------------------------------------------------------------------
    if (hasPendingMagazyn) {
      console.warn('[BLOCK] Skan komponentu blokowany — oczekuje na skan wózka');
      return;
    }
    const now = Date.now();

    // Pobierz ostatnią sfinalizowaną parę z magazynHistoryStore
    const entries = useMagazynHistoryStore.getState().entries;
    const lastFinalized = entries.find((e) => e.finalized);
    
    let magToWozek: number | null = null;
    let wozekToLine: number | null = null;
    let magToLine: number | null = null;

    if (lastFinalized && lastFinalized.tsWozek) {
      // Użyj danych z ostatniej sfinalizowanej pary
      magToWozek = lastFinalized.magToWozek ?? null;
      
      // WÓZEK -> LINIA (od czasu skanowania wózka w sfinalizowanej parze)
      wozekToLine = now - lastFinalized.tsWozek;
      
      // MAGAZYN -> LINIA (od czasu magazynu w sfinalizowanej parze)
      if (lastFinalized.tsMagazyn) {
        magToLine = now - lastFinalized.tsMagazyn;
      }
      
      console.log("[TIMES from finalized]", {
        magToWozek,
        wozekToLine,
        magToLine,
        lastFinalizedSessionId: lastFinalized.sessionId
      });
    } else {
      console.warn('[TIMES] Brak sfinalizowanej pary magazyn-wózek');
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
        magToWozek: magToWozek,
        wozekToLine: wozekToLine,
        step: "LINIA",
      });

      // STAN AKTUALNY
      addCurrentA1({
        partCode: raw,
        arrivalTs: now,
        travelMs: magToLine ?? 0,
        lastStep: "LINIA",
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
      placeholder={hasPendingMagazyn ? "⏳ Czekam na skan Wózka..." : "Zeskanuj QR (magazyn/wózek) lub komponent linii…"}
      style={{
        fontSize: 28,
        padding: 12,
        width: "100%",
        background: hasPendingMagazyn ? "#fff3cd" : "#fff",
        color: "#333",
        borderBottom: hasPendingMagazyn ? "3px solid #ff9800" : "1px solid #ccc",
      }}
    />
  );
}