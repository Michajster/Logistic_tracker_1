
// src/components/Header.tsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const linkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 12px",
    marginRight: 8,
    borderRadius: 6,
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
      
      <NavLink to="/qr/magazyn">QR Magazyn</NavLink>
      <NavLink to="/qr/wozek">QR Wózek</NavLink>

    </div>
  );
}
