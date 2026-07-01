import React, { useState } from 'react';
import { useBracketData } from './hooks/useBracketData';
import { Header } from './components/Header';
import { CircularBracket } from './components/CircularBracket';
import { ThirdPlaceMatch } from './components/ThirdPlaceMatch';
import { MatchModal } from './components/MatchModal';
import { AdminPanel } from './components/AdminPanel';
import { LoadingState, ErrorState } from './components/LoadingState';
import type { Round } from './types';
import './components/AdminPanel.css'; // ensure admin panel styles are loaded

const App: React.FC = () => {
  const {
    bracket,
    matches,
    isLoading,
    error,
    lastUpdated,
    isStale,
    hasLiveMatches,
    dataSources,
    refresh
  } = useBracketData();

  const [activeRoundFilter, setActiveRoundFilter] = useState<Round | 'ALL'>('ALL');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const selectedMatch = selectedMatchId ? matches.find(m => m.id === selectedMatchId) || null : null;
  const thirdPlaceMatch = bracket?.thirdPlaceMatchId ? matches.find(m => m.id === bracket.thirdPlaceMatchId) : null;

  return (
    <div className="app-container">
      <Header 
        lastUpdated={lastUpdated}
        isStale={isStale}
        hasLiveMatches={hasLiveMatches}
        activeRound={activeRoundFilter}
        onRoundChange={setActiveRoundFilter}
        onAdminToggle={() => setShowAdminPanel(true)}
      />

      <main className="main-content">
        {isLoading && !bracket ? (
          <LoadingState />
        ) : error && !bracket ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : (
          <>
            <CircularBracket 
              data={bracket} 
              onMatchClick={setSelectedMatchId}
              activeRoundFilter={activeRoundFilter}
            />
            
            {thirdPlaceMatch && (activeRoundFilter === 'ALL' || activeRoundFilter === 'THIRD_PLACE') && (
              <div style={{ position: 'absolute', bottom: '2rem', zIndex: 10 }}>
                <ThirdPlaceMatch 
                  match={thirdPlaceMatch}
                  onClick={setSelectedMatchId}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals / Portals */}
      {selectedMatch && (
        <MatchModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatchId(null)} 
        />
      )}

      {showAdminPanel && (
        <AdminPanel 
          onClose={() => setShowAdminPanel(false)}
          dataSources={dataSources}
        />
      )}
    </div>
  );
};

export default App;
