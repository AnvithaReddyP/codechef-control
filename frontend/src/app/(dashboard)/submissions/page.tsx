'use client';

import { useEffect, useState } from 'react';
import { fetchSubmissions, fetchProblems, fetchParticipants, updateSubmissionVerdict } from '@/lib/api';
import { Search, RotateCcw } from 'lucide-react';
import { useContestStore } from '@/store/contestStore';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('');
  const [problemFilter, setProblemFilter] = useState('');
  const [participantFilter, setParticipantFilter] = useState('');
  
  const { isFreezeMode } = useContestStore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [subs, probs, parts] = await Promise.all([
        fetchSubmissions(),
        fetchProblems(),
        fetchParticipants()
      ]);
      setSubmissions(subs);
      setProblems(probs);
      setParticipants(parts);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleRejudge = async (id: string, currentVerdict: string) => {
    if (isFreezeMode) {
      alert("Cannot rejudge while contest is in Freeze Mode.");
      return;
    }
    
    const newVerdict = prompt("Enter new verdict (e.g. 'Accepted', 'Wrong Answer', 'Time Limit Exceeded'):", currentVerdict);
    if (!newVerdict || newVerdict === currentVerdict) return;
    
    const validVerdicts = ['Pending', 'Running', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'];
    if (!validVerdicts.includes(newVerdict)) {
      alert("Invalid verdict.");
      return;
    }
    
    // Optimistic UI Update
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, verdict: newVerdict } : s));
    
    await updateSubmissionVerdict(id, newVerdict);
  };

  let displayData = submissions.filter(s => {
    if (search && !(s.participant_name.toLowerCase().includes(search.toLowerCase()) || s.problem_name.toLowerCase().includes(search.toLowerCase()))) return false;
    if (verdictFilter && s.verdict !== verdictFilter) return false;
    if (problemFilter && s.problem_id !== problemFilter) return false;
    if (participantFilter && s.participant_id !== participantFilter) return false;
    return true;
  });

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'Accepted': return 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] border-[var(--color-secondary)]';
      case 'Wrong Answer': return 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)] border-[var(--color-error)]';
      case 'Time Limit Exceeded':
      case 'Runtime Error': return 'bg-orange-500/20 text-orange-200 border-orange-500';
      default: return 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] border-[var(--color-outline)]';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--color-on-surface)]">Submissions Monitoring</h1>
        <p className="text-[var(--color-on-surface-variant)] text-sm">Real-time code evaluation tracking</p>
      </div>

      <div className="glass rounded-xl p-4 md:p-6 space-y-4">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-mono text-[var(--color-on-surface-variant)] uppercase mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[var(--color-outline)]" size={18} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Participant or Problem..."
                className="w-full bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] rounded-md pl-10 pr-4 py-2 text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:outline-none"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-mono text-[var(--color-on-surface-variant)] uppercase mb-1">Verdict</label>
            <select 
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="w-full bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] rounded-md px-4 py-2 text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:outline-none"
            >
              <option value="">All Verdicts</option>
              <option value="Accepted">Accepted</option>
              <option value="Wrong Answer">Wrong Answer</option>
              <option value="Time Limit Exceeded">Time Limit Exceeded</option>
              <option value="Runtime Error">Runtime Error</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-mono text-[var(--color-on-surface-variant)] uppercase mb-1">Problem</label>
            <select 
              value={problemFilter}
              onChange={(e) => setProblemFilter(e.target.value)}
              className="w-full bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] rounded-md px-4 py-2 text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:outline-none"
            >
              <option value="">All Problems</option>
              {problems.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-mono text-[var(--color-on-surface-variant)] uppercase mb-1">Participant</label>
            <select 
              value={participantFilter}
              onChange={(e) => setParticipantFilter(e.target.value)}
              className="w-full bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] rounded-md px-4 py-2 text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:outline-none"
            >
              <option value="">All Participants</option>
              {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container-high)] border-b border-[var(--color-outline-variant)]">
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">Participant</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">Problem</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">Time</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">Language</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider">Verdict</th>
                <th className="p-4 text-xs font-mono text-[var(--color-on-surface-variant)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-[var(--color-on-surface-variant)]">Loading...</td></tr>
              ) : displayData.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-[var(--color-on-surface-variant)]">No submissions found.</td></tr>
              ) : (
                displayData.map((s) => (
                  <tr key={s.id} className="border-b border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-highest)] transition-colors">
                    <td className="p-4 text-sm font-semibold text-[var(--color-on-surface)]">{s.participant_name}</td>
                    <td className="p-4 text-sm text-[var(--color-on-surface-variant)]">{s.problem_name}</td>
                    <td className="p-4 text-sm font-mono text-[var(--color-on-surface)]">{new Date(s.submission_time).toLocaleTimeString()}</td>
                    <td className="p-4 text-sm font-mono text-[var(--color-on-surface-variant)]">{s.language}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold font-mono tracking-wider border ${getVerdictStyle(s.verdict)}`}>
                        {s.verdict}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleRejudge(s.id, s.verdict)}
                        disabled={isFreezeMode}
                        className="p-2 rounded-md hover:bg-[var(--color-surface-bright)] text-[var(--color-tertiary)] disabled:opacity-30 transition-colors"
                        title="Rejudge Submission"
                      >
                        <RotateCcw size={16} />
                      </button>
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
