'use client';

import { useEffect, useState } from 'react';
import { fetchParticipants } from '@/lib/api';
import { Search, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering and Sorting state
  const [search, setSearch] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [minProblems, setMinProblems] = useState('');
  const [maxRank, setMaxRank] = useState('');
  const [sortField, setSortField] = useState<'current_rank' | 'problems_solved' | 'penalty_time'>('current_rank');
  const [sortAsc, setSortAsc] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchParticipants();
      setParticipants(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Compute filtered and sorted participants
  let displayData = participants.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (institutionFilter && p.institution !== institutionFilter) return false;
    if (minProblems && p.problems_solved < parseInt(minProblems)) return false;
    if (maxRank && p.current_rank > parseInt(maxRank)) return false;
    return true;
  });

  displayData.sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const paginatedData = displayData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const uniqueInstitutions = Array.from(new Set(participants.map(p => p.institution)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--color-on-surface)]">Participant Management</h1>
        <p className="text-[var(--color-on-surface-variant)] text-sm">View, filter, and analyze contest participants</p>
      </div>

      <div className="glass rounded-xl p-4 md:p-6 space-y-4">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-mono text-[var(--color-on-surface-variant)] uppercase mb-1">Search Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[var(--color-outline)]" size={18} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="e.g. Alice Smith"
                className="w-full bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] rounded-md pl-10 pr-4 py-2 text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:outline-none"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-mono text-[var(--color-on-surface-variant)] uppercase mb-1">Institution</label>
            <select 
              value={institutionFilter}
              onChange={(e) => { setInstitutionFilter(e.target.value); setPage(1); }}
              className="w-full bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] rounded-md px-4 py-2 text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:outline-none"
            >
              <option value="">All Institutions</option>
              {uniqueInstitutions.map(inst => <option key={inst} value={inst}>{inst}</option>)}
            </select>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-mono text-[var(--color-on-surface-variant)] uppercase mb-1">Min Solved</label>
            <input 
              type="number" 
              value={minProblems}
              onChange={(e) => { setMinProblems(e.target.value); setPage(1); }}
              placeholder="e.g. 3"
              className="w-full bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] rounded-md px-4 py-2 text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-mono text-[var(--color-on-surface-variant)] uppercase mb-1">Max Rank</label>
            <input 
              type="number" 
              value={maxRank}
              onChange={(e) => { setMaxRank(e.target.value); setPage(1); }}
              placeholder="e.g. 50"
              className="w-full bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] rounded-md px-4 py-2 text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container-high)] border-b border-[var(--color-outline-variant)]">
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">Institution</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-secondary)]" onClick={() => toggleSort('current_rank')}>
                  <div className="flex items-center gap-1">Rank <ArrowUpDown size={14} /></div>
                </th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-secondary)]" onClick={() => toggleSort('problems_solved')}>
                  <div className="flex items-center gap-1">Solved <ArrowUpDown size={14} /></div>
                </th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-secondary)]" onClick={() => toggleSort('penalty_time')}>
                  <div className="flex items-center gap-1">Penalty <ArrowUpDown size={14} /></div>
                </th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-[var(--color-on-surface-variant)]">Loading...</td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-[var(--color-on-surface-variant)]">No participants found.</td></tr>
              ) : (
                paginatedData.map((p, i) => (
                  <tr key={p.id} className="border-b border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-highest)] transition-colors">
                    <td className="p-4 text-sm font-semibold text-[var(--color-on-surface)]">{p.name}</td>
                    <td className="p-4 text-sm text-[var(--color-on-surface-variant)]">{p.institution}</td>
                    <td className="p-4 text-sm font-mono text-[var(--color-primary)] font-bold">#{p.current_rank}</td>
                    <td className="p-4 text-sm font-mono text-[var(--color-on-surface)]">{p.problems_solved}</td>
                    <td className="p-4 text-sm font-mono text-[var(--color-on-surface-variant)]">{p.penalty_time}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold font-mono tracking-wider border ${
                        p.status === 'Active' 
                          ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] border-[var(--color-secondary)]' 
                          : 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)] border-[var(--color-error)]'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && displayData.length > 0 && (
          <div className="flex items-center justify-between text-sm font-mono text-[var(--color-on-surface-variant)]">
            <div>
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, displayData.length)} of {displayData.length}
            </div>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1 rounded bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] disabled:opacity-50 hover:bg-[var(--color-surface-bright)]"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1 rounded bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] disabled:opacity-50 hover:bg-[var(--color-surface-bright)]"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
