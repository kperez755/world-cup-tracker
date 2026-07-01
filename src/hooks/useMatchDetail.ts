import { useState, useEffect } from 'react';
import type { Match, MatchDetail, MatchEvent, Lineup, Odds } from '../types';
import { WorldCupApiProvider } from '../data/providers/WorldCupApiProvider';

export function useMatchDetail(match: Match | null) {
  const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [lineup, setLineup] = useState<Lineup | null>(null);
  const [odds, setOdds] = useState<Odds | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Array<{source: string, fetchedAt: string}>>([]);

  useEffect(() => {
    if (!match) {
      setMatchDetail(null);
      setEvents([]);
      setLineup(null);
      setOdds(null);
      setSources([]);
      return;
    }

    let isMounted = true;
    
    async function fetchDetails() {
      setIsLoading(true);
      
      const newSources: Array<{source: string, fetchedAt: string}> = [];
      
      // Initialize the provider with the key from local storage
      const apiKey = localStorage.getItem('VITE_WORLDCUP_API_KEY') || '';
      const premiumProvider = new WorldCupApiProvider(apiKey);
      
      // If no premium provider available, we just clear out the detailed state
      if (!premiumProvider.isAvailable) {
        if (isMounted) {
          setMatchDetail(null);
          setEvents([]);
          setLineup(null);
          setOdds(null);
          setSources([]);
          setIsLoading(false);
        }
        return;
      }

      // Fetch all available details in parallel
      const [eventsData, lineupData, oddsData] = await Promise.all([
        premiumProvider.fetchEvents(match.id),
        premiumProvider.fetchLineups(match.id),
        premiumProvider.fetchOdds(match.id)
      ]);

      if (isMounted) {
        if (eventsData) {
          setEvents(eventsData.data);
          newSources.push({ source: eventsData.source, fetchedAt: eventsData.fetchedAt });
        } else {
          setEvents([]);
        }
        
        if (lineupData) {
          setLineup(lineupData.data);
          if (!newSources.find(s => s.source === lineupData.source)) {
            newSources.push({ source: lineupData.source, fetchedAt: lineupData.fetchedAt });
          }
        } else {
          setLineup(null);
        }
        
        if (oddsData) {
          setOdds(oddsData.data);
          if (!newSources.find(s => s.source === oddsData.source)) {
            newSources.push({ source: oddsData.source, fetchedAt: oddsData.fetchedAt });
          }
        } else {
          setOdds(null);
        }
        
        setSources(newSources);
        setIsLoading(false);
      }
    }

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [match?.id]);

  return { match: matchDetail, events, lineup, odds, isLoading, sources };
}
