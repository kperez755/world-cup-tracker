import React, { useState } from 'react';
import type { Match } from '../types';
import { useMatchDetail } from '../hooks/useMatchDetail';
import { TeamFlag } from './TeamFlag';
import { LiveStatusBadge } from './LiveStatusBadge';
import { formatMatchDateTime, formatScore } from '../utils/formatters';
import { OddsPanel } from './OddsPanel';
import { LineupPanel } from './LineupPanel';
import { EventsTimeline } from './EventsTimeline';
import './MatchModal.css';

interface MatchModalProps {
  match: Match | null;
  onClose: () => void;
}

type TabId = 'overview' | 'lineups' | 'events' | 'odds';

export const MatchModal: React.FC<MatchModalProps> = ({ match, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { match: matchDetail, events, lineup, odds, isLoading, sources } = useMatchDetail(match);

  if (!match) return null;

  // Use detailed match if available, fallback to basic match
  const displayMatch = matchDetail || match;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        {/* Header */}
        <div className="modal-header">
          <div className="match-meta">
            <span>{formatMatchDateTime(displayMatch.date)}</span>
            {(displayMatch.venue || displayMatch.city) && (
              <span> • {displayMatch.venue}{displayMatch.city ? `, ${displayMatch.city}` : ''}</span>
            )}
          </div>
          
          <div className="match-score-board">
            <div className="team-col home">
              <TeamFlag countryCode={displayMatch.homeTeam?.code || ''} teamName={displayMatch.homeTeam?.name || ''} size="lg" />
              <h2>{displayMatch.homeTeam?.name || 'TBD'}</h2>
            </div>
            
            <div className="score-col">
              <LiveStatusBadge status={displayMatch.status} minute={displayMatch.minute} className="modal-badge" />
              <div className="big-score">
                {formatScore(displayMatch.homeScore, displayMatch.awayScore, displayMatch.homePenalties, displayMatch.awayPenalties)}
              </div>
            </div>
            
            <div className="team-col away">
              <TeamFlag countryCode={displayMatch.awayTeam?.code || ''} teamName={displayMatch.awayTeam?.name || ''} size="lg" />
              <h2>{displayMatch.awayTeam?.name || 'TBD'}</h2>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab-btn ${activeTab === 'lineups' ? 'active' : ''}`} onClick={() => setActiveTab('lineups')}>Lineups</button>
          <button className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>Events</button>
          <button className={`tab-btn ${activeTab === 'odds' ? 'active' : ''}`} onClick={() => setActiveTab('odds')}>Odds</button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {isLoading ? (
            <div className="panel-loading">Loading details...</div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="section-block">
                    <h3>Match Events</h3>
                    <EventsTimeline events={events} />
                  </div>
                  <div className="section-block mt-4">
                    <h3>Win Probability</h3>
                    <OddsPanel odds={odds} />
                  </div>
                </div>
              )}
              
              {activeTab === 'lineups' && <LineupPanel lineup={lineup} />}
              {activeTab === 'events' && <EventsTimeline events={events} />}
              {activeTab === 'odds' && <OddsPanel odds={odds} />}
            </>
          )}
        </div>
        
        {/* Source Attribution */}
        {sources.length > 0 && !isLoading && (
          <div className="modal-footer">
            Data sources: {sources.map(s => s.source).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};
