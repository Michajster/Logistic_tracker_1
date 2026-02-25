import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useDualQrStore } from "../store/qrDualStore";
import { useMagazynHistoryStore } from "../store/magazynHistoryStore";

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

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>QR #1 — Magazyn (wydanie części)</h2>

      <QRCodeSVG key={`${current.sessionId}-${current.tsMagazyn}`} value={payload} size={200} />

      <div style={{ marginTop: 15 }}>
        <p><b>sessionId:</b> {current.sessionId}</p>
        <p><b>tsMagazyn:</b> {current.tsMagazyn}</p>
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
                <th style={{ padding: 6 }}>Magazyn (ts)</th>
                <th style={{ padding: 6 }}>Wózek (ts)</th>
                <th style={{ padding: 6 }}>Dodano</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                  <td style={{ padding: 6 }}>{h.sessionId}</td>
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