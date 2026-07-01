/**
 * OpenFootball Provider — fetches free, public-domain World Cup data
 * from the openfootball/worldcup.json GitHub repository.
 *
 * Source: https://github.com/openfootball/worldcup.json
 * License: Public Domain
 * CORS: Enabled (via raw.githubusercontent.com)
 * Auth: None required
 */

import type { DataEntry, Match, MatchDetail, Odds, Lineup, MatchEvent } from '../../types';
import type { DataProvider } from './DataProvider';
import { createDataEntry } from './DataProvider';
import { getCountryCode } from '../countryCodeMap';
import type { MatchStatus } from '../../types';

const BASE_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026';

function mapStatus(score1: number | null, score2: number | null): MatchStatus {
  if (score1 !== null && score2 !== null) return 'FINISHED';
  return 'SCHEDULED';
}

function parseOpenFootballTeam(name: string) {
  return { name, code: getCountryCode(name) };
}

export class OpenFootballProvider implements DataProvider {
  readonly name = 'openfootball/worldcup.json';
  readonly isAvailable = true;

  async fetchFixtures(): Promise<DataEntry<Match[]>> {
    try {
      const res = await fetch(`${BASE_URL}/worldcup.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const matches: Match[] = [];
      let matchCounter = 0;

      // OpenFootball structure: { name, rounds: [{ name, matches: [...] }] }
      if (data.rounds) {
        for (const round of data.rounds) {
          const roundName = (round.name || '').toLowerCase();
          let roundType: Match['round'] = 'ROUND_OF_32';

          if (roundName.includes('final') && !roundName.includes('quarter') && !roundName.includes('semi') && !roundName.includes('third')) {
            roundType = 'FINAL';
          } else if (roundName.includes('semi')) {
            roundType = 'SEMI_FINAL';
          } else if (roundName.includes('quarter')) {
            roundType = 'QUARTER_FINAL';
          } else if (roundName.includes('16') || roundName.includes('sixteen')) {
            roundType = 'ROUND_OF_16';
          } else if (roundName.includes('third') || roundName.includes('3rd')) {
            roundType = 'THIRD_PLACE';
          }

          if (round.matches) {
            for (const m of round.matches) {
              matchCounter++;
              const homeScore = m.score1 ?? null;
              const awayScore = m.score2 ?? null;
              const status = mapStatus(homeScore, awayScore);
              let winner: 'home' | 'away' | null = null;
              if (status === 'FINISHED' && homeScore !== null && awayScore !== null) {
                if (homeScore > awayScore) winner = 'home';
                else if (awayScore > homeScore) winner = 'away';
                // penalty info would need further parsing
              }

              matches.push({
                id: `of-${matchCounter}`,
                round: roundType,
                matchNumber: matchCounter,
                homeTeam: m.team1 ? parseOpenFootballTeam(m.team1) : null,
                awayTeam: m.team2 ? parseOpenFootballTeam(m.team2) : null,
                homeScore,
                awayScore,
                homePenalties: null,
                awayPenalties: null,
                status,
                date: m.date ? new Date(m.date).toISOString() : null,
                venue: m.stadium || null,
                city: m.city || null,
                minute: null,
                winner,
                nextMatchId: null,
                nextMatchSlot: null,
              });
            }
          }
        }
      }

      return createDataEntry(matches, this.name, 300, true);
    } catch (error) {
      console.warn('[OpenFootball] Fetch failed:', error);
      return createDataEntry([], this.name, 60, false);
    }
  }

  async fetchMatchDetail(_matchId: string): Promise<DataEntry<MatchDetail> | null> {
    // OpenFootball doesn't provide detailed match data
    return null;
  }

  async fetchOdds(_matchId: string): Promise<DataEntry<Odds> | null> {
    // OpenFootball doesn't provide odds
    return null;
  }

  async fetchLineups(_matchId: string): Promise<DataEntry<Lineup> | null> {
    // OpenFootball doesn't provide lineups
    return null;
  }

  async fetchEvents(_matchId: string): Promise<DataEntry<MatchEvent[]> | null> {
    // OpenFootball doesn't provide events
    return null;
  }
}
