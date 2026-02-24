
import React, { useState } from "react";
import { sendScanEvent } from "../services/api";
import { saveOffline } from "../services/offlineQueue";
import { useScanStore } from "../store/scanStore";

export default function ScanInput() {
  const [value, setValue] = useState("");
  const mode = useScanStore((s) => s.mode);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("[ScanInput] ENTER pressed, value:", value);

      const code = value.trim();
      if (!code) return;

      const event = {
        code,
        mode,
        ts: new Date().toISOString(),
        source: "HID"
      };

      await sendScanEvent(event)
        .then(() => console.log("[REST] sent", event))
        .catch((err) => {
          console.error("[REST] failed", err);
          saveOffline(event);
        });

      setValue("");
    }
  };

  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Zeskanuj kod..."
      style={{ fontSize: 28, padding: 12, width: "100%" }}
    />
  );
}
