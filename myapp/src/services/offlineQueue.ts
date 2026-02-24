
import { openDB } from "idb";

const dbPromise = openDB("offline-scans", 1, {
  upgrade(db) {
    db.createObjectStore("queue", { keyPath: "ts" });
  }
});

export async function saveOffline(event: any) {
  const db = await dbPromise;
  await db.put("queue", event);
}

export async function getOffline() {
  const db = await dbPromise;
  return await db.getAll("queue");
}

export async function clearOffline() {
  const db = await dbPromise;
  await db.clear("queue");
}
