import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useDualQrStore } from "../store/qrDualStore";

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

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>QR #1 — Magazyn (wydanie części)</h2>

      <QRCodeSVG value={payload} size={200} />

      <div style={{ marginTop: 15 }}>
        <p><b>sessionId:</b> {current.sessionId}</p>
        <p><b>tsMagazyn:</b> {current.tsMagazyn}</p>
      </div>
    </div>
  );
}