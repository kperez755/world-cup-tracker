import React, { useState, useEffect } from 'react';
import { getCacheStats, clearAllCache } from '../data/cache';

interface AdminPanelProps {
  onClose: () => void;
  dataSources: Array<{ source: string; fetchedAt: string }>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, dataSources }) => {
  const [cacheStats, setCacheStats] = useState(getCacheStats());
  const [apiKey, setApiKey] = useState(localStorage.getItem('VITE_WORLDCUP_API_KEY') || '');

  // Update stats periodically while panel is open
  useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(getCacheStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    clearAllCache();
    setCacheStats(getCacheStats());
    window.location.reload(); // Quick way to force refetch
  };

  const handleSaveKey = () => {
    if (apiKey) {
      localStorage.setItem('VITE_WORLDCUP_API_KEY', apiKey);
    } else {
      localStorage.removeItem('VITE_WORLDCUP_API_KEY');
    }
    alert('API Key saved. The app will use the WorldCupAPI provider on next load.');
    window.location.reload();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 200, justifyContent: 'center', alignItems: 'center' }}>
      <div className="admin-panel glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <h2>Admin / Debug Panel</h2>
          <button className="close-btn" style={{ position: 'static' }} onClick={onClose}>×</button>
        </div>

        <div className="admin-content">
          <div className="admin-section">
            <h3>Current Data Sources</h3>
            <p className="admin-note">Shows where the bracket data on the screen right now came from.</p>
            <ul className="source-list">
              {dataSources.map((ds, i) => (
                <li key={i}>
                  <strong>{ds.source}</strong>
                  <br />
                  <span className="text-muted">Fetched: {new Date(ds.fetchedAt).toLocaleString()}</span>
                </li>
              ))}
              {dataSources.length === 0 && <li className="text-muted">No sources active.</li>}
            </ul>
          </div>

          <div className="admin-section">
            <h3>Cache Statistics</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-value">{cacheStats.totalEntries}</span>
                <span className="stat-label">Total Entries</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{cacheStats.staleCount}</span>
                <span className="stat-label">Stale Entries</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{formatBytes(cacheStats.totalSizeBytes)}</span>
                <span className="stat-label">Storage Used</span>
              </div>
            </div>
            
            <div className="cache-entries-table-wrapper">
              <table className="cache-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Source</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cacheStats.entries.map(entry => (
                    <tr key={entry.key}>
                      <td>{entry.key}</td>
                      <td className="source-cell" title={entry.source}>{entry.source}</td>
                      <td>
                        <span className={`status-badge ${entry.isExpired ? 'status-ht' : 'status-finished'}`}>
                          {entry.isExpired ? 'STALE' : 'FRESH'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {cacheStats.entries.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: 'center' }}>Cache is empty</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <button className="admin-action-btn mt-2" onClick={handleClearCache}>
              Clear Cache & Reload
            </button>
          </div>

          <div className="admin-section">
            <h3>Provider Configuration</h3>
            <p className="admin-note">
              Currently using the free OpenFootball JSON source. Enter an API key below to activate premium data (Live Odds, Lineups, Events).
            </p>
            <div className="api-key-input-group" style={{ flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Enter worldcupapi.com key..." 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="api-input"
                />
                <button className="admin-action-btn primary" onClick={handleSaveKey}>
                  Save & Apply
                </button>
              </div>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                Currently configured for: <strong>worldcupapi.com</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
