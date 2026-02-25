import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useDualQrStore } from "../store/qrDualStore";

export default function QrWozekHeader() {
  const { current, regenerateWozek } = useDualQrStore();

  // auto refresh co 60s
  useEffect(() => {
    const id = setInterval(() => {
      regenerateWozek();
      console.log("[QR#2 Wózek] auto-refreshed");
    }, 60_000);

    return () => clearInterval(id);
  }, [regenerateWozek]);

  const payload = JSON.stringify({
    sessionId: current.sessionId,
    // session timestamp: prefer tsWozek (wózek), fallback to tsMagazyn
    ts: current.tsWozek ?? current.tsMagazyn,
    type: "WOZEK",
  });

  return (
    <div style={{ padding: 12, textAlign: "center" }}>
      <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>Wózek</h4>

      <QRCodeSVG key={`${current.sessionId}-${current.tsWozek ?? current.tsMagazyn}`} value={payload} size={160} />

      <div style={{ marginTop: 8, fontSize: 12 }}>
        <div><b>sessionId:</b> {current.sessionId}</div>
        <div><b>tsMagazyn:</b> {current.tsMagazyn}</div>
        <div><b>tsWozek:</b> {current.tsWozek ?? "—"}</div>
      </div>
    </div>
  );
}