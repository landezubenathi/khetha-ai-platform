$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath '.\package.json') -or -not (Test-Path -LiteralPath '.\src\db')) {
    throw 'Run this script from the khetha-ai-platform\apps\mobile directory.'
}

Set-Content -LiteralPath '.\src\db\database.web.ts' -Encoding UTF8 -Value @'
/**
 * The browser uses localStorage through the web-specific repositories.
 * PostgreSQL remains behind the FastAPI service; expo-sqlite is native-only.
 */
export async function initialiseDatabase() {
  return undefined;
}

export async function getDatabase(): Promise<never> {
  throw new Error('The SQLite database is only available in the native mobile app.');
}
'@

Set-Content -LiteralPath '.\src\db\catalogueCache.web.ts' -Encoding UTF8 -Value @'
type VersionedItem = {
  source?: { version_label?: string } | null;
};

const cachePrefix = 'khetha-ai:catalogue:';

function getLocalStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

export async function loadCatalogueWithCache<T extends VersionedItem[]>(
  cacheKey: string,
  request: () => Promise<T>,
): Promise<T> {
  const storage = getLocalStorage();
  const storageKey = `${cachePrefix}${cacheKey}`;

  try {
    const payload = await request();
    storage?.setItem(storageKey, JSON.stringify(payload));
    return payload;
  } catch (error) {
    const cached = storage?.getItem(storageKey);
    if (cached) return JSON.parse(cached) as T;
    throw error;
  }
}
'@

Set-Content -LiteralPath '.\src\db\journeyRepository.web.ts' -Encoding UTF8 -Value @'
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
'@

Set-Content -LiteralPath '.\src\db\syncService.web.ts' -Encoding UTF8 -Value @'
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
'@

Write-Host 'Khetha web storage fix applied successfully.' -ForegroundColor Green
Write-Host 'SQLite remains enabled for Android/iOS; web now uses localStorage plus the API.'
