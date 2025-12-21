-- User resumes table for job recommendations
create table if not exists public.user_resumes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    resume_url text not null,
    raw_text text,
    extracted_skills text[],         -- normalized skills/keywords
    preferred_domains text[],        -- e.g., 'Web Development', 'Marketing'
    created_at timestamptz default now()
);

alter table public.user_resumes enable row level security;

-- Users can manage their own resumes
drop policy if exists "Users can view their own resumes" on public.user_resumes;
drop policy if exists "Users can insert their own resumes" on public.user_resumes;
drop policy if exists "Admins can view all resumes" on public.user_resumes;

create policy "Users can view their own resumes" on public.user_resumes
    for select using (auth.uid()::text = user_id::text);

create policy "Users can insert their own resumes" on public.user_resumes
    for insert with check (auth.uid()::text = user_id::text);

-- Admins can view all resumes
create policy "Admins can view all resumes" on public.user_resumes
    for select using (auth.jwt() ->> 'role' = 'admin');

create index if not exists idx_user_resumes_user_id on public.user_resumes(user_id);


