import React, { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrHeader() {
  // Timestamp generowany przy załadowaniu strony
  const timestamp = useMemo(() => Date.now(), []);

  // Opcjonalnie: można dorzucić unikalne ID sesji
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  // Dane zakodowane w QR
  const qrPayload = JSON.stringify({
    ts: timestamp,
    sid: sessionId,
  });

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 20,
      borderBottom: "1px solid #ccc"
    }}>
      <h2>QR — znacznik czasu sesji</h2>
      <QRCodeSVG value={qrPayload} size={180} />
      <p style={{ marginTop: 10 }}>
        Timestamp: <b>{timestamp}</b>
      </p>
    </div>
  );
}