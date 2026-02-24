import React from "react";
import { useScanStore } from "../store/scanStore";

export default function Header() {
  const mode = useScanStore((s) => s.mode);
  const setMode = useScanStore((s) => s.setMode);

  return (
    <div
      style={{
        background: "#222",
        color: "white",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h2>Tracking System</h2>
      <div>
        <button
          onClick={() => setMode("MAGAZYN")}
          style={{
            marginRight: 10,
            background: mode === "MAGAZYN" ? "#4caf50" : "#555",
            color: "white",
            padding: "10px 20px"
          }}
        >
          MAGAZYN
        </button>
        <button
          onClick={() => setMode("LINIA")}
          style={{
            background: mode === "LINIA" ? "#4caf50" : "#555",
            color: "white",
            padding: "10px 20px"
          }}
        >
          LINIA
        </button>
      </div>
    </div>
  );
}