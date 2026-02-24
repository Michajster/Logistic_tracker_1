
import { useEffect } from "react";
import { useInventoryStore } from "../store/inventoryStore";

export function useLayoutLive() {
  const updateStation = useInventoryStore((s) => s.updateStation);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.cors.ws/?https://proglove-demo-api.onrender.com/live");

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === "inventory_update") {
          updateStation(data.id, data.level);
        }
      } catch {}
    };

    return () => ws.close();
  }, [updateStation]);
  
useEffect(() => {
  const ws = new WebSocket("wss://proglove-demo-api.fly.dev/live");

  ws.onopen = () => console.log("[WS] connected");
  ws.onerror = (e) => console.error("[WS] error", e);
  ws.onclose = (e) => console.warn("[WS] closed", e.code, e.reason);
  ws.onmessage = (msg) => {
    console.log("[WS] message", msg.data);
    try {
      const data = JSON.parse(msg.data);
      if (data.type === "inventory_update") {
        updateStation(data.id, data.level);
      }
    } catch (err) {
      console.warn("WS JSON parse error", err);
    }
  };

  return () => ws.close();
}, [updateStation]);

}
