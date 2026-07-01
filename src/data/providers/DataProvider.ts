/**
 * Abstract data provider interface.
 * Implementations can fetch from openfootball, API-Football, or any other source.
 * Every method returns data wrapped in DataEntry for source tracking.
 */

import type { DataEntry, Match, MatchDetail, Odds, Lineup, MatchEvent } from '../../types';

export interface DataProvider {
  readonly name: string;
  readonly isAvailable: boolean;

  /** Fetch all knockout fixtures */
  fetchFixtures(): Promise<DataEntry<Match[]>>;

  /** Fetch detailed info for a single match */
  fetchMatchDetail(matchId: string): Promise<DataEntry<MatchDetail> | null>;

  /** Fetch odds for a match */
  fetchOdds(matchId: string): Promise<DataEntry<Odds> | null>;

  /** Fetch lineups for a match */
  fetchLineups(matchId: string): Promise<DataEntry<Lineup> | null>;

  /** Fetch events for a match */
  fetchEvents(matchId: string): Promise<DataEntry<MatchEvent[]> | null>;
}

/**
 * Creates a DataEntry wrapper for any piece of data.
 */
export function createDataEntry<T>(
  data: T,
  source: string,
  ttlSeconds: number = 300,
  isVerified: boolean = false
): DataEntry<T> {
  return {
    data,
    source,
    fetchedAt: new Date().toISOString(),
    ttlSeconds,
    isVerified,
  };
}
