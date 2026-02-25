
// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LineDetailsPage from "./pages/LineDetailsPage";
import { useLayoutLive } from "./hooks/useLayoutLive";

export default function App() {
  useLayoutLive(); // live update mapy (zostaje)

  return (
    <>
      <Header />
      <Routes>
        
        <Route path="/qr/magazyn" element={<QrMagazynPage />} />
        <Route path="/qr/wozek" element={<QrWozekHeader />} />
        
        <Route path="/" element={<HomePage />} />
        <Route path="/line/:lineId" element={<LineDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
