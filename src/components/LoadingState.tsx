import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)'
    }}>
      <div className="status-dot pulsing bg-live" style={{ width: '12px', height: '12px', marginBottom: '1rem' }}></div>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>
        Loading Bracket Data...
      </h2>
    </div>
  );
};

export const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--status-live)'
    }}>
      <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</span>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
        Failed to Load Data
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', textAlign: 'center' }}>
        {message}
      </p>
      <button 
        onClick={onRetry}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-primary)',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600
        }}
      >
        Try Again
      </button>
    </div>
  );
};
