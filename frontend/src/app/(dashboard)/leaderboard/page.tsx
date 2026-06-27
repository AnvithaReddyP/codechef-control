'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchParticipants } from '@/lib/api';
import { Trophy, Snowflake } from 'lucide-react';
import { useContestStore } from '@/store/contestStore';

export default function LeaderboardPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isFreezeMode } = useContestStore();
  const [frozenLeaderboard, setFrozenLeaderboard] = useState<any[] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function loadData() {
      const data = await fetchParticipants();
      setParticipants(data);
      setLoading(false);
    }
    
    loadData();
    // In a real app with real-time updates (like Supabase subscriptions),
    // we would listen to DB changes and update `participants` here.
    const interval = setInterval(loadData, 10000); // Polling for mock dynamism
    return () => clearInterval(interval);
  }, []);

  // When freeze mode is toggled ON, save the current sorted leaderboard state
  // When it is toggled OFF, clear the frozen state
  useEffect(() => {
    if (isFreezeMode && (!frozenLeaderboard || frozenLeaderboard.length === 0) && participants.length > 0) {
      setFrozenLeaderboard(sortParticipants(participants));
    } else if (!isFreezeMode && frozenLeaderboard) {
      setFrozenLeaderboard(null);
    }
  }, [isFreezeMode, participants, frozenLeaderboard]);

  function sortParticipants(data: any[]) {
    return [...data].sort((a, b) => {
      if (a.problems_solved !== b.problems_solved) {
        return b.problems_solved - a.problems_solved;
      }
      return a.penalty_time - b.penalty_time;
    });
  }

  const displayData = isFreezeMode && frozenLeaderboard 
    ? frozenLeaderboard 
    : sortParticipants(participants);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-on-surface)] flex items-center gap-3">
            <Trophy className="text-[var(--color-primary)]" size={32} />
            Dynamic Leaderboard
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Real-time ranking of all participants</p>
        </div>
        
        {(mounted && isFreezeMode) && (
          <div className="glass px-4 py-2 rounded-md flex items-center gap-2 border border-[var(--color-secondary)] shadow-[0_0_15px_rgba(0,238,252,0.4)] animate-pulse">
            <Snowflake size={16} className="text-[var(--color-secondary)]" />
            <span className="text-[var(--color-secondary)] font-mono text-sm font-bold uppercase tracking-widest">Scoreboard Frozen</span>
          </div>
        )}
      </div>

      <div className="glass rounded-xl p-4 md:p-6">
        <div className="overflow-x-auto rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container-high)] border-b border-[var(--color-outline-variant)]">
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider w-20">Rank</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">Participant</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider text-right">Problems Solved</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider text-right">Penalty Time</th>
              </tr>
            </thead>
            <tbody>
              {loading && participants.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-[var(--color-on-surface-variant)]">Loading leaderboard...</td></tr>
              ) : displayData.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-[var(--color-on-surface-variant)]">No data available.</td></tr>
              ) : (
                displayData.map((p, i) => (
                  <tr 
                    key={p.id} 
                    className={`border-b border-[var(--color-outline-variant)] transition-colors ${
                      i === 0 ? 'bg-[var(--color-primary-container)]/10 hover:bg-[var(--color-primary-container)]/20' :
                      i === 1 ? 'bg-gray-400/10 hover:bg-gray-400/20' :
                      i === 2 ? 'bg-amber-700/10 hover:bg-amber-700/20' :
                      'hover:bg-[var(--color-surface-container-highest)]'
                    }`}
                  >
                    <td className="p-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold ${
                        i === 0 ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[0_0_10px_rgba(255,199,124,0.5)]' :
                        i === 1 ? 'bg-gray-300 text-gray-800' :
                        i === 2 ? 'bg-amber-600 text-white' :
                        'text-[var(--color-on-surface)]'
                      }`}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-[var(--color-on-surface)] text-lg">{p.name}</div>
                      <div className="text-sm text-[var(--color-on-surface-variant)]">{p.institution}</div>
                    </td>
                    <td className="p-4 text-right font-mono text-xl font-bold text-[var(--color-primary)]">
                      {p.problems_solved}
                    </td>
                    <td className="p-4 text-right font-mono text-lg text-[var(--color-on-surface-variant)]">
                      {p.penalty_time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
