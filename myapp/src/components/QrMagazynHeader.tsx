import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useDualQrStore } from "../store/qrDualStore";

export default function QrMagazynHeader() {
  const { current, regenerateMagazyn } = useDualQrStore();

  useEffect(() => {
    const id = setInterval(() => {
      regenerateMagazyn();
      console.log("[QR#1 Magazyn] auto-refreshed (header)");
    }, 60_000);

    return () => clearInterval(id);
  }, [regenerateMagazyn]);

  const payload = JSON.stringify({
    sessionId: current.sessionId,
    ts: current.tsMagazyn,
    type: "MAGAZYN",
  });

  return (
    <div style={{ padding: 12, textAlign: "center" }}>
      <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>Magazyn</h4>
      <QRCodeSVG key={`${current.sessionId}-${current.tsMagazyn}`} value={payload} size={160} />
      <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>
        <div>ts: {current.tsMagazyn}</div>
        <div style={{ marginTop: 4 }}><code>{current.sessionId}</code></div>
      </div>
    </div>
  );
}
