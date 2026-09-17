import * as Network from 'expo-network';

import { apiRequest } from '@/api/client';
import { getDatabase } from '@/db/database';

type SyncRow = {
  event_id: string;
  entity_type: 'journey_item';
  entity_id: string;
  operation: 'upsert' | 'delete';
  payload_json: string;
  payload_hash: string;
  client_updated_at: string;
  attempts: number;
};

export async function syncPendingJourney(deviceId = 'expo-demo-device') {
  const network = await Network.getNetworkStateAsync();
  if (!network.isConnected || network.isInternetReachable === false) return { synced: 0, offline: true };

  const db = await getDatabase();
  const events = await db.getAllAsync<SyncRow>(
    'SELECT * FROM sync_queue ORDER BY client_updated_at ASC LIMIT 50',
  );
  let synced = 0;
  for (const event of events) {
    try {
      await apiRequest('/sync', {
        method: 'POST',
        body: JSON.stringify({
          event_id: event.event_id,
          device_id: deviceId,
          entity_type: event.entity_type,
          entity_id: event.entity_id,
          operation: event.operation,
          payload: JSON.parse(event.payload_json),
          payload_hash: event.payload_hash,
          client_updated_at: event.client_updated_at,
        }),
      });
      await db.withTransactionAsync(async () => {
        await db.runAsync("UPDATE journey_items SET sync_status = 'synced' WHERE id = ?", event.entity_id);
        await db.runAsync('DELETE FROM sync_queue WHERE event_id = ?', event.event_id);
      });
      synced += 1;
    } catch (error) {
      await db.runAsync(
        'UPDATE sync_queue SET attempts = attempts + 1, last_error = ? WHERE event_id = ?',
        error instanceof Error ? error.message : 'Unknown sync error',
        event.event_id,
      );
      break;
    }
  }
  return { synced, offline: false };
}

