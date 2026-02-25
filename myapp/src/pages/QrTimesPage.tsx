import { useDualQrStore } from "../store/qrDualStore";
import { useDeliveryStore } from "../store/deliveryStore";

const fmtDate = (ms: number | null) => (ms ? new Date(ms).toLocaleString() : "—");
const fmtMs = (ms: number | null) => {
  if (ms === null || ms === undefined) return "—";
  const s = Math.floor(ms / 1000);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

export default function QrTimesPage() {
  const { current } = useDualQrStore();
  const deliveries = useDeliveryStore((s) => s.deliveries);

  const magTs = current?.tsMagazyn ?? null;
  const wozTs = current?.tsWozek ?? null;
  const delta = magTs && wozTs ? wozTs - magTs : null;

  return (
    <div style={{ padding: 20 }}>
      <h2>Czasy QR — magazyn ↔ wózek</h2>

      <section style={{ marginBottom: 20 }}>
        <h3>Aktualna sesja</h3>
        <div>Session ID: <code>{current.sessionId}</code></div>
        <div>Magazyn (ts): <b>{fmtDate(magTs)}</b></div>
        <div>Wózek (ts): <b>{fmtDate(wozTs)}</b></div>
        <div>Różnica (wózek − magazyn): <b>{fmtMs(delta)}</b></div>
      </section>

      <section>
        <h3>Najnowsze dostawy (A1)</h3>
        {deliveries.length === 0 ? (
          <div>Brak wpisów dostaw.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: 6 }}>Część</th>
                <th style={{ padding: 6 }}>Magazyn (ts)</th>
                <th style={{ padding: 6 }}>Linia (ts)</th>
                <th style={{ padding: 6 }}>Magazyn → Linia</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                  <td style={{ padding: 6 }}>{d.partCode}</td>
                  <td style={{ padding: 6 }}>{fmtDate(d.startTs)}</td>
                  <td style={{ padding: 6 }}>{fmtDate(d.endTs)}</td>
                  <td style={{ padding: 6 }}>{fmtMs(d.travelMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
