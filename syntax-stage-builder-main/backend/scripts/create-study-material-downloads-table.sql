-- Study material downloads audit
create table if not exists public.study_material_downloads (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    study_material_id uuid not null references public.study_materials(id),
    created_at timestamptz default now()
);

alter table public.study_material_downloads enable row level security;

create policy "Users can view their own study material downloads" on public.study_material_downloads
    for select using (auth.uid() = user_id);

create policy "Users can insert their own study material downloads" on public.study_material_downloads
    for insert with check (auth.uid() = user_id);











