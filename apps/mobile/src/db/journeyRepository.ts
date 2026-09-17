import * as Crypto from 'expo-crypto';

import { getDatabase } from '@/db/database';
import type { JourneyItem } from '@/types/api';

export async function saveJourneyItem(item: JourneyItem) {
  const db = await getDatabase();
  const payloadJson = JSON.stringify(item);
  const payloadHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, payloadJson);
  const eventId = Crypto.randomUUID();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO journey_items
        (id, item_type, reference_id, title, status, notes, target_date, source_snapshot_json, client_updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
       ON CONFLICT(id) DO UPDATE SET
         item_type = excluded.item_type,
         reference_id = excluded.reference_id,
         title = excluded.title,
         status = excluded.status,
         notes = excluded.notes,
         target_date = excluded.target_date,
         source_snapshot_json = excluded.source_snapshot_json,
         client_updated_at = excluded.client_updated_at,
         sync_status = 'pending'`,
      item.id,
      item.item_type,
      item.reference_id,
      item.title,
      item.status,
      item.notes,
      item.target_date,
      JSON.stringify(item.source_snapshot),
      item.client_updated_at,
    );
    await db.runAsync(
      `INSERT INTO sync_queue
        (event_id, entity_type, entity_id, operation, payload_json, payload_hash, client_updated_at)
       VALUES (?, 'journey_item', ?, 'upsert', ?, ?, ?)`,
      eventId,
      item.id,
      payloadJson,
      payloadHash,
      item.client_updated_at,
    );
  });
}

type JourneyRow = {
  id: string;
  item_type: JourneyItem['item_type'];
  reference_id: string | null;
  title: string;
  status: JourneyItem['status'];
  notes: string | null;
  target_date: string | null;
  source_snapshot_json: string;
  client_updated_at: string;
};

export async function listJourneyItems(): Promise<JourneyItem[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<JourneyRow>(
    `SELECT id, item_type, reference_id, title, status, notes, target_date,
            source_snapshot_json, client_updated_at
       FROM journey_items
      WHERE status != 'removed'
      ORDER BY client_updated_at DESC`,
  );
  return rows.map((row) => ({
    id: row.id,
    item_type: row.item_type,
    reference_id: row.reference_id,
    title: row.title,
    status: row.status,
    notes: row.notes,
    target_date: row.target_date,
    source_snapshot: JSON.parse(row.source_snapshot_json),
    client_updated_at: row.client_updated_at,
  }));
}

