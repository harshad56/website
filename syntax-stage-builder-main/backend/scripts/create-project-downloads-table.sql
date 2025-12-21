-- Project downloads audit
create table if not exists public.project_downloads (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    project_id uuid not null references public.projects(id),
    created_at timestamptz default now()
);

alter table public.project_downloads enable row level security;

create policy "Users can view their own project downloads" on public.project_downloads
    for select using (auth.uid() = user_id);

create policy "Users can insert their own project downloads" on public.project_downloads
    for insert with check (auth.uid() = user_id);











