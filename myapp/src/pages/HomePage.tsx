
// src/pages/HomePage.tsx
import React from "react";
import QrHeader from "../components/QrHeader";      // QR z timestampem sesji
import ScanInput from "../components/ScanInput";    // pole do skanów
import FactoryMap from "../components/FactoryMap";  // layout SVG
// (opcjonalnie) dev-przycisk startu QR
// import QuickStart from "../components/QuickStart";

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      <QrHeader />
      {/* <QuickStart /> */}
      <div style={{ padding: 20 }}>
        <ScanInput />
      </div>
      <div style={{ flex: 1, padding: 20 }}>
        <FactoryMap />
      </div>
    </div>
  );
}
