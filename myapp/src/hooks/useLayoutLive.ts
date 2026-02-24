
import { useEffect } from "react";
import { useInventoryStore } from "../store/inventoryStore";

export function useLayoutLive() {
  const updateStation = useInventoryStore((s) => s.updateStation);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://turbo-yodel-r5g44pw7j4p3pj4r-8080.app.github.dev/live"
    );

    ws.onopen = () => console.log("[WS] connected");
    ws.onerror = (e) => console.error("[WS] error", e);
    ws.onclose = () => console.warn("[WS] closed");

    ws.onmessage = (msg) => {
      console.log("[WS] message", msg.data);
      try {
        const data = JSON.parse(msg.data);
        if (data.type === "inventory_update") {
          updateStation(data.id, data.level);
        }
      } catch (e) {
        console.error("WS JSON parse error", e);
      }
    };

    return () => ws.close();
  }, [updateStation]);
}
