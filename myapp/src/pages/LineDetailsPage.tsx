
// src/pages/LineDetailsPage.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import A1CurrentList from "../components/A1CurrentList";
import A1ListAndTimes from "../components/A1ListAndTimes";

export default function LineDetailsPage() {
  const { lineId } = useParams<{ lineId: string }>();

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Szczegóły linii {lineId}</h2>
        <Link to="/">← Powrót do layoutu</Link>
      </div>

      {lineId === "A1" ? (
        <>
          {/* aktualny stan komponentów na A1 */}
          <A1CurrentList />
          {/* historia czasów QR→linia dla A1 */}
          <A1ListAndTimes />
        </>
      ) : (
        <p>Linia <b>{lineId}</b> nie ma jeszcze skonfigurowanych komponentów.</p>
      )}
    </div>
  );
}
