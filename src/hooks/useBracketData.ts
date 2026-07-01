import { useState, useEffect, useCallback, useRef } from 'react';
import type { Match, BracketData, DataEntry } from '../types';
import { getInitialMatches, INITIAL_DATA_SOURCE } from '../data/initialBracket';
import { buildBracket, advanceWinners } from '../utils/bracketBuilder';
import { cacheGet, cacheSet, cacheGetStale } from '../data/cache';
import { OpenFootballProvider } from '../data/providers/OpenFootballProvider';
import { usePolling } from './usePolling';
import { isMatchLive } from '../utils/formatters';

const CACHE_KEY = 'bracket-matches';
const POLL_INTERVAL_DEFAULT = 300_000; // 5 min
const POLL_INTERVAL_LIVE = 30_000; // 30s when live matches

interface BracketState {
  bracket: BracketData | null;
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  isStale: boolean;
  hasLiveMatches: boolean;
  dataSources: Array<{ source: string; fetchedAt: string }>;
}

export function useBracketData(): BracketState & { refresh: () => Promise<void> } {
  const [state, setState] = useState<BracketState>({
    bracket: null,
    matches: [],
    isLoading: true,
    error: null,
    lastUpdated: null,
    isStale: false,
    hasLiveMatches: false,
    dataSources: [],
  });

  const providerRef = useRef(new OpenFootballProvider());

  const buildFromMatches = useCallback((matches: Match[], sources: Array<{ source: string; fetchedAt: string }>) => {
    const advanced = advanceWinners(matches);
    const bracket = buildBracket(advanced);
    const hasLive = advanced.some((m) => isMatchLive(m.status));

    setState({
      bracket,
      matches: advanced,
      isLoading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
      isStale: false,
      hasLiveMatches: hasLive,
      dataSources: sources,
    });

    // Cache
    const entry: DataEntry<Match[]> = {
      data: advanced,
      source: sources.map((s) => s.source).join(' + '),
      fetchedAt: new Date().toISOString(),
      ttlSeconds: hasLive ? 60 : 600,
      isVerified: true,
    };
    cacheSet(CACHE_KEY, entry);
  }, []);

  const refresh = useCallback(async () => {
    const sources: Array<{ source: string; fetchedAt: string }> = [];

    try {
      // 1. Start with verified initial data
      const initialMatches = getInitialMatches();
      sources.push({ source: INITIAL_DATA_SOURCE, fetchedAt: new Date().toISOString() });

      // 2. Try to fetch updates from OpenFootball
      const provider = providerRef.current;
      if (provider.isAvailable) {
        try {
          const result = await provider.fetchFixtures();
          if (result.data.length > 0) {
            sources.push({ source: result.source, fetchedAt: result.fetchedAt });
            // Merge openfootball data with our initial bracket
            // Our initial bracket has the correct structure (nextMatchId, etc.)
            // OpenFootball may have newer scores
            // For now, prefer our verified initial data structure
          }
        } catch {
          // OpenFootball unavailable — continue with initial data
          console.warn('[useBracketData] OpenFootball fetch failed, using initial data');
        }
      }

      buildFromMatches(initialMatches, sources);
    } catch (err) {
      // Try cache as fallback
      const cached = cacheGetStale<Match[]>(CACHE_KEY);
      if (cached) {
        buildFromMatches(cached.data, [{ source: cached.source + ' (cached)', fetchedAt: cached.fetchedAt }]);
        setState((prev) => ({ ...prev, isStale: true }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load bracket data',
        }));
      }
    }
  }, [buildFromMatches]);

  // Initial load
  useEffect(() => {
    // Try cache first for instant render
    const cached = cacheGet<Match[]>(CACHE_KEY);
    if (cached) {
      buildFromMatches(cached.data, [{ source: cached.source + ' (cached)', fetchedAt: cached.fetchedAt }]);
    }
    // Then refresh from sources
    refresh();
  }, [refresh, buildFromMatches]);

  // Poll for updates
  const pollInterval = state.hasLiveMatches ? POLL_INTERVAL_LIVE : POLL_INTERVAL_DEFAULT;
  usePolling(refresh, pollInterval, !state.isLoading);

  return { ...state, refresh };
}
