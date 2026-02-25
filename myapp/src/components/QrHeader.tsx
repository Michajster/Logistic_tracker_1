import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useQrStore } from "../store/qrStore";

export default function QrHeader() {
  const current = useQrStore((s) => s.current);   // { ts, sid }

  const qrPayload = JSON.stringify(current);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 20,
      borderBottom: "1px solid #ccc",
      background: "#fafafa"
    }}>
      <h2>QR — znacznik czasu sesji</h2>
      <QRCodeSVG value={qrPayload} size={180} />
      <p style={{ marginTop: 10 }}>
        Timestamp: <b>{current.ts}</b><br />
        Session: <code>{current.sid}</code>
      </p>
    </div>
  );
}