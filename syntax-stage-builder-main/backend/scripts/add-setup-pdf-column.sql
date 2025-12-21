-- Add setup_pdf_url column if missing
alter table if exists public.projects
add column if not exists setup_pdf_url text;

alter table if exists public.study_materials
add column if not exists setup_pdf_url text;











