import React from 'react';
import type { Match } from '../types';
import { TeamFlag } from './TeamFlag';
import { LiveStatusBadge } from './LiveStatusBadge';
import { isMatchLive } from '../utils/formatters';

interface ThirdPlaceMatchProps {
  match: Match;
  onClick: (matchId: string) => void;
}

export const ThirdPlaceMatch: React.FC<ThirdPlaceMatchProps> = ({ match, onClick }) => {
  const isLive = isMatchLive(match.status);

  const getTeamRowClass = (isHome: boolean) => {
    let classes = 'team-row';
    if (match.winner) {
      const isWinner = (isHome && match.winner === 'home') || (!isHome && match.winner === 'away');
      classes += isWinner ? ' is-winner' : ' is-loser';
    }
    return classes;
  };

  return (
    <div 
      className="third-place-container" 
      onClick={() => onClick(match.id)}
      style={{
        margin: '2rem auto',
        width: '300px',
        textAlign: 'center'
      }}
    >
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
        Third Place Play-off
      </h3>
      
      <div className={`match-card glass-panel ${isLive ? 'is-live' : ''}`} style={{ height: 'auto', padding: '1rem' }}>
        <div className="match-card-badge-container">
          <LiveStatusBadge status={match.status} minute={match.minute} />
        </div>

        <div className={getTeamRowClass(true)} style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
          <div className="team-info">
            <TeamFlag countryCode={match.homeTeam?.code || ''} teamName={match.homeTeam?.name || 'TBD'} size="md" />
            <span className="team-name">{match.homeTeam?.name || 'TBD'}</span>
          </div>
          <span className="team-score">
            {match.homeScore !== null ? match.homeScore : '-'}
            {match.homePenalties !== null && <span className="pen-score">({match.homePenalties})</span>}
          </span>
        </div>

        <div className={getTeamRowClass(false)} style={{ fontSize: '1rem' }}>
          <div className="team-info">
            <TeamFlag countryCode={match.awayTeam?.code || ''} teamName={match.awayTeam?.name || 'TBD'} size="md" />
            <span className="team-name">{match.awayTeam?.name || 'TBD'}</span>
          </div>
          <span className="team-score">
            {match.awayScore !== null ? match.awayScore : '-'}
            {match.awayPenalties !== null && <span className="pen-score">({match.awayPenalties})</span>}
          </span>
        </div>
      </div>
    </div>
  );
};
