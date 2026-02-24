import React from "react";
import Station from "./Station";
// Jeśli chcesz użyć gotowego pliku SVG jako komponentu: import LayoutSvg from "../assets/layout.svg?react";

export default function FactoryMap() {
  return (
    <svg viewBox="0 0 1200 800" style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}>
      {/* Obrys hali */}
      <rect x="10" y="10" width="1180" height="780" fill="#f5f5f5" stroke="#333" />
      {/* Przykładowa trasa pociągu */}
      <polyline points="100,200 1100,200" stroke="#999" strokeWidth={6} fill="none" />

      {/* Gniazda */}
      <Station id="A1" x={200} y={300} />
      <Station id="A2" x={500} y={300} />
      <Station id="A3" x={800} y={300} />
    </svg>
  );
}