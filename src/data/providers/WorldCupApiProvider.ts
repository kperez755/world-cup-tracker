import type { DataEntry, Match, MatchDetail, Odds, Lineup, MatchEvent } from '../../types';
import type { DataProvider } from './DataProvider';
import { createDataEntry } from './DataProvider';

/**
 * Provider for worldcupapi.com
 * Auth: query parameter `?key=YOUR_API_KEY`
 */
export class WorldCupApiProvider implements DataProvider {
  readonly name = 'worldcupapi.com';
  private apiKey: string;
  private baseUrl = 'https://api.worldcupapi.com/v1';

  get isAvailable(): boolean {
    return !!this.apiKey;
  }

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }

  private async fetchApi(endpoint: string) {
    if (!this.apiKey) return null;
    const separator = endpoint.includes('?') ? '&' : '?';
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}${separator}key=${this.apiKey}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn(`[WorldCupAPI] Failed to fetch ${endpoint}:`, error);
      return null;
    }
  }

  async fetchFixtures(): Promise<DataEntry<Match[]>> {
    return { data: [], source: this.name, fetchedAt: new Date().toISOString(), ttlSeconds: 0, isVerified: false };
  }

  async fetchMatchDetail(_matchId: string): Promise<DataEntry<MatchDetail> | null> {
    if (!this.isAvailable) return null;
    // WorldCupAPI match detail endpoint
    // Not strictly needed since we use useBracketData for match info, but here for interface completeness
    return null;
  }

  async fetchOdds(_matchId: string): Promise<DataEntry<Odds> | null> {
    if (!this.isAvailable) return null;
    return null; // WorldCupAPI is primarily stats/lineups, not betting odds
  }

  async fetchLineups(matchId: string): Promise<DataEntry<Lineup> | null> {
    if (!this.isAvailable) return null;
    
    // For WorldCupAPI, the ID from openfootball might not match directly. 
    // In a real app we'd map the IDs, but for this demo we'll attempt to fetch using the internal ID 
    // or return a mock successful response if the API isn't exactly matching the format yet.
    const data = await this.fetchApi(`/matches/${matchId}/lineups`);
    
    if (data && data.home && data.away) {
      // Assuming typical API structure
      return createDataEntry({
        home: {
          team: { name: 'Home', code: '' },
          formation: data.home.formation || 'TBD',
          startingXI: data.home.starting_xi || [],
          substitutes: data.home.bench || [],
          coach: data.home.coach || null
        },
        away: {
          team: { name: 'Away', code: '' },
          formation: data.away.formation || 'TBD',
          startingXI: data.away.starting_xi || [],
          substitutes: data.away.bench || [],
          coach: data.away.coach || null
        }
      }, this.name, 60, true);
    }
    
    return null;
  }

  async fetchEvents(matchId: string): Promise<DataEntry<MatchEvent[]> | null> {
    if (!this.isAvailable) return null;
    
    const data = await this.fetchApi(`/matches/${matchId}/events`);
    
    if (data && Array.isArray(data.events)) {
      const events: MatchEvent[] = data.events.map((e: any) => ({
        id: e.id || Math.random().toString(),
        matchId,
        type: e.type || 'goal',
        minute: e.minute || 0,
        extraMinute: e.extra_minute || null,
        team: e.team === 'home' ? 'home' : 'away',
        playerName: e.player || 'Unknown',
        detail: e.detail || ''
      }));
      return createDataEntry(events, this.name, 60, true);
    }
    
    return null;
  }
}
