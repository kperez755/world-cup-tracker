/**
 * Bracket builder — transforms flat match arrays into the tree structure
 * needed for the circular bracket visualization.
 */

import type { Match, BracketData, BracketNode, Round } from '../types';
import { polarToCartesian, calculateRingRadius } from './polarLayout';

const RING_MAP: Record<Round, number> = {
  ROUND_OF_32: 0,
  ROUND_OF_16: 1,
  QUARTER_FINAL: 2,
  SEMI_FINAL: 3,
  FINAL: 4,
  THIRD_PLACE: -1, // not in the circular bracket
};

const RING_COUNTS = [16, 8, 4, 2, 1]; // matches per ring
const TOTAL_RINGS = 5;

/**
 * Build the bracket data structure from a flat list of matches.
 */
export function buildBracket(
  matches: Match[],
  centerX: number = 1000,
  centerY: number = 1000,
  maxRadius: number = 850
): BracketData {
  const matchMap: Record<string, Match> = {};
  const rounds: Record<Round, string[]> = {
    ROUND_OF_32: [],
    ROUND_OF_16: [],
    QUARTER_FINAL: [],
    SEMI_FINAL: [],
    THIRD_PLACE: [],
    FINAL: [],
  };
  const nodes: Record<string, BracketNode> = {};
  let thirdPlaceMatchId: string | null = null;

  // Index all matches
  for (const match of matches) {
    matchMap[match.id] = match;
    rounds[match.round].push(match.id);
    if (match.round === 'THIRD_PLACE') {
      thirdPlaceMatchId = match.id;
    }
  }

  // Sort matches within each round by matchNumber
  for (const round of Object.keys(rounds) as Round[]) {
    rounds[round].sort((a, b) => {
      const mA = matchMap[a];
      const mB = matchMap[b];
      return (mA?.matchNumber ?? 0) - (mB?.matchNumber ?? 0);
    });
  }

  // Build nodes for each ring (excluding third-place)
  const bracketRounds: Round[] = ['ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL'];

  // 101.25 degrees offset mathematically aligns the Semi-Finals 
  // exactly on the horizontal axis (180 deg Left, 360/0 deg Right).
  let currentOffset = 101.25;

  for (const round of bracketRounds) {
    const ring = RING_MAP[round];
    const matchIds = rounds[round];
    const expectedCount = RING_COUNTS[ring] ?? matchIds.length;
    
    const spacing = expectedCount > 0 ? 360 / expectedCount : 0;

    for (let i = 0; i < matchIds.length; i++) {
      const matchId = matchIds[i];
      const match = matchMap[matchId];
      if (!match) continue;

      const angle = expectedCount === 1 ? 0 : currentOffset + i * spacing;
      const radius = calculateRingRadius(ring, TOTAL_RINGS, maxRadius);
      const { x, y } = polarToCartesian(centerX, centerY, radius, angle);

      // Find child matches (matches that feed into this one)
      const childIds = matches
        .filter((m) => m.nextMatchId === matchId)
        .map((m) => m.id);

      nodes[matchId] = {
        match,
        ring,
        index: i,
        angle,
        x,
        y,
        childIds,
      };
    }
    
    // The next ring's nodes should be positioned exactly halfway between the nodes of this ring
    currentOffset += spacing / 2;
  }

  return { nodes, matches: matchMap, rounds, thirdPlaceMatchId };
}

/**
 * Advance winners from completed matches into their next-round slots.
 * Returns a new matches array with winners populated.
 */
export function advanceWinners(matches: Match[]): Match[] {
  const updated = matches.map((m) => ({ ...m }));
  const matchMap = new Map<string, Match>();
  updated.forEach((m) => matchMap.set(m.id, m));

  for (const match of updated) {
    if (match.winner && match.nextMatchId && match.nextMatchSlot) {
      const nextMatch = matchMap.get(match.nextMatchId);
      if (nextMatch) {
        const winnerTeam = match.winner === 'home' ? match.homeTeam : match.awayTeam;
        if (match.nextMatchSlot === 'home') {
          nextMatch.homeTeam = winnerTeam ? { ...winnerTeam } : null;
        } else {
          nextMatch.awayTeam = winnerTeam ? { ...winnerTeam } : null;
        }
      }
    }
  }

  return updated;
}

/**
 * Get connector lines between parent and child nodes.
 */
export function getConnectors(
  nodes: Record<string, BracketNode>
): Array<{ from: BracketNode; to: BracketNode }> {
  const connectors: Array<{ from: BracketNode; to: BracketNode }> = [];

  for (const node of Object.values(nodes)) {
    for (const childId of node.childIds) {
      const childNode = nodes[childId];
      if (childNode) {
        connectors.push({ from: childNode, to: node });
      }
    }
  }

  return connectors;
}
