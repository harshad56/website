-- Study material purchases
create table if not exists public.study_material_purchases (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    study_material_id uuid not null references public.study_materials(id),
    amount numeric default 0,
    payment_status text default 'pending',
    razorpay_order_id text,
    razorpay_payment_id text,
    razorpay_signature text,
    created_at timestamptz default now()
);

alter table public.study_material_purchases enable row level security;

create policy "Users can view their own study material purchases" on public.study_material_purchases
    for select using (auth.uid() = user_id);

create policy "Users can insert their own study material purchases" on public.study_material_purchases
    for insert with check (auth.uid() = user_id);

create policy "Admins can view all study material purchases" on public.study_material_purchases
    for select using (auth.jwt() ->> 'role' = 'admin');

create policy "Admins can update all study material purchases" on public.study_material_purchases
    for update using (auth.jwt() ->> 'role' = 'admin');











