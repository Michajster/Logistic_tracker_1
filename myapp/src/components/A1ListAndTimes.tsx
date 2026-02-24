import React, { useMemo, useState } from "react";
import { useDeliveryStore } from "../store/deliveryStore";

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return hh !== "00" ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function A1ListAndTimes() {
  const lineA1Parts = useDeliveryStore((s) => s.lineA1Parts);
  const deliveries = useDeliveryStore((s) => s.deliveries);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return f
      ? deliveries.filter((d) => d.partCode.toLowerCase().includes(f))
      : deliveries;
  }, [deliveries, filter]);

  return (
    <div style={{ padding: "12px 20px", borderBottom: "1px solid #ddd", background: "#fafafa" }}>
      <h3 style={{ margin: "4px 0 12px" }}>Linia A1 — komponenty i czasy przejazdu</h3>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Lista komponentów A1 */}
        <div style={{ minWidth: 280 }}>
          <h4>Komponenty przypisane do A1</h4>
          <ul style={{ marginTop: 8 }}>
            {lineA1Parts.map((p) => (
              <li key={p} style={{ lineHeight: "1.8" }}>{p}</li>
            ))}
          </ul>
        </div>

        {/* Tabela z pomiarami */}
        <div style={{ flex: 1, minWidth: 420 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4>Ostatnie pomiary (QR → skan na linii)</h4>
            <input
              placeholder="Filtruj po numerze części…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: "6px 10px", fontSize: 14 }}
            />
          </div>

          <div style={{ overflowX: "auto", marginTop: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#eee" }}>
                  <th style={th}>Linia</th>
                  <th style={th}>Część</th>
                  <th style={th}>Start (QR)</th>
                  <th style={th}>Koniec (Skan)</th>
                  <th style={th}>Czas</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 12, textAlign: "center", color: "#666" }}>
                    Brak danych — zeskanuj QR, a następnie komponent przypisany do A1.
                  </td></tr>
                ) : (
                  filtered.map((d) => (
                    <tr key={d.id}>
                      <td style={td}>A1</td>
                      <td style={td}><code>{d.partCode}</code></td>
                      <td style={tdSmall}>{new Date(d.startTs).toLocaleTimeString()}</td>
                      <td style={tdSmall}>{new Date(d.endTs).toLocaleTimeString()}</td>
                      <td style={tdBold}>{formatMs(d.travelMs)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #ddd" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f0f0f0" };
const tdSmall: React.CSSProperties = { ...td, color: "#555", fontSize: 13 };
const tdBold: React.CSSProperties = { ...td, fontWeight: 600 };