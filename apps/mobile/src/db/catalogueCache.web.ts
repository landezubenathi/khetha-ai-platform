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
