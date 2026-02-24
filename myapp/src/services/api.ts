
const API_BASE = "https://corsproxy.io/?https://proglove-demo-api.onrender.com";

export async function sendScanEvent(ev: any) {
  const res = await fetch(`${API_BASE}/api/scan-events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ev),
  });
  if (!res.ok) {
    throw new Error("Failed to send scan");
  }
  return res.json();
}
