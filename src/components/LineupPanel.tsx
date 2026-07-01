import React from 'react';
import type { Lineup } from '../types';

interface LineupPanelProps {
  lineup: Lineup | null;
}

export const LineupPanel: React.FC<LineupPanelProps> = ({ lineup }) => {
  if (!lineup || (!lineup.home && !lineup.away)) {
    return (
      <div className="panel-empty-state">
        <span className="empty-icon">👕</span>
        <p>Starting XI not released yet</p>
      </div>
    );
  }

  return (
    <div className="lineup-panel">
      <div className="formations-header">
        <div className="home-formation">{lineup.home?.formation || 'TBD'}</div>
        <div className="formation-divider">vs</div>
        <div className="away-formation">{lineup.away?.formation || 'TBD'}</div>
      </div>
      
      <div className="lineups-split">
        <div className="team-lineup home-lineup">
          <h4 className="lineup-section-title">Starting XI</h4>
          <ul className="player-list">
            {lineup.home?.startingXI.map((player, i) => (
              <li key={i}>
                <span className="player-number">{player.number || '-'}</span>
                <span className="player-name">{player.name}</span>
                <span className="player-pos">{player.position}</span>
              </li>
            ))}
          </ul>
          {lineup.home?.coach && (
            <div className="coach-info">Coach: {lineup.home.coach}</div>
          )}
        </div>
        
        <div className="team-lineup away-lineup">
          <h4 className="lineup-section-title">Starting XI</h4>
          <ul className="player-list">
            {lineup.away?.startingXI.map((player, i) => (
              <li key={i}>
                <span className="player-number">{player.number || '-'}</span>
                <span className="player-name">{player.name}</span>
                <span className="player-pos">{player.position}</span>
              </li>
            ))}
          </ul>
          {lineup.away?.coach && (
            <div className="coach-info">Coach: {lineup.away.coach}</div>
          )}
        </div>
      </div>
    </div>
  );
};
