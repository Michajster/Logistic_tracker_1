// src/components/QrHeader.tsx
import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useQrStore } from "../store/qrStore";

export default function QrHeader() {
  const current = useQrStore((s) => s.current);
  const regenerate = useQrStore((s) => s.regenerate);

  // 🔁 AUTO-REFRESH QR co 60 sekund
  useEffect(() => {
    const id = setInterval(() => {
      regenerate();
      console.log("[QR] Auto-regenerated (60s)");
    }, 60_000); // 60 sec

    return () => clearInterval(id);
  }, [regenerate]);

  // Dane QR zakodowane jako JSON
  const qrPayload = JSON.stringify(current);

  return (
    <div
      style={{
        padding: 20,
        borderBottom: "1px solid #ccc",
        textAlign: "center",
        background: "#fafafa",
      }}
    >
      <h2 style={{ margin: "0 0 12px" }}>QR — znacznik czasu sesji</h2>

      <QRCodeSVG value={qrPayload} size={180} />

      <div style={{ marginTop: 12, fontSize: 14, color: "#555" }}>
        <div>
          Timestamp: <b>{current.ts}</b>
        </div>
        <div>
          Session: <code>{current.sid}</code>
        </div>
        <div style={{ marginTop: 6, color: "#888" }}>
          Auto-refresh co 60 sekund
        </div>
      </div>
    </div>
  );
}