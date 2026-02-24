
// server.js — backend REST + WebSocket
import http from "http";
import { WebSocketServer } from "ws";
import url from "url";

const PORT = 8080;

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/scan-events") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const event = JSON.parse(body || "{}");
    console.log("[SCAN]", event);

    broadcast({
      type: "inventory_update",
      id: "A1",
      level: Math.floor(Math.random() * 35),
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ noServer: true });
const clients = new Set();

function broadcast(msg) {
  const data = JSON.stringify(msg);
  for (const ws of clients) {
    if (ws.readyState === 1) ws.send(data);
  }
}

server.on("upgrade", (request, socket, head) => {
  const { pathname } = url.parse(request.url);
  if (pathname === "/live") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      clients.add(ws);
      ws.on("close", () => clients.delete(ws));
      ws.send(JSON.stringify({ type: "hello", t: Date.now() }));
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => console.log("Backend running on port", PORT));
