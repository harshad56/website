-- Jobs table
create table if not exists public.jobs (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    company text not null,
    location text not null,
    type text not null, -- 'full-time', 'part-time', 'contract', 'internship'
    salary_min numeric,
    salary_max numeric,
    salary_currency text default 'INR',
    experience text, -- 'entry', 'junior', 'mid', 'senior', 'lead'
    skills text[], -- Array of skills
    description text,
    requirements text[], -- Array of requirements
    benefits text[], -- Array of benefits
    category text, -- 'Web Development', 'Mobile Development', etc.
    is_remote boolean default false,
    is_featured boolean default false,
    is_active boolean default true,
    contact_email text not null,
    contact_phone text,
    contact_website text,
    company_pdf_url text, -- PDF file for company/job details
    applications_count integer default 0,
    posted_date timestamptz default now(),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Job applications table
create table if not exists public.job_applications (
    id uuid primary key default gen_random_uuid(),
    job_id uuid not null references public.jobs(id) on delete cascade,
    user_id uuid not null,
    status text default 'pending', -- 'pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'
    cover_letter text,
    resume_url text,
    applied_at timestamptz default now(),
    created_at timestamptz default now()
);

-- Saved jobs table (wishlist for jobs)
create table if not exists public.saved_jobs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    job_id uuid not null references public.jobs(id) on delete cascade,
    created_at timestamptz default now(),
    unique(user_id, job_id)
);

-- Enable Row Level Security (RLS)
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.saved_jobs enable row level security;

-- Policies for jobs (public read active jobs, admin write)
create policy "Jobs are viewable by everyone" on public.jobs
    for select using (is_active = true);

create policy "Admins can view all jobs" on public.jobs
    for select using (auth.jwt() ->> 'role' = 'admin');

create policy "Jobs are insertable by admins" on public.jobs
    for insert with check (auth.jwt() ->> 'role' = 'admin');

create policy "Jobs are updatable by admins" on public.jobs
    for update using (auth.jwt() ->> 'role' = 'admin');

create policy "Jobs are deletable by admins" on public.jobs
    for delete using (auth.jwt() ->> 'role' = 'admin');

-- Policies for job_applications (users can see their own applications)
create policy "Users can view their own applications" on public.job_applications
    for select using (auth.uid()::text = user_id::text);

create policy "Users can insert their own applications" on public.job_applications
    for insert with check (auth.uid()::text = user_id::text);

create policy "Admins can view all applications" on public.job_applications
    for select using (auth.jwt() ->> 'role' = 'admin');

-- Policies for saved_jobs (users can manage their own saved jobs)
create policy "Users can view their own saved jobs" on public.saved_jobs
    for select using (auth.uid()::text = user_id::text);

create policy "Users can insert their own saved jobs" on public.saved_jobs
    for insert with check (auth.uid()::text = user_id::text);

create policy "Users can delete their own saved jobs" on public.saved_jobs
    for delete using (auth.uid()::text = user_id::text);

-- Create indexes for better performance
create index if not exists idx_jobs_category on public.jobs(category);
create index if not exists idx_jobs_type on public.jobs(type);
create index if not exists idx_jobs_experience on public.jobs(experience);
create index if not exists idx_jobs_is_active on public.jobs(is_active);
create index if not exists idx_jobs_is_featured on public.jobs(is_featured);
create index if not exists idx_jobs_posted_date on public.jobs(posted_date);
create index if not exists idx_job_applications_job_id on public.job_applications(job_id);
create index if not exists idx_job_applications_user_id on public.job_applications(user_id);
create index if not exists idx_saved_jobs_user_id on public.saved_jobs(user_id);
create index if not exists idx_saved_jobs_job_id on public.saved_jobs(job_id);

