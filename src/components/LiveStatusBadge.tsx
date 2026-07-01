import React from 'react';
import type { MatchStatus } from '../types';
import { getStatusLabel, getStatusClass, isMatchLive } from '../utils/formatters';
import './LiveStatusBadge.css';

interface LiveStatusBadgeProps {
  status: MatchStatus;
  minute?: number | null;
  className?: string;
}

export const LiveStatusBadge: React.FC<LiveStatusBadgeProps> = ({ 
  status, 
  minute, 
  className = '' 
}) => {
  const isLive = isMatchLive(status);
  const label = getStatusLabel(status, minute);
  const statusClass = getStatusClass(status);
  
  // Map specific statuses to background colors for the dot
  let dotClass = '';
  if (isLive) dotClass = 'bg-live';
  else if (status === 'FINISHED' || status === 'FINISHED_AET' || status === 'FINISHED_PEN') dotClass = 'bg-finished';
  else dotClass = 'bg-scheduled';

  return (
    <div className={`status-badge ${statusClass} ${className}`}>
      <span className={`status-dot ${dotClass} ${isLive ? 'pulsing' : ''}`}></span>
      <span className="status-label">{label}</span>
    </div>
  );
};
