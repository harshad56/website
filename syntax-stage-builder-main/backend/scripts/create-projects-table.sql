-- Projects table
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    language text,
    category text,
    price numeric default 0,
    original_price numeric,
    thumbnail_url text,
    download_url text,
    setup_pdf_url text,
    is_active boolean default true,
    is_featured boolean default false,
    created_at timestamptz default now()
);

-- Purchases table
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

-- Downloads audit
create table if not exists public.project_downloads (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    project_id uuid not null references public.projects(id),
    created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.project_purchases enable row level security;

-- Policies for projects (public read, admin write)
create policy "Projects are viewable by everyone" on public.projects
    for select using (true);

create policy "Projects are insertable by admins" on public.projects
    for insert with check (auth.jwt() ->> 'role' = 'admin');

create policy "Projects are updatable by admins" on public.projects
    for update using (auth.jwt() ->> 'role' = 'admin');

create policy "Projects are deletable by admins" on public.projects
    for delete using (auth.jwt() ->> 'role' = 'admin');

-- Policies for project_purchases (users can see their own purchases)
create policy "Users can view their own purchases" on public.project_purchases
    for select using (auth.uid() = user_id);

create policy "Users can insert their own purchases" on public.project_purchases
    for insert with check (auth.uid() = user_id);

create policy "Admins can view all purchases" on public.project_purchases
    for select using (auth.jwt() ->> 'role' = 'admin');


