import { apiRequest } from '@/api/client';

type WebSyncEvent = {
  event_id: string;
  device_id: string;
  entity_type: 'journey_item';
  entity_id: string;
  operation: 'upsert' | 'delete';
  payload: Record<string, unknown>;
  payload_hash: string;
  client_updated_at: string;
};

const syncQueueKey = 'khetha-ai:sync-queue';

function getLocalStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

export async function syncPendingJourney(deviceId = 'expo-web') {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { synced: 0, offline: true };
  }

  const storage = getLocalStorage();
  if (!storage) return { synced: 0, offline: false };

  let queue: WebSyncEvent[] = [];
  try {
    queue = JSON.parse(storage.getItem(syncQueueKey) ?? '[]') as WebSyncEvent[];
  } catch {
    storage.removeItem(syncQueueKey);
  }

  let synced = 0;
  for (const event of queue) {
    try {
      await apiRequest('/sync', {
        method: 'POST',
        body: JSON.stringify({ ...event, device_id: deviceId }),
      });
      synced += 1;
    } catch {
      break;
    }
  }

  if (synced > 0) {
    storage.setItem(syncQueueKey, JSON.stringify(queue.slice(synced)));
  }
  return { synced, offline: false };
}
