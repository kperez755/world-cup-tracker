/**
 * localStorage cache with TTL, source tracking, and versioning.
 * Every cached entry stores its data source and fetch timestamp.
 */

import type { DataEntry } from '../types';

const CACHE_VERSION = 'wc2026-v1';
const CACHE_PREFIX = `${CACHE_VERSION}:`;

interface CacheEntry<T> {
  entry: DataEntry<T>;
  expiresAt: number; // Unix ms
}

export function cacheSet<T>(key: string, entry: DataEntry<T>): void {
  try {
    const cacheEntry: CacheEntry<T> = {
      entry,
      expiresAt: Date.now() + entry.ttlSeconds * 1000,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
  } catch {
    // localStorage full or unavailable — silently fail
    console.warn(`[Cache] Failed to write key: ${key}`);
  }
}

export function cacheGet<T>(key: string): DataEntry<T> | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const cached: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > cached.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null; // expired
    }
    return cached.entry;
  } catch {
    return null;
  }
}

export function cacheGetStale<T>(key: string): DataEntry<T> | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const cached: CacheEntry<T> = JSON.parse(raw);
    return cached.entry; // return even if expired
  } catch {
    return null;
  }
}

export function cacheRemove(key: string): void {
  localStorage.removeItem(CACHE_PREFIX + key);
}

export function isStale(key: string): boolean {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return true;
    const cached = JSON.parse(raw);
    return Date.now() > cached.expiresAt;
  } catch {
    return true;
  }
}

export function getCacheStats(): {
  totalEntries: number;
  staleCount: number;
  totalSizeBytes: number;
  entries: Array<{
    key: string;
    source: string;
    fetchedAt: string;
    isExpired: boolean;
    sizeBytes: number;
  }>;
} {
  const stats = {
    totalEntries: 0,
    staleCount: 0,
    totalSizeBytes: 0,
    entries: [] as Array<{
      key: string;
      source: string;
      fetchedAt: string;
      isExpired: boolean;
      sizeBytes: number;
    }>,
  };

  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i);
    if (!fullKey || !fullKey.startsWith(CACHE_PREFIX)) continue;

    const key = fullKey.slice(CACHE_PREFIX.length);
    const raw = localStorage.getItem(fullKey);
    if (!raw) continue;

    const sizeBytes = raw.length * 2; // rough UTF-16 size
    stats.totalSizeBytes += sizeBytes;
    stats.totalEntries++;

    try {
      const cached = JSON.parse(raw);
      const isExpired = Date.now() > cached.expiresAt;
      if (isExpired) stats.staleCount++;

      stats.entries.push({
        key,
        source: cached.entry?.source ?? 'unknown',
        fetchedAt: cached.entry?.fetchedAt ?? 'unknown',
        isExpired,
        sizeBytes,
      });
    } catch {
      stats.entries.push({
        key,
        source: 'parse-error',
        fetchedAt: 'unknown',
        isExpired: true,
        sizeBytes,
      });
    }
  }

  return stats;
}

export function clearAllCache(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
