/**
 * API-Football Provider (STUB) — ready to activate with a paid API key.
 *
 * This provider is a placeholder that will fully implement the DataProvider
 * interface against the API-Football v3 API once a key is configured.
 *
 * To activate:
 * 1. Set VITE_API_FOOTBALL_KEY in your .env file
 * 2. The app will automatically prefer this provider over OpenFootball
 *
 * API Docs: https://www.api-football.com/documentation-v3
 */

import type { DataEntry, Match, MatchDetail, Odds, Lineup, MatchEvent } from '../../types';
import type { DataProvider } from './DataProvider';

export class ApiFootballProvider implements DataProvider {
  readonly name = 'api-football';
  private apiKey: string;
  // private baseUrl = 'https://v3.football.api-sports.io';
  // private leagueId: number;
  // private season: number;

  get isAvailable(): boolean {
    return !!this.apiKey;
  }

  constructor(apiKey?: string, _leagueId = 1, _season = 2026) {
    this.apiKey = apiKey || '';
    // this.leagueId = _leagueId;
    // this.season = _season;
  }

  async fetchFixtures(): Promise<DataEntry<Match[]>> {
    if (!this.isAvailable) {
      return {
        data: [],
        source: this.name,
        fetchedAt: new Date().toISOString(),
        ttlSeconds: 0,
        isVerified: false,
      };
    }

    // TODO: Implement when API key is available
    // const res = await fetch(
    //   `${this.baseUrl}/fixtures?league=${this.leagueId}&season=${this.season}`,
    //   { headers: { 'x-apisports-key': this.apiKey } }
    // );
    // const data = await res.json();
    // return createDataEntry(mapFixtures(data.response), this.name, 60, true);

    return {
      data: [],
      source: this.name,
      fetchedAt: new Date().toISOString(),
      ttlSeconds: 0,
      isVerified: false,
    };
  }

  async fetchMatchDetail(_matchId: string): Promise<DataEntry<MatchDetail> | null> {
    if (!this.isAvailable) return null;
    // TODO: Implement with /fixtures?id={id} endpoint
    return null;
  }

  async fetchOdds(_matchId: string): Promise<DataEntry<Odds> | null> {
    if (!this.isAvailable) return null;
    // TODO: Implement with /odds?fixture={id} endpoint
    return null;
  }

  async fetchLineups(_matchId: string): Promise<DataEntry<Lineup> | null> {
    if (!this.isAvailable) return null;
    // TODO: Implement with /fixtures/lineups?fixture={id} endpoint
    return null;
  }

  async fetchEvents(_matchId: string): Promise<DataEntry<MatchEvent[]> | null> {
    if (!this.isAvailable) return null;
    // TODO: Implement with /fixtures/events?fixture={id} endpoint
    return null;
  }
}
