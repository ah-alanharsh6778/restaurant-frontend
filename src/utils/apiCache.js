/**
 * Stale-While-Revalidate (SWR) Instant Memory & Storage Cache
 * Enables 0ms INSTANT page transitions across all pages in RestaurantOS.
 */

const CACHE_PREFIX = 'restos_swr_cache_v1_';
const memoryCache = new Map();

export const getCachedData = (key) => {
  const fullKey = CACHE_PREFIX + key;
  // Check memory cache first
  if (memoryCache.has(fullKey)) {
    return memoryCache.get(fullKey);
  }
  // Check sessionStorage
  try {
    const raw = sessionStorage.getItem(fullKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryCache.set(fullKey, parsed.data);
      return parsed.data;
    }
  } catch (err) {
    console.warn('Cache read error:', err);
  }
  return null;
};

export const setCachedData = (key, data) => {
  const fullKey = CACHE_PREFIX + key;
  memoryCache.set(fullKey, data);
  try {
    sessionStorage.setItem(fullKey, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (err) {
    // Ignore quota exceeded or storage errors
  }
};

export const invalidateCachePattern = (pattern) => {
  for (const k of memoryCache.keys()) {
    if (k.includes(pattern)) {
      memoryCache.delete(k);
    }
  }
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX) && key.includes(pattern)) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (err) {
    // Ignore error
  }
};

export const clearAllCache = () => {
  memoryCache.clear();
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (err) {
    // Ignore error
  }
};
