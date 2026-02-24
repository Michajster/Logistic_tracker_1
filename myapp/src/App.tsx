import React from "react";
import FactoryMap from "./components/FactoryMap";
import ScanInput from "./components/ScanInput";
import Header from "./components/Header";
import { useLayoutLive } from "./hooks/useLayoutLive";

export default function App() {
  useLayoutLive();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ padding: 20 }}>
        <ScanInput />
      </div>
      <div style={{ flex: 1, padding: 20 }}>
        <FactoryMap />
      </div>
    </div>
  );
}