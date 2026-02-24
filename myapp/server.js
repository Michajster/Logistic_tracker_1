// server.js — mock backend: REST + WebSocket
import http from 'http';
import { WebSocketServer } from 'ws';
import url from 'url';

const PORT = 8080;

const server = http.createServer(async (req, res) => {
  // CORS dla frontu (Vite dev server)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.method === 'POST' && req.url === '/api/scan-events') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const ev = JSON.parse(body || '{}');
    console.log('[SCAN]', ev);

    // Demo: aktualizuj poziom A1
    broadcast({ type: 'inventory_update', id: 'A1', level: Math.floor(Math.random() * 35) });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ noServer: true });
const clients = new Set();
function broadcast(obj) {
  const data = JSON.stringify(obj);
  for (const ws of clients) ws.readyState === 1 && ws.send(data);
}

server.on('upgrade', (request, socket, head) => {
  const { pathname } = url.parse(request.url);
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      clients.add(ws);
      ws.on('close', () => clients.delete(ws));
      ws.send(JSON.stringify({ type: 'hello', t: Date.now() }));
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => console.log(`Mock backend: http://localhost:${PORT}`));