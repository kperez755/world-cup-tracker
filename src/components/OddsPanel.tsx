import React from 'react';
import type { Odds } from '../types';
import { oddsToImpliedProbability, getRelativeTime } from '../utils/formatters';

interface OddsPanelProps {
  odds: Odds | null;
}

export const OddsPanel: React.FC<OddsPanelProps> = ({ odds }) => {
  if (!odds) {
    return (
      <div className="panel-empty-state">
        <span className="empty-icon">📊</span>
        <p>Odds not released yet</p>
      </div>
    );
  }

  const homeProb = oddsToImpliedProbability(odds.homeDecimal) || odds.homeWin || 0;
  const drawProb = oddsToImpliedProbability(odds.drawDecimal) || odds.draw || 0;
  const awayProb = oddsToImpliedProbability(odds.awayDecimal) || odds.awayWin || 0;

  // Normalize to ensure they sum to exactly 100% for the visual bar
  const total = homeProb + drawProb + awayProb;
  const homePct = (homeProb / total) * 100;
  const drawPct = (drawProb / total) * 100;
  const awayPct = (awayProb / total) * 100;

  return (
    <div className="odds-panel">
      <div className="odds-bars">
        <div className="odds-bar-container">
          <div className="odds-bar-segment home" style={{ width: `${homePct}%` }}>
            {homeProb > 0 && <span className="odds-label">1</span>}
          </div>
          <div className="odds-bar-segment draw" style={{ width: `${drawPct}%` }}>
            {drawProb > 0 && <span className="odds-label">X</span>}
          </div>
          <div className="odds-bar-segment away" style={{ width: `${awayPct}%` }}>
            {awayProb > 0 && <span className="odds-label">2</span>}
          </div>
        </div>
        
        <div className="odds-values">
          <div className="odds-value home">
            <span className="prob">{homeProb.toFixed(1)}%</span>
            {odds.homeDecimal && <span className="dec">({odds.homeDecimal.toFixed(2)})</span>}
          </div>
          <div className="odds-value draw">
            <span className="prob">{drawProb.toFixed(1)}%</span>
            {odds.drawDecimal && <span className="dec">({odds.drawDecimal.toFixed(2)})</span>}
          </div>
          <div className="odds-value away">
            <span className="prob">{awayProb.toFixed(1)}%</span>
            {odds.awayDecimal && <span className="dec">({odds.awayDecimal.toFixed(2)})</span>}
          </div>
        </div>
      </div>
      
      <div className="data-source-footer">
        Source: {odds.source} • Updated {getRelativeTime(odds.updatedAt)}
      </div>
    </div>
  );
};
