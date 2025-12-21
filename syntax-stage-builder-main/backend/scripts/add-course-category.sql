-- Add category column to courses if missing
alter table if exists public.courses
add column if not exists category text;











