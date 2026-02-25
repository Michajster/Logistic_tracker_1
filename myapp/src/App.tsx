import React from "react";
import FactoryMap from "./components/FactoryMap";
import ScanInput from "./components/ScanInput";
import Header from "./components/Header";
import { useLayoutLive } from "./hooks/useLayoutLive";
import QrHeader from "./components/QrHeader";
import A1ListAndTimes from "./components/A1ListAndTimes";
import A1CurrentList from "./components/A1CurrentList";

export default function App() {
  useLayoutLive();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <QrHeader />

       <A1CurrentList />

      <A1ListAndTimes />


            <div style={{ padding: 20 }}>
        <ScanInput />
      </div>
      <div style={{ flex: 1, padding: 20 }}>
        <FactoryMap />
      </div>
    </div>
  );
}