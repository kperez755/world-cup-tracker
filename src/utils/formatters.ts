/**
 * Formatting utilities for dates, times, odds, and match status.
 */

import type { MatchStatus } from '../types';

/** Format a kickoff time in the user's local timezone */
export function formatKickoffTime(dateStr: string | null): string {
  if (!dateStr) return 'TBD';
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return 'TBD';
  }
}

/** Format a match date */
export function formatMatchDate(dateStr: string | null): string {
  if (!dateStr) return 'Date TBD';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Date TBD';
  }
}

/** Format date + time together */
export function formatMatchDateTime(dateStr: string | null): string {
  if (!dateStr) return 'Date & Time TBD';
  try {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return 'Date & Time TBD';
  }
}

/** Convert decimal odds to implied probability (0–100) */
export function oddsToImpliedProbability(decimalOdds: number | null): number | null {
  if (!decimalOdds || decimalOdds <= 0) return null;
  return Math.round((1 / decimalOdds) * 10000) / 100;
}

/** Get a human-readable label for match status */
export function getStatusLabel(status: MatchStatus, minute?: number | null): string {
  switch (status) {
    case 'SCHEDULED':
      return 'Scheduled';
    case 'LIVE':
      return minute ? `${minute}'` : 'LIVE';
    case 'HALFTIME':
      return 'HT';
    case 'EXTRA_TIME':
      return 'ET';
    case 'PENALTIES':
      return 'PEN';
    case 'FINISHED':
      return 'FT';
    case 'FINISHED_AET':
      return 'AET';
    case 'FINISHED_PEN':
      return 'PEN';
    case 'POSTPONED':
      return 'PPD';
    case 'CANCELLED':
      return 'CAN';
    default:
      return '—';
  }
}

/** Get relative time string */
export function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  if (diffMs < 0) {
    // Future
    const absDiff = Math.abs(diffMs);
    if (absDiff < 60_000) return 'in < 1 min';
    if (absDiff < 3_600_000) return `in ${Math.floor(absDiff / 60_000)} min`;
    if (absDiff < 86_400_000) return `in ${Math.floor(absDiff / 3_600_000)}h`;
    return `in ${Math.floor(absDiff / 86_400_000)}d`;
  }

  // Past
  if (diffMs < 60_000) return '< 1 min ago';
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)} min ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  return `${Math.floor(diffMs / 86_400_000)}d ago`;
}

/** Get status CSS class */
export function getStatusClass(status: MatchStatus): string {
  switch (status) {
    case 'LIVE':
    case 'PENALTIES':
      return 'status-live';
    case 'HALFTIME':
      return 'status-halftime';
    case 'EXTRA_TIME':
      return 'status-extra-time';
    case 'FINISHED':
    case 'FINISHED_AET':
    case 'FINISHED_PEN':
      return 'status-finished';
    case 'SCHEDULED':
      return 'status-scheduled';
    case 'POSTPONED':
    case 'CANCELLED':
      return 'status-postponed';
    default:
      return 'status-unknown';
  }
}

/** Format score display */
export function formatScore(
  homeScore: number | null,
  awayScore: number | null,
  homePen: number | null,
  awayPen: number | null
): string {
  if (homeScore === null || awayScore === null) return 'vs';
  let score = `${homeScore} – ${awayScore}`;
  if (homePen !== null && awayPen !== null) {
    score += ` (${homePen}–${awayPen} pen)`;
  }
  return score;
}

/** Check if a match is currently live */
export function isMatchLive(status: MatchStatus): boolean {
  return ['LIVE', 'HALFTIME', 'EXTRA_TIME', 'PENALTIES'].includes(status);
}

/** Check if a match is finished */
export function isMatchFinished(status: MatchStatus): boolean {
  return ['FINISHED', 'FINISHED_AET', 'FINISHED_PEN'].includes(status);
}
