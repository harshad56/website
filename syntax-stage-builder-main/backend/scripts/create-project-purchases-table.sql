-- Project purchases table (separated for clarity)
create table if not exists public.project_purchases (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    project_id uuid not null references public.projects(id),
    amount numeric default 0,
    payment_status text default 'pending',
    razorpay_order_id text,
    razorpay_payment_id text,
    razorpay_signature text,
    created_at timestamptz default now()
);

alter table public.project_purchases enable row level security;

create policy "Users can view their own purchases" on public.project_purchases
    for select using (auth.uid() = user_id);

create policy "Users can insert their own purchases" on public.project_purchases
    for insert with check (auth.uid() = user_id);

create policy "Admins can view all purchases" on public.project_purchases
    for select using (auth.jwt() ->> 'role' = 'admin');











