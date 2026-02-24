
export async function sendScanEvent(ev: any) {
  const API_BASE = "https://turbo-yodel-r5g44pw7j4p3pj4r-8080.app.github.dev";

  const res = await fetch(`${API_BASE}/api/scan-events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ev),
  });

  if (!res.ok) {
    console.error("REST ERROR", res.status, res.statusText);
    throw new Error("Failed to send scan");
  }
  return res.json();
}
