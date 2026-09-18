import * as Crypto from 'expo-crypto';

import type { JourneyItem } from '@/types/api';

type WebSyncEvent = {
  event_id: string;
  device_id: string;
  entity_type: 'journey_item';
  entity_id: string;
  operation: 'upsert';
  payload: JourneyItem;
  payload_hash: string;
  client_updated_at: string;
};

const journeyKey = 'khetha-ai:journey-items';
const syncQueueKey = 'khetha-ai:sync-queue';

function getLocalStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function readJson<T>(key: string, fallback: T): T {
  const value = getLocalStorage()?.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function saveJourneyItem(item: JourneyItem) {
  const storage = getLocalStorage();
  if (!storage) return;

  const items = readJson<JourneyItem[]>(journeyKey, []);
  const nextItems = [item, ...items.filter((saved) => saved.id !== item.id)];
  storage.setItem(journeyKey, JSON.stringify(nextItems));

  const payloadJson = JSON.stringify(item);
  const event: WebSyncEvent = {
    event_id: Crypto.randomUUID(),
    device_id: 'expo-web',
    entity_type: 'journey_item',
    entity_id: item.id,
    operation: 'upsert',
    payload: item,
    payload_hash: await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, payloadJson),
    client_updated_at: item.client_updated_at,
  };
  const queue = readJson<WebSyncEvent[]>(syncQueueKey, []);
  storage.setItem(syncQueueKey, JSON.stringify([...queue, event]));
}

export async function listJourneyItems(): Promise<JourneyItem[]> {
  return readJson<JourneyItem[]>(journeyKey, []).filter((item) => item.status !== 'removed');
}
