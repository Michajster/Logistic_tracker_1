import type { CSSProperties } from "react";
import { useCurrentA1Store } from "../store/currentA1Store";

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function A1CurrentList() {
  const items = useCurrentA1Store((s) => s.items);

  return (
    <div style={{ padding: "12px 20px", borderBottom: "1px solid #ddd" }}>
      <h3>Aktualne komponenty na A1</h3>

      {items.length === 0 && (
        <p style={{ color: "#777" }}>Brak zeskanowanych komponentów.</p>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th style={th}>Komponent</th>
            <th style={th}>Przyjazd</th>
            <th style={th}>Czas przejazdu</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td style={td}><code>{i.partCode}</code></td>
              <td style={td}>{new Date(i.arrivalTs).toLocaleTimeString()}</td>
              <td style={td}>{formatMs(i.travelMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: CSSProperties = { textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #ccc" };
const td: CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #eee" };