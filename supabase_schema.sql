-- CodeChef Contest Control Center - Supabase Schema
-- Run this in your Supabase SQL Editor

-- 1. Participants Table
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    institution TEXT NOT NULL,
    current_rank INTEGER NOT NULL,
    problems_solved INTEGER NOT NULL DEFAULT 0,
    penalty_time INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Disqualified')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Problems Table
CREATE TABLE IF NOT EXISTS public.problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
    submission_time TIMESTAMPTZ DEFAULT now(),
    verdict TEXT NOT NULL CHECK (verdict IN ('Pending', 'Running', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error')),
    language TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Turn on Row Level Security (RLS) but allow read/write for now
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access for participants" ON public.participants FOR ALL USING (true);
CREATE POLICY "Allow public access for problems" ON public.problems FOR ALL USING (true);
CREATE POLICY "Allow public access for submissions" ON public.submissions FOR ALL USING (true);
CREATE POLICY "Allow public access for activities" ON public.activities FOR ALL USING (true);

-- Mock Data Seeding

INSERT INTO public.problems (id, name, difficulty) VALUES 
('11111111-1111-1111-1111-111111111111', 'A. Array Sum', 'Easy'),
('22222222-2222-2222-2222-222222222222', 'B. Binary Search Tree', 'Medium'),
('33333333-3333-3333-3333-333333333333', 'C. DP on Trees', 'Hard')
ON CONFLICT DO NOTHING;

INSERT INTO public.participants (id, name, institution, current_rank, problems_solved, penalty_time, status) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Alice Smith', 'VIT Chennai', 1, 3, 120, 'Active'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bob Johnson', 'VIT Vellore', 2, 2, 85, 'Active'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Charlie Brown', 'MIT', 3, 1, 30, 'Active')
ON CONFLICT DO NOTHING;

INSERT INTO public.submissions (participant_id, problem_id, verdict, language) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Accepted', 'C++'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Accepted', 'C++'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Wrong Answer', 'Java')
ON CONFLICT DO NOTHING;

INSERT INTO public.activities (description, type) VALUES 
('Contest Started', 'system'),
('Alice Smith submitted a solution for Array Sum', 'submission')
ON CONFLICT DO NOTHING;
