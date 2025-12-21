-- Study materials table
create table if not exists public.study_materials (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    language text,
    category text,
    type text not null,
    price numeric default 0,
    original_price numeric,
    file_url text,
    setup_pdf_url text,
    thumbnail_url text,
    is_active boolean default true,
    is_featured boolean default false,
    created_at timestamptz default now()
);

alter table public.study_materials enable row level security;

create policy "Study materials are viewable by everyone" on public.study_materials
    for select using (true);

create policy "Study materials are insertable by admins" on public.study_materials
    for insert with check (auth.jwt() ->> 'role' = 'admin');

create policy "Study materials are updatable by admins" on public.study_materials
    for update using (auth.jwt() ->> 'role' = 'admin');

create policy "Study materials are deletable by admins" on public.study_materials
    for delete using (auth.jwt() ->> 'role' = 'admin');


