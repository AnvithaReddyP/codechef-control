import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Trophy } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 flex flex-col h-full bg-[var(--color-surface-container)] border-r border-[var(--color-outline-variant)] hidden md:flex shrink-0">
      <div className="p-6 border-b border-[var(--color-outline-variant)]">
        <h1 className="text-xl font-bold font-display text-[var(--color-primary)]">CodeChef</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] font-mono">Control Center</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/" className="flex items-center gap-3 p-3 rounded-md hover:bg-[var(--color-surface-bright)] text-[var(--color-on-surface)] transition-colors">
          <LayoutDashboard size={20} className="text-[var(--color-primary)]" />
          Dashboard
        </Link>
        <Link href="/participants" className="flex items-center gap-3 p-3 rounded-md hover:bg-[var(--color-surface-bright)] text-[var(--color-on-surface)] transition-colors">
          <Users size={20} className="text-[var(--color-secondary)]" />
          Participants
        </Link>
        <Link href="/submissions" className="flex items-center gap-3 p-3 rounded-md hover:bg-[var(--color-surface-bright)] text-[var(--color-on-surface)] transition-colors">
          <FileText size={20} className="text-[var(--color-tertiary)]" />
          Submissions
        </Link>
        <Link href="/leaderboard" className="flex items-center gap-3 p-3 rounded-md hover:bg-[var(--color-surface-bright)] text-[var(--color-on-surface)] transition-colors">
          <Trophy size={20} className="text-[var(--color-primary-container)]" />
          Leaderboard
        </Link>
      </nav>
    </aside>
  );
}
