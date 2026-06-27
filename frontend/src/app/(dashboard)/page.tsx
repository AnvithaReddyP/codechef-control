'use client';

import { useEffect, useState } from 'react';
import { fetchStats, fetchActivities } from '@/lib/api';
import { Users, FileCode, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds for mock countdown

  useEffect(() => {
    async function loadData() {
      const s = await fetchStats();
      const a = await fetchActivities();
      setStats(s);
      setActivities(a);
    }
    loadData();

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!stats) return <div className="p-8 text-center text-[var(--color-on-surface-variant)]">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-on-surface)]">Overview</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Monitor real-time contest telemetry</p>
        </div>
        
        <div className="glass px-6 py-3 rounded-full flex items-center gap-4 border border-[var(--color-secondary)] shadow-[0_0_15px_rgba(0,238,252,0.2)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-secondary)]"></span>
            </span>
            <span className="text-[var(--color-secondary)] font-mono font-bold tracking-widest text-sm uppercase">Live</span>
          </div>
          <div className="w-px h-4 bg-[var(--color-outline-variant)]"></div>
          <div className="flex items-center gap-2 text-[var(--color-on-surface)] font-mono text-lg font-bold">
            <Clock size={18} className="text-[var(--color-secondary)]" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          { label: 'Participants', value: stats.participants, icon: Users, color: 'var(--color-secondary)' },
          { label: 'Problems', value: stats.problems, icon: FileCode, color: 'var(--color-outline)' },
          { label: 'Total Subs', value: stats.totalSubmissions, icon: Send, color: 'var(--color-primary)' },
          { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'var(--color-secondary-container)' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'var(--color-error)' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-5 hover:bg-[var(--color-surface-container-high)] transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon size={20} style={{ color: stat.color }} />
              <h3 className="text-xs font-mono font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">{stat.label}</h3>
            </div>
            <p className="text-3xl font-display font-bold text-[var(--color-on-surface)]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="xl:col-span-2 glass rounded-xl p-6">
          <h2 className="text-xl font-display font-semibold mb-6 text-[var(--color-on-surface)] border-b border-[var(--color-outline-variant)] pb-4">Contest Progress</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 font-mono">
                <span className="text-[var(--color-on-surface-variant)]">Submission Success Rate</span>
                <span className="text-[var(--color-secondary)]">
                  {stats.totalSubmissions > 0 ? Math.round((stats.accepted / stats.totalSubmissions) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-[var(--color-surface-container-highest)] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[var(--color-secondary)] h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.totalSubmissions > 0 ? (stats.accepted / stats.totalSubmissions) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-mono">
                <span className="text-[var(--color-on-surface-variant)]">Time Elapsed</span>
                <span className="text-[var(--color-primary)]">{(1 - (timeLeft / 7200)) * 100 | 0}%</span>
              </div>
              <div className="w-full bg-[var(--color-surface-container-highest)] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${(1 - (timeLeft / 7200)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass rounded-xl p-6 flex flex-col max-h-[400px]">
          <h2 className="text-xl font-display font-semibold mb-4 text-[var(--color-on-surface)] border-b border-[var(--color-outline-variant)] pb-4">Activity Feed</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {activities.length === 0 ? (
              <p className="text-[var(--color-on-surface-variant)] text-sm">No activities yet.</p>
            ) : (
              activities.map(act => (
                <div key={act.id} className="flex gap-3 border-l-2 border-[var(--color-outline-variant)] pl-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)] mt-1.5 -ml-[17px]"></div>
                  <div>
                    <p className="text-sm text-[var(--color-on-surface)]">{act.description}</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] font-mono mt-1">
                      {new Date(act.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
