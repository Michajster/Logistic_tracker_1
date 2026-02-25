import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useDualQrStore } from "../store/qrDualStore";
import { useMagazynHistoryStore } from "../store/magazynHistoryStore";
import { useQrStore } from "../store/qrStore";

export default function QrMagazynPage() {
  const { current, regenerateMagazyn } = useDualQrStore();

  // auto-refresh co 60s (magazyn)
  useEffect(() => {
    const id = setInterval(() => {
      regenerateMagazyn();
      console.log("[QR#1 Magazyn] auto-refreshed");
    }, 60_000);

    return () => clearInterval(id);
  }, [regenerateMagazyn]);

  const payload = JSON.stringify({
    sessionId: current.sessionId,
    ts: current.tsMagazyn,
    type: "MAGAZYN",
  });

  const history = useMagazynHistoryStore((s) => s.entries);

  const fmtDate = (ms: number | null) => (ms ? new Date(ms).toLocaleString() : "—");
  const [input, setInput] = useState("");
  const regenerateGlobalQr = useQrStore((s) => s.regenerate);

  // BroadcastChannel to sync scans across tabs
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bc = new BroadcastChannel("logistic-scans");
    bc.onmessage = (ev) => {
      try {
        const msg = ev.data;
        if (!msg || typeof msg !== "object") return;
        if (msg.type === "MAGAZYN") {
          // update local store and history
          const ts = msg.ts ?? Date.now();
          const sid = msg.sessionId ?? current.sessionId;
          // use stores directly
          // Note: import inside to avoid circular issues
          // setMagazynScan is available from useDualQrStore
          // call through window to prevent lint issues
          // We'll access stores by importing useDualQrStore above
          // but to keep code simple, call via custom event below
          // Instead, just add history and regenerate UI
          // (ScanInput in other tab will already have updated its own store)
          // Add history entry here too
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const addMag = useMagazynHistoryStore.getState().addMagazynScan;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const setMag = useDualQrStore.getState().setMagazynScan;
          addMag(sid, ts);
          setMag(ts);
          regenerateGlobalQr?.();
        }
      } catch (err) {
        console.warn("[BC] invalid message", err);
      }
    };

    return () => bc.close();
  }, [current.sessionId, regenerateGlobalQr]);

  const submitInput = () => {
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      if (parsed.type === "MAGAZYN") {
        const ts = typeof parsed.ts === "number" ? parsed.ts : Date.now();
        const sid = parsed.sessionId ?? current.sessionId;
        useMagazynHistoryStore.getState().addMagazynScan(sid, ts);
        useDualQrStore.getState().setMagazynScan(ts);
        // broadcast to other tabs
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("logistic-scans");
          bc.postMessage({ type: "MAGAZYN", sessionId: sid, ts });
          bc.close();
        }
        regenerateGlobalQr?.();
        setInput("");
      }
    } catch (err) {
      console.warn("Invalid JSON input", err);
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>QR #1 — Magazyn (wydanie części)</h2>

      <QRCodeSVG key={`${current.sessionId}-${current.tsMagazyn}`} value={payload} size={200} />

      <div style={{ marginTop: 15 }}>
        <p><b>sessionId:</b> {current.sessionId}</p>
        <p><b>tsMagazyn:</b> {current.tsMagazyn}</p>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}><b>Wklej/skanuj QR magazynowy (JSON) i naciśnij Enter:</b></label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitInput()}
            placeholder='{"type":"MAGAZYN","ts":1677320000000}'
            style={{ flex: 1, padding: 8, fontSize: 14 }}
          />
          <button onClick={submitInput} style={{ padding: "8px 12px" }}>Wyślij</button>
        </div>
      </div>

      <section style={{ marginTop: 24, textAlign: "left" }}>
        <h3>Historia skanów magazynu (ostatnie)</h3>
        {history.length === 0 ? (
          <div>Brak skanów magazynu.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: 6 }}>Session</th>
                <th style={{ padding: 6 }}>Krok</th>
                <th style={{ padding: 6 }}>Magazyn (ts)</th>
                <th style={{ padding: 6 }}>Wózek (ts)</th>
                <th style={{ padding: 6 }}>Dodano</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                    <td style={{ padding: 6 }}>{h.sessionId}</td>
                    <td style={{ padding: 6 }}>{h.step}</td>
                    <td style={{ padding: 6 }}>{fmtDate(h.tsMagazyn)}</td>
                    <td style={{ padding: 6 }}>{fmtDate(h.tsWozek)}</td>
                    <td style={{ padding: 6 }}>{new Date(h.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}