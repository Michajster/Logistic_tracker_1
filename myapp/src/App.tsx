
// src/App.tsx
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LineDetailsPage from "./pages/LineDetailsPage";
import { useLayoutLive } from "./hooks/useLayoutLive";
import QrMagazynPage from "./pages/QrMagazynPage";
import QrTimesPage from "./pages/QrTimesPage";
import { useEffect } from "react";
import { clearAllData } from "./services/clearAllData";


export default function App() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Czyszczenie danych dla celów testowych: otwórz http://localhost:5175/#/?clear=true
    if (searchParams.get('clear') === 'true') {
      console.log('[TEST] Czyszczenie danych...');
      clearAllData();
      // Usuń parametr z URL
      window.location.hash = '/';
    }
  }, [searchParams]);

  useLayoutLive(); // live update mapy (zostaje)

  return (
    <>
      <Header />
      <Routes>
        
        <Route path="/qr/magazyn" element={<QrMagazynPage />} />
  <Route path="/qr/times" element={<QrTimesPage />} />
   
        <Route path="/" element={<HomePage />} />
        <Route path="/line/:lineId" element={<LineDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
