export const mockParticipants = [
  { id: '1', name: 'Alice Smith', institution: 'VIT Chennai', current_rank: 1, problems_solved: 3, penalty_time: 120, status: 'Active' },
  { id: '2', name: 'Bob Johnson', institution: 'VIT Vellore', current_rank: 2, problems_solved: 2, penalty_time: 85, status: 'Active' },
  { id: '3', name: 'Charlie Brown', institution: 'MIT', current_rank: 3, problems_solved: 1, penalty_time: 30, status: 'Active' },
  { id: '4', name: 'David Lee', institution: 'Stanford', current_rank: 4, problems_solved: 1, penalty_time: 45, status: 'Active' },
  { id: '5', name: 'Eve Davis', institution: 'VIT Chennai', current_rank: 5, problems_solved: 0, penalty_time: 0, status: 'Disqualified' },
];

export const mockProblems = [
  { id: '101', name: 'A. Array Sum', difficulty: 'Easy' },
  { id: '102', name: 'B. Binary Search Tree', difficulty: 'Medium' },
  { id: '103', name: 'C. DP on Trees', difficulty: 'Hard' },
  { id: '104', name: 'D. Network Flow', difficulty: 'Hard' },
];

export const mockSubmissions = [
  { id: 's1', participant_id: '1', participant_name: 'Alice Smith', problem_id: '101', problem_name: 'A. Array Sum', submission_time: new Date(Date.now() - 3600000).toISOString(), verdict: 'Accepted', language: 'C++' },
  { id: 's2', participant_id: '1', participant_name: 'Alice Smith', problem_id: '102', problem_name: 'B. Binary Search Tree', submission_time: new Date(Date.now() - 3000000).toISOString(), verdict: 'Accepted', language: 'C++' },
  { id: 's3', participant_id: '2', participant_name: 'Bob Johnson', problem_id: '101', problem_name: 'A. Array Sum', submission_time: new Date(Date.now() - 2500000).toISOString(), verdict: 'Accepted', language: 'Python' },
  { id: 's4', participant_id: '3', participant_name: 'Charlie Brown', problem_id: '103', problem_name: 'C. DP on Trees', submission_time: new Date(Date.now() - 1000000).toISOString(), verdict: 'Wrong Answer', language: 'Java' },
  { id: 's5', participant_id: '2', participant_name: 'Bob Johnson', problem_id: '102', problem_name: 'B. Binary Search Tree', submission_time: new Date(Date.now() - 500000).toISOString(), verdict: 'Time Limit Exceeded', language: 'Python' },
];

export const mockActivities = [
  { id: 'a1', description: 'Contest Started', type: 'system', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'a2', description: 'Alice Smith submitted a solution for Array Sum', type: 'submission', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'a3', description: 'Charlie Brown joined the contest', type: 'participant', created_at: new Date(Date.now() - 2800000).toISOString() },
  { id: 'a4', description: 'Leaderboard frozen', type: 'system', created_at: new Date(Date.now() - 60000).toISOString() },
];
