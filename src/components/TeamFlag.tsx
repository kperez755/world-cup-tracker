import React from 'react';

interface TeamFlagProps {
  countryCode: string; // ISO 3166-1 alpha-2
  teamName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TeamFlag: React.FC<TeamFlagProps> = ({ 
  countryCode, 
  teamName, 
  size = 'md',
  className = '' 
}) => {
  if (!countryCode) {
    // Fallback for TBD or unknown teams
    return (
      <div 
        className={`team-flag-fallback size-${size} ${className}`}
        title={teamName}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-elevated)',
          color: 'var(--text-muted)',
          borderRadius: '2px',
          fontWeight: 600,
          border: '1px solid rgba(255,255,255,0.1)',
          ...getSizeStyle(size)
        }}
      >
        ?
      </div>
    );
  }

  return (
    <span 
      className={`fi fi-${countryCode} ${className}`}
      title={teamName}
      style={{
        borderRadius: '2px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        ...getSizeStyle(size)
      }}
    />
  );
};

function getSizeStyle(size: 'sm' | 'md' | 'lg') {
  switch (size) {
    case 'sm': return { width: '16px', height: '12px', fontSize: '10px', lineHeight: '12px' };
    case 'lg': return { width: '32px', height: '24px', fontSize: '24px', lineHeight: '24px' };
    case 'md':
    default: return { width: '24px', height: '18px', fontSize: '18px', lineHeight: '18px' };
  }
}
