
import React from "react";
import { useInventoryStore } from "../store/inventoryStore";

export default function Station({ id, x, y }) {
  const level = useInventoryStore((s) => s.stations[id]?.level ?? 0);

  const color =
    level > 20 ? "#4caf50" : level > 5 ? "#ffb300" : "#e53935";

  return (
    <g onClick={() => alert(`Gniazdo ${id}, poziom: ${level}`)} style={{ cursor: "pointer" }}>
      <rect x={x} y={y} width={140} height={100} fill={color} stroke="#333" />
      <text x={x + 70} y={y + 55} textAnchor="middle" fontSize="24" fill="white">
        {id}
      </text>
    </g>
  );
}
