import { supabase, isMockConfigured } from './supabase';
import { mockParticipants, mockProblems, mockSubmissions, mockActivities } from './mockData';

// Simulated delay for realistic mock loading
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function fetchStats() {
  try {
    if (isMockConfigured) throw new Error("Mock mode");
    const { data: p, error: errP } = await supabase.from('participants').select('id', { count: 'exact' });
    if (errP) throw errP;
    const { data: prob } = await supabase.from('problems').select('id', { count: 'exact' });
    const { data: sub } = await supabase.from('submissions').select('id, verdict');
    
    const accepted = sub?.filter(s => s.verdict === 'Accepted').length || 0;
    const rejected = (sub?.length || 0) - accepted;
    
    return {
      participants: p?.length || 0,
      problems: prob?.length || 0,
      totalSubmissions: sub?.length || 0,
      accepted,
      rejected
    };
  } catch (error) {
    if (!isMockConfigured) console.warn("Supabase fetch failed, using mock data", error);
    await delay(300);
    const accepted = mockSubmissions.filter(s => s.verdict === 'Accepted').length;
    return {
      participants: mockParticipants.length,
      problems: mockProblems.length,
      totalSubmissions: mockSubmissions.length,
      accepted,
      rejected: mockSubmissions.length - accepted
    };
  }
}

export async function fetchActivities() {
  try {
    if (isMockConfigured) throw new Error("Mock mode");
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(10);
    if (error) throw error;
    return data;
  } catch (error) {
    await delay(200);
    return [...mockActivities].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

export async function fetchParticipants() {
  try {
    if (isMockConfigured) throw new Error("Mock mode");
    const { data, error } = await supabase.from('participants').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    await delay(300);
    return [...mockParticipants];
  }
}

export async function fetchProblems() {
  try {
    if (isMockConfigured) throw new Error("Mock mode");
    const { data, error } = await supabase.from('problems').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    await delay(100);
    return [...mockProblems];
  }
}

export async function fetchSubmissions() {
  try {
    if (isMockConfigured) throw new Error("Mock mode");
    const { data, error } = await supabase.from('submissions').select(`
      id,
      submission_time,
      verdict,
      language,
      participant_id,
      participants ( name ),
      problem_id,
      problems ( name )
    `).order('submission_time', { ascending: false });
    if (error) throw error;
    return data.map(s => ({
      ...s,
      participant_name: (s.participants as any)?.name || 'Unknown',
      problem_name: (s.problems as any)?.name || 'Unknown'
    }));
  } catch (error) {
    await delay(300);
    return [...mockSubmissions].sort((a, b) => new Date(b.submission_time).getTime() - new Date(a.submission_time).getTime());
  }
}

export async function updateSubmissionVerdict(id: string, newVerdict: string) {
  try {
    if (isMockConfigured) throw new Error("Mock mode");
    const { data: subData, error: fetchErr } = await supabase.from('submissions').select('*').eq('id', id).single();
    if (fetchErr) throw fetchErr;

    const oldVerdict = subData.verdict;
    const { error } = await supabase.from('submissions').update({ verdict: newVerdict }).eq('id', id);
    if (error) throw error;

    // Recalculate participant score if transitioning to/from Accepted
    if (oldVerdict !== newVerdict && (oldVerdict === 'Accepted' || newVerdict === 'Accepted')) {
      const { data: partData } = await supabase.from('participants').select('*').eq('id', subData.participant_id).single();
      if (partData) {
        let diff = newVerdict === 'Accepted' ? 1 : -1;
        let penaltyDiff = newVerdict === 'Accepted' ? -20 : 20; // simplified mock penalty delta
        await supabase.from('participants').update({
          problems_solved: Math.max(0, partData.problems_solved + diff),
          penalty_time: Math.max(0, partData.penalty_time + penaltyDiff)
        }).eq('id', subData.participant_id);
      }
    }

    // Log activity
    await supabase.from('activities').insert({ description: `Submission ${id} rejudged to ${newVerdict}`, type: 'system' });
  } catch (error) {
    // In mock mode, update the mock array
    const sub = mockSubmissions.find(s => s.id === id);
    if (sub) {
      const oldVerdict = sub.verdict;
      sub.verdict = newVerdict;

      // Recalculate mock participant score
      if (oldVerdict !== newVerdict && (oldVerdict === 'Accepted' || newVerdict === 'Accepted')) {
        const participant = mockParticipants.find(p => p.id === sub.participant_id);
        if (participant) {
          if (newVerdict === 'Accepted') {
            participant.problems_solved += 1;
            participant.penalty_time = Math.max(0, participant.penalty_time - 20);
          } else {
            participant.problems_solved = Math.max(0, participant.problems_solved - 1);
            participant.penalty_time += 20;
          }
        }
      }
    }

    mockActivities.unshift({
      id: `a-${Date.now()}`,
      description: `Submission rejudged to ${newVerdict}`,
      type: 'system',
      created_at: new Date().toISOString()
    });
  }
}
