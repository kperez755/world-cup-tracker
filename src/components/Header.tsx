import React from 'react';
import type { Round } from '../types';
import { RoundFilter } from './RoundFilter';
import { getRelativeTime } from '../utils/formatters';
import './Header.css';

interface HeaderProps {
  lastUpdated: string | null;
  isStale: boolean;
  hasLiveMatches: boolean;
  activeRound: Round | 'ALL';
  onRoundChange: (round: Round | 'ALL') => void;
  onAdminToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isStale,
  hasLiveMatches,
  activeRound,
  onRoundChange,
  onAdminToggle,
}) => {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="branding">
          <h1 className="logo-text">
            WORLD CUP <span className="text-gold">2026</span>
          </h1>
          <span className="subtitle">Knockout Tracker</span>
        </div>

        <div className="header-actions">
          {hasLiveMatches && (
            <div className="live-indicator">
              <span className="status-dot pulsing bg-live"></span>
              LIVE MATCHES
            </div>
          )}
          
          <div className="update-status" title={lastUpdated ? new Date(lastUpdated).toLocaleString() : ''}>
            {isStale && <span className="stale-warning">⚠ Stale Data</span>}
            <span className="update-time">
              {lastUpdated ? `Updated ${getRelativeTime(lastUpdated)}` : 'Loading...'}
            </span>
          </div>

          <button className="admin-btn glass-panel" onClick={onAdminToggle} title="Data Sources & Settings">
            ⚙️
          </button>
        </div>
      </div>

      <div className="header-bottom">
        <RoundFilter activeRound={activeRound} onChange={onRoundChange} />
      </div>
    </header>
  );
};
