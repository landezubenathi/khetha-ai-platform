import { initialiseDatabase } from '@/db/database';

type CacheRow = {
  payload_json: string;
};

type VersionedItem = {
  source?: { version_label?: string } | null;
};

export async function loadCatalogueWithCache<T extends VersionedItem[]>(
  cacheKey: string,
  request: () => Promise<T>,
): Promise<T> {
  const db = await initialiseDatabase();
  try {
    const payload = await request();
    const contentVersion = payload[0]?.source?.version_label ?? 'unversioned';
    await db.runAsync(
      `INSERT INTO catalogue_cache (cache_key, payload_json, content_version, cached_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(cache_key) DO UPDATE SET
         payload_json = excluded.payload_json,
         content_version = excluded.content_version,
         cached_at = excluded.cached_at`,
      cacheKey,
      JSON.stringify(payload),
      contentVersion,
      new Date().toISOString(),
    );
    return payload;
  } catch (error) {
    const cached = await db.getFirstAsync<CacheRow>(
      'SELECT payload_json FROM catalogue_cache WHERE cache_key = ?',
      cacheKey,
    );
    if (cached) return JSON.parse(cached.payload_json) as T;
    throw error;
  }
}
