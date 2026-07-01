import React from 'react';
import type { MatchEvent } from '../types';

interface EventsTimelineProps {
  events: MatchEvent[];
}

const EVENT_ICONS: Record<string, string> = {
  goal: '⚽',
  own_goal: '⚽ (OG)',
  penalty_goal: '⚽ (PEN)',
  penalty_miss: '❌',
  yellow_card: '🟨',
  red_card: '🟥',
  second_yellow: '🟨🟥',
  substitution: '🔄',
  var: '📺',
  penalty_shootout: '⚡',
};

export const EventsTimeline: React.FC<EventsTimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="panel-empty-state">
        <span className="empty-icon">⏱️</span>
        <p>No events recorded yet</p>
      </div>
    );
  }

  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => {
    if (a.minute !== b.minute) return a.minute - b.minute;
    return (a.extraMinute || 0) - (b.extraMinute || 0);
  });

  return (
    <div className="events-timeline">
      <div className="timeline-line"></div>
      
      {sortedEvents.map((event) => (
        <div key={event.id} className={`timeline-item ${event.team}`}>
          <div className="timeline-minute">
            {event.minute}'
            {event.extraMinute ? `+${event.extraMinute}` : ''}
          </div>
          
          <div className="timeline-content">
            <span className="event-icon" title={event.type.replace('_', ' ')}>
              {EVENT_ICONS[event.type] || '•'}
            </span>
            <div className="event-details">
              <span className="player-name">{event.playerName}</span>
              {event.assistName && <span className="assist-name">({event.assistName})</span>}
              {event.detail && <span className="event-extra">{event.detail}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
