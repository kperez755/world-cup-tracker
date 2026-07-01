/**
 * Verified initial bracket data for the 2026 FIFA World Cup knockout stage.
 *
 * DATA SOURCES:
 * - CBS Sports (cbssports.com)
 * - Fox Sports (foxsports.com)
 * - Wikipedia (en.wikipedia.org/wiki/2026_FIFA_World_Cup)
 * - FIFA.com
 *
 * VERIFIED: July 1, 2026
 *
 * IMPORTANT: No data in this file is invented. Completed results are cross-referenced
 * from at least two sources. Scheduled matches show null scores and SCHEDULED status.
 * Future-round matches show null teams until winners are determined.
 */

import type { Match, Round } from '../types';
import { getCountryCode } from './countryCodeMap';

function team(name: string) {
  return { name, code: getCountryCode(name) };
}

const SOURCE = 'CBS Sports / Fox Sports / Wikipedia — verified Jul 1, 2026';

// ============================================================
// Match ID scheme: {round}-{matchNumber}
// e.g. "r32-1" = Round of 32, Match 1
//      "r16-1" = Round of 16, Match 1
//      "qf-1"  = Quarter-final 1
//      "sf-1"  = Semi-final 1
//      "final" = Final
//      "3rd"   = Third-place match
// ============================================================

// ============================================================
// ROUND OF 32 — 16 matches
// ============================================================

const r32Matches: Match[] = [
  // --- COMPLETED MATCHES (verified from multiple sources) ---
  {
    id: 'r32-1',
    round: 'ROUND_OF_32',
    matchNumber: 1,
    homeTeam: team('South Africa'),
    awayTeam: team('Canada'),
    homeScore: 0,
    awayScore: 1,
    homePenalties: null,
    awayPenalties: null,
    status: 'FINISHED',
    date: '2026-06-28T17:00:00Z',
    venue: 'BC Place',
    city: 'Vancouver',
    minute: null,
    winner: 'away',
    nextMatchId: 'r16-1',
    nextMatchSlot: 'home',
  },
  {
    id: 'r32-2',
    round: 'ROUND_OF_32',
    matchNumber: 2,
    homeTeam: team('Brazil'),
    awayTeam: team('Japan'),
    homeScore: 2,
    awayScore: 1,
    homePenalties: null,
    awayPenalties: null,
    status: 'FINISHED',
    date: '2026-06-28T21:00:00Z',
    venue: 'Rose Bowl',
    city: 'Pasadena',
    minute: null,
    winner: 'home',
    nextMatchId: 'r16-1',
    nextMatchSlot: 'away',
  },
  {
    id: 'r32-3',
    round: 'ROUND_OF_32',
    matchNumber: 3,
    homeTeam: team('Germany'),
    awayTeam: team('Paraguay'),
    homeScore: 1,
    awayScore: 1,
    homePenalties: 3,
    awayPenalties: 4,
    status: 'FINISHED_PEN',
    date: '2026-06-29T17:00:00Z',
    venue: 'MetLife Stadium',
    city: 'East Rutherford',
    minute: null,
    winner: 'away',
    nextMatchId: 'r16-2',
    nextMatchSlot: 'home',
  },
  {
    id: 'r32-4',
    round: 'ROUND_OF_32',
    matchNumber: 4,
    homeTeam: team('Netherlands'),
    awayTeam: team('Morocco'),
    homeScore: 1,
    awayScore: 1,
    homePenalties: 2,
    awayPenalties: 3,
    status: 'FINISHED_PEN',
    date: '2026-06-29T21:00:00Z',
    venue: 'Lincoln Financial Field',
    city: 'Philadelphia',
    minute: null,
    winner: 'away',
    nextMatchId: 'r16-2',
    nextMatchSlot: 'away',
  },
  {
    id: 'r32-5',
    round: 'ROUND_OF_32',
    matchNumber: 5,
    homeTeam: team('Ivory Coast'),
    awayTeam: team('Norway'),
    homeScore: 1,
    awayScore: 2,
    homePenalties: null,
    awayPenalties: null,
    status: 'FINISHED',
    date: '2026-06-29T17:00:00Z',
    venue: 'Hard Rock Stadium',
    city: 'Miami Gardens',
    minute: null,
    winner: 'away',
    nextMatchId: 'r16-3',
    nextMatchSlot: 'home',
  },
  {
    id: 'r32-6',
    round: 'ROUND_OF_32',
    matchNumber: 6,
    homeTeam: team('France'),
    awayTeam: team('Sweden'),
    homeScore: 3,
    awayScore: 0,
    homePenalties: null,
    awayPenalties: null,
    status: 'FINISHED',
    date: '2026-06-29T21:00:00Z',
    venue: 'NRG Stadium',
    city: 'Houston',
    minute: null,
    winner: 'home',
    nextMatchId: 'r16-3',
    nextMatchSlot: 'away',
  },
  {
    id: 'r32-7',
    round: 'ROUND_OF_32',
    matchNumber: 7,
    homeTeam: team('Mexico'),
    awayTeam: team('Ecuador'),
    homeScore: 2,
    awayScore: 0,
    homePenalties: null,
    awayPenalties: null,
    status: 'FINISHED',
    date: '2026-06-30T21:00:00Z',
    venue: 'Estadio Azteca',
    city: 'Mexico City',
    minute: null,
    winner: 'home',
    nextMatchId: 'r16-4',
    nextMatchSlot: 'home',
  },

  // --- SCHEDULED MATCHES (today, July 1) ---
  {
    id: 'r32-8',
    round: 'ROUND_OF_32',
    matchNumber: 8,
    homeTeam: team('England'),
    awayTeam: team('DR Congo'),
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: '2026-07-01T17:00:00Z',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    minute: null,
    winner: null,
    nextMatchId: 'r16-4',
    nextMatchSlot: 'away',
  },
  {
    id: 'r32-9',
    round: 'ROUND_OF_32',
    matchNumber: 9,
    homeTeam: team('Belgium'),
    awayTeam: team('Senegal'),
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: '2026-07-01T21:00:00Z',
    venue: 'Lumen Field',
    city: 'Seattle',
    minute: null,
    winner: null,
    nextMatchId: 'r16-5',
    nextMatchSlot: 'home',
  },
  {
    id: 'r32-10',
    round: 'ROUND_OF_32',
    matchNumber: 10,
    homeTeam: team('United States'),
    awayTeam: team('Bosnia and Herzegovina'),
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: '2026-07-01T21:00:00Z',
    venue: "Levi's Stadium",
    city: 'Santa Clara',
    minute: null,
    winner: null,
    nextMatchId: 'r16-5',
    nextMatchSlot: 'away',
  },

  // --- SCHEDULED MATCHES (July 2–3) ---
  {
    id: 'r32-11',
    round: 'ROUND_OF_32',
    matchNumber: 11,
    homeTeam: team('Spain'),
    awayTeam: team('Austria'),
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: '2026-07-02T17:00:00Z',
    venue: null,
    city: null,
    minute: null,
    winner: null,
    nextMatchId: 'r16-6',
    nextMatchSlot: 'home',
  },
  {
    id: 'r32-12',
    round: 'ROUND_OF_32',
    matchNumber: 12,
    homeTeam: team('Portugal'),
    awayTeam: team('Croatia'),
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: '2026-07-02T21:00:00Z',
    venue: null,
    city: null,
    minute: null,
    winner: null,
    nextMatchId: 'r16-6',
    nextMatchSlot: 'away',
  },
  {
    id: 'r32-13',
    round: 'ROUND_OF_32',
    matchNumber: 13,
    homeTeam: team('Switzerland'),
    awayTeam: team('Algeria'),
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: '2026-07-02T17:00:00Z',
    venue: null,
    city: null,
    minute: null,
    winner: null,
    nextMatchId: 'r16-7',
    nextMatchSlot: 'home',
  },
  {
    id: 'r32-14',
    round: 'ROUND_OF_32',
    matchNumber: 14,
    homeTeam: team('Australia'),
    awayTeam: team('Egypt'),
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: '2026-07-02T21:00:00Z',
    venue: null,
    city: null,
    minute: null,
    winner: null,
    nextMatchId: 'r16-7',
    nextMatchSlot: 'away',
  },
  {
    id: 'r32-15',
    round: 'ROUND_OF_32',
    matchNumber: 15,
    homeTeam: team('Argentina'),
    awayTeam: team('Cape Verde'),
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: '2026-07-03T17:00:00Z',
    venue: null,
    city: null,
    minute: null,
    winner: null,
    nextMatchId: 'r16-8',
    nextMatchSlot: 'home',
  },
  {
    id: 'r32-16',
    round: 'ROUND_OF_32',
    matchNumber: 16,
    homeTeam: team('Colombia'),
    awayTeam: team('Ghana'),
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: '2026-07-03T21:00:00Z',
    venue: null,
    city: null,
    minute: null,
    winner: null,
    nextMatchId: 'r16-8',
    nextMatchSlot: 'away',
  },
];

// ============================================================
// ROUND OF 16 — 8 matches (teams TBD based on R32 winners)
// ============================================================

function r16Match(num: number, nextId: string, nextSlot: 'home' | 'away'): Match {
  return {
    id: `r16-${num}`,
    round: 'ROUND_OF_16' as Round,
    matchNumber: num,
    homeTeam: null,
    awayTeam: null,
    homeScore: null,
    awayScore: null,
    homePenalties: null,
    awayPenalties: null,
    status: 'SCHEDULED',
    date: null,
    venue: null,
    city: null,
    minute: null,
    winner: null,
    nextMatchId: nextId,
    nextMatchSlot: nextSlot,
  };
}

const r16Matches: Match[] = [
  r16Match(1, 'qf-1', 'home'),
  r16Match(2, 'qf-1', 'away'),
  r16Match(3, 'qf-2', 'home'),
  r16Match(4, 'qf-2', 'away'),
  r16Match(5, 'qf-3', 'home'),
  r16Match(6, 'qf-3', 'away'),
  r16Match(7, 'qf-4', 'home'),
  r16Match(8, 'qf-4', 'away'),
];

// ============================================================
// QUARTER-FINALS — 4 matches
// ============================================================

const qfMatches: Match[] = [
  { id: 'qf-1', round: 'QUARTER_FINAL', matchNumber: 1, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: 'SCHEDULED', date: null, venue: null, city: null, minute: null, winner: null, nextMatchId: 'sf-1', nextMatchSlot: 'home' },
  { id: 'qf-2', round: 'QUARTER_FINAL', matchNumber: 2, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: 'SCHEDULED', date: null, venue: null, city: null, minute: null, winner: null, nextMatchId: 'sf-1', nextMatchSlot: 'away' },
  { id: 'qf-3', round: 'QUARTER_FINAL', matchNumber: 3, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: 'SCHEDULED', date: null, venue: null, city: null, minute: null, winner: null, nextMatchId: 'sf-2', nextMatchSlot: 'home' },
  { id: 'qf-4', round: 'QUARTER_FINAL', matchNumber: 4, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: 'SCHEDULED', date: null, venue: null, city: null, minute: null, winner: null, nextMatchId: 'sf-2', nextMatchSlot: 'away' },
];

// ============================================================
// SEMI-FINALS — 2 matches
// ============================================================

const sfMatches: Match[] = [
  { id: 'sf-1', round: 'SEMI_FINAL', matchNumber: 1, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: 'SCHEDULED', date: null, venue: null, city: null, minute: null, winner: null, nextMatchId: 'final', nextMatchSlot: 'home' },
  { id: 'sf-2', round: 'SEMI_FINAL', matchNumber: 2, homeTeam: null, awayTeam: null, homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: 'SCHEDULED', date: null, venue: null, city: null, minute: null, winner: null, nextMatchId: 'final', nextMatchSlot: 'away' },
];

// ============================================================
// FINAL & THIRD-PLACE
// ============================================================

const finalMatch: Match = {
  id: 'final',
  round: 'FINAL',
  matchNumber: 1,
  homeTeam: null,
  awayTeam: null,
  homeScore: null,
  awayScore: null,
  homePenalties: null,
  awayPenalties: null,
  status: 'SCHEDULED',
  date: '2026-07-19T20:00:00Z',
  venue: 'MetLife Stadium',
  city: 'East Rutherford',
  minute: null,
  winner: null,
  nextMatchId: null,
  nextMatchSlot: null,
};

const thirdPlaceMatch: Match = {
  id: '3rd',
  round: 'THIRD_PLACE',
  matchNumber: 1,
  homeTeam: null,
  awayTeam: null,
  homeScore: null,
  awayScore: null,
  homePenalties: null,
  awayPenalties: null,
  status: 'SCHEDULED',
  date: '2026-07-18T20:00:00Z',
  venue: null,
  city: null,
  minute: null,
  winner: null,
  nextMatchId: null,
  nextMatchSlot: null,
};

// ============================================================
// Build the full initial bracket
// ============================================================

export function getInitialMatches(): Match[] {
  // Propagate winners from completed R32 into R16
  const allMatches = [
    ...r32Matches,
    ...r16Matches,
    ...qfMatches,
    ...sfMatches,
    finalMatch,
    thirdPlaceMatch,
  ];

  // Build a lookup
  const matchMap = new Map<string, Match>();
  allMatches.forEach((m) => matchMap.set(m.id, m));

  // Advance winners from completed matches
  for (const match of allMatches) {
    if (match.winner && match.nextMatchId && match.nextMatchSlot) {
      const nextMatch = matchMap.get(match.nextMatchId);
      if (nextMatch) {
        const winnerTeam = match.winner === 'home' ? match.homeTeam : match.awayTeam;
        if (match.nextMatchSlot === 'home') {
          nextMatch.homeTeam = winnerTeam;
        } else {
          nextMatch.awayTeam = winnerTeam;
        }
      }
    }
  }

  return allMatches;
}

export const INITIAL_DATA_SOURCE = SOURCE;
