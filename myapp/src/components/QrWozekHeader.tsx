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
    ts: current.tsMagazyn, // magazyn timestamp stays constant!
    tsWozek: Date.now(),
    type: "WOZEK",
  });

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>QR #2 — Wózek przed wyjazdem</h2>

      <QRCodeSVG value={payload} size={200} />

      <div style={{ marginTop: 15 }}>
        <p><b>sessionId:</b> {current.sessionId}</p>
        <p><b>tsMagazyn:</b> {current.tsMagazyn}</p>
        <p><b>tsWozek:</b> {current.tsWozek ?? "—"}</p>
      </div>
    </div>
  );
}