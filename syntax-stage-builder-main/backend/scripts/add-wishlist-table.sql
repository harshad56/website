-- Wishlist table (optional from Dec 9-12 state)
create table if not exists public.wishlist (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    item_id uuid not null,
    item_type text not null, -- 'project' | 'course' | 'study_material'
    created_at timestamptz default now()
);

alter table public.wishlist enable row level security;

create policy "Users can manage their wishlist" on public.wishlist
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);











