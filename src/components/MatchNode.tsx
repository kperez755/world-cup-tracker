import React from 'react';
import type { BracketNode } from '../types';
import { TeamFlag } from './TeamFlag';
import { LiveStatusBadge } from './LiveStatusBadge';
import { isMatchLive } from '../utils/formatters';
import './MatchNode.css';

interface MatchNodeProps {
  node: BracketNode;
  onClick: (matchId: string) => void;
  isDimmed?: boolean;
}

export const MatchNode: React.FC<MatchNodeProps> = ({ node, onClick, isDimmed }) => {
  const { match, x, y, ring } = node;
  const isLive = isMatchLive(match.status);
  
  // Size the nodes based on the ring (center = larger)
  // ring 0 = R32, 1 = R16, 2 = QF, 3 = SF, 4 = Final
  const size = ring === 4 ? 200 : ring === 3 ? 160 : 130;
  const width = size;
  const height = size;
  
  // Center the foreignObject on x,y
  const foX = x - width / 2;
  const foY = y - height / 2;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(match.id);
  };

  const getTeamRowClass = (isHome: boolean) => {
    let classes = 'team-row';
    if (match.winner) {
      const isWinner = (isHome && match.winner === 'home') || (!isHome && match.winner === 'away');
      classes += isWinner ? ' is-winner' : ' is-loser';
    }
    return classes;
  };

  // If this is the center final node and no teams are known yet, show a trophy or placeholder
  const isFinalNode = ring === 4;

  return (
    <foreignObject 
      x={foX} 
      y={foY} 
      width={width} 
      height={height}
      className={`match-node-container ${isDimmed ? 'is-dimmed' : ''}`}
      onClick={handleClick}
    >
      <div className={`match-card glass-panel ${isLive ? 'is-live' : ''} ${match.winner ? 'is-finished' : ''} ${isFinalNode ? 'is-final' : ''}`}>
        
        {/* Status Badge - absolutely positioned */}
        <div className="match-card-badge-container">
          <LiveStatusBadge status={match.status} minute={match.minute} />
        </div>

        {isFinalNode && !match.homeTeam && !match.awayTeam ? (
          <div className="trophy-placeholder">🏆</div>
        ) : (
          <div className="team-circles-container">
            {/* Home Team */}
            <div className={getTeamRowClass(true)}>
              <TeamFlag 
                countryCode={match.homeTeam?.code || ''} 
                teamName={match.homeTeam?.name || 'TBD'} 
                size="md" 
              />
              <div className="team-text-col">
                <span className="team-code" title={match.homeTeam?.name || 'TBD'}>
                  {match.homeTeam?.code || 'TBD'}
                </span>
                <span className="team-score">
                  {match.homeScore !== null ? match.homeScore : '-'}
                  {match.homePenalties !== null && <span className="pen-score">({match.homePenalties})</span>}
                </span>
              </div>
            </div>

            <div className="team-divider" />

            {/* Away Team */}
            <div className={getTeamRowClass(false)}>
              <TeamFlag 
                countryCode={match.awayTeam?.code || ''} 
                teamName={match.awayTeam?.name || 'TBD'} 
                size="md" 
              />
              <div className="team-text-col">
                <span className="team-code" title={match.awayTeam?.name || 'TBD'}>
                  {match.awayTeam?.code || 'TBD'}
                </span>
                <span className="team-score">
                  {match.awayScore !== null ? match.awayScore : '-'}
                  {match.awayPenalties !== null && <span className="pen-score">({match.awayPenalties})</span>}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </foreignObject>
  );
};
