
// src/components/Header.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { clearAllData } from "../services/clearAllData";

export default function Header() {
  const linkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 12px",
    marginRight: 8,
    borderRadius: 6,
  };

  const buttonStyle: React.CSSProperties = {
    background: "#ff6b6b",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    marginLeft: "auto",
    fontSize: 14,
  };

  const handleClear = () => {
    if (confirm("Na pewno wyczyścić wszystkie dane?")) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div
      style={{
        background: "#222",
        color: "white",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <h2 style={{ margin: 0, marginRight: 12 }}>Tracking System</h2>
      <NavLink to="/" style={({ isActive }) => ({ ...linkStyle, background: isActive ? "#4caf50" : "#444" })}>
        Layout
      </NavLink>
      <NavLink
        to="/line/A1"
        style={({ isActive }) => ({ ...linkStyle, background: isActive ? "#4caf50" : "#444" })}
      >
        Linia A1
      </NavLink>
      <NavLink to="/qr/magazyn" style={({ isActive }) => ({ ...linkStyle, background: isActive ? "#4caf50" : "#444" })}>
        QR Magazyn
      </NavLink>
      
      <button style={buttonStyle} onClick={handleClear}>
        Wyczyść dane
      </button>
    </div>
  );
}
