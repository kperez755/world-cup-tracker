// ============================================================
// Match Status & Round enums
// ============================================================

export type MatchStatus =
  | 'SCHEDULED'
  | 'LIVE'
  | 'HALFTIME'
  | 'EXTRA_TIME'
  | 'PENALTIES'
  | 'FINISHED'
  | 'FINISHED_AET'
  | 'FINISHED_PEN'
  | 'POSTPONED'
  | 'CANCELLED'
  | 'UNKNOWN';

export type Round =
  | 'ROUND_OF_32'
  | 'ROUND_OF_16'
  | 'QUARTER_FINAL'
  | 'SEMI_FINAL'
  | 'THIRD_PLACE'
  | 'FINAL';

export const ROUND_LABELS: Record<Round, string> = {
  ROUND_OF_32: 'Round of 32',
  ROUND_OF_16: 'Round of 16',
  QUARTER_FINAL: 'Quarter-finals',
  SEMI_FINAL: 'Semi-finals',
  THIRD_PLACE: 'Third Place',
  FINAL: 'Final',
};

export const ROUND_ORDER: Round[] = [
  'ROUND_OF_32',
  'ROUND_OF_16',
  'QUARTER_FINAL',
  'SEMI_FINAL',
  'FINAL',
];

// ============================================================
// Core data types
// ============================================================

export interface Team {
  name: string;
  code: string; // ISO 3166-1 alpha-2 lowercase, e.g. "br"
  group?: string;
}

export interface Match {
  id: string;
  round: Round;
  matchNumber: number; // 1-16 for R32, 1-8 for R16, etc.
  homeTeam: Team | null;
  awayTeam: Team | null;
  homeScore: number | null;
  awayScore: number | null;
  homePenalties: number | null;
  awayPenalties: number | null;
  status: MatchStatus;
  date: string | null; // ISO 8601
  venue: string | null;
  city: string | null;
  minute: number | null; // live match minute
  winner: 'home' | 'away' | null;
  nextMatchId: string | null; // which match the winner advances to
  nextMatchSlot: 'home' | 'away' | null; // which slot in the next match
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: 'goal' | 'own_goal' | 'penalty_goal' | 'penalty_miss' | 'yellow_card' | 'red_card' | 'second_yellow' | 'substitution' | 'var' | 'penalty_shootout';
  minute: number;
  extraMinute?: number;
  team: 'home' | 'away';
  playerName: string;
  assistName?: string;
  detail?: string;
}

export interface Player {
  name: string;
  number: number | null;
  position: 'GK' | 'DEF' | 'MID' | 'FWD' | string;
}

export interface TeamLineup {
  team: Team;
  formation: string | null; // e.g. "4-3-3"
  startingXI: Player[];
  substitutes: Player[];
  coach: string | null;
}

export interface Lineup {
  home: TeamLineup | null;
  away: TeamLineup | null;
}

export interface Odds {
  homeWin: number | null; // implied probability 0-1
  draw: number | null;
  awayWin: number | null;
  homeDecimal: number | null; // raw decimal odds
  drawDecimal: number | null;
  awayDecimal: number | null;
  source: string;
  updatedAt: string; // ISO 8601
}

export interface MatchDetail {
  match: Match;
  events: MatchEvent[];
  lineup: Lineup | null;
  odds: Odds | null;
}

// ============================================================
// Data provenance wrapper — every piece of data tracks its source
// ============================================================

export interface DataEntry<T> {
  data: T;
  source: string; // e.g. "openfootball/worldcup.json", "CBS Sports"
  fetchedAt: string; // ISO 8601 timestamp
  ttlSeconds: number;
  isVerified: boolean;
}

// ============================================================
// Bracket structure for the circular layout
// ============================================================

export interface BracketNode {
  match: Match;
  ring: number; // 0=R32 (outermost), 1=R16, 2=QF, 3=SF, 4=Final
  index: number; // position within the ring
  angle: number; // calculated angle in degrees
  x: number; // cartesian x (computed)
  y: number; // cartesian y (computed)
  childIds: string[]; // IDs of feeder matches
}

export interface BracketData {
  nodes: Record<string, BracketNode>;
  matches: Record<string, Match>;
  rounds: Record<Round, string[]>; // round → match IDs
  thirdPlaceMatchId: string | null;
}

// ============================================================
// Provider configuration
// ============================================================

export interface DataProviderConfig {
  name: string;
  isActive: boolean;
  apiKey?: string;
  baseUrl?: string;
  rateLimit?: number; // requests per minute
}

export type DataSourceName =
  | 'openfootball'
  | 'api-football'
  | 'initial-verified'
  | 'user-cache'
  | 'unknown';
