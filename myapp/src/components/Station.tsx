
// src/components/Station.tsx
import React from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { useNavigate } from "react-router-dom";

type Props = { id: string; x: number; y: number };

export default function Station({ id, x, y }: Props) {
  const level = useInventoryStore((s) => s.stations[id]?.level ?? 0);
  const navigate = useNavigate();

  const color = level > 20 ? "#4caf50" : level > 5 ? "#ffb300" : "#e53935";

  return (
    <g
      onClick={() => navigate(`/line/${id}`)}
      style={{ cursor: "pointer" }}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/line/${id}`)}
    >
      <rect x={x} y={y} width={140} height={100} fill={color} stroke="#333" rx={6} />
      <text x={x + 70} y={y + 55} textAnchor="middle" fill="#fff" fontSize="22">
        {id}
      </text>
    </g>
  );
}
