
// src/pages/HomePage.tsx
import QrWozekHeader from "../components/QrWozekHeader";
import ScanInput from "../components/ScanInput";    // pole do skanów
import FactoryMap from "../components/FactoryMap";  // layout SVG
// (opcjonalnie) dev-przycisk startu QR
// import QuickStart from "../components/QuickStart";

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "center", padding: 12, borderBottom: "1px solid #eee" }}>
        <QrWozekHeader />
      </div>
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
