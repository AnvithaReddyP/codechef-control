'use client';
import { useContestStore } from '@/store/contestStore';
import { Snowflake, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function Topbar() {
  const { isFreezeMode, toggleFreezeMode } = useContestStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-16 shrink-0 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] flex items-center justify-between px-4 md:px-6 z-10 glass">
      <div className="flex items-center gap-3 md:hidden">
        <button className="p-2">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold font-display text-[var(--color-primary)]">CodeChef</h1>
      </div>
      
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold font-display">System Overview</h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-[var(--color-surface-bright)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
          title="Toggle Theme"
        >
          {!mounted ? <Moon size={20} /> : theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button 
          onClick={toggleFreezeMode}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md font-mono text-xs md:text-sm transition-all ${
            (mounted && isFreezeMode)
              ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] shadow-[0_0_15px_rgba(0,238,252,0.4)]' 
              : 'border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-bright)]'
          }`}
        >
          <Snowflake size={16} />
          <span className="hidden md:inline">{(mounted && isFreezeMode) ? 'UNFREEZE CONTEST' : 'FREEZE CONTEST'}</span>
        </button>
        
        <button className="p-2 rounded-full hover:bg-[var(--color-surface-bright)] text-[var(--color-error)]" title="Sign out">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
