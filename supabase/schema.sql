-- ============================================================================
-- SCHEMA SUPABASE (POSTGRESQL) CHO WEBSITE QUY TRÌNH BÁO GIÁ
-- Chạy script này 1 lần trong Supabase Dashboard -> SQL Editor -> Run
-- ============================================================================

create extension if not exists pgcrypto;

-- 1. Bảng thông tin chung của quy trình (singleton id = 1)
create table if not exists public.workflow_meta (
  id integer primary key default 1 check (id = 1),
  eyebrow_category text not null default 'Quy trình nội bộ',
  eyebrow_module text not null default 'Quy trình báo giá',
  title text not null default 'Quy trình báo giá',
  dek text,
  version text not null default 'Chưa được cung cấp',
  organization text not null default 'Chưa được cung cấp',
  source_document text not null default 'Chưa được cung cấp',
  maintainer_contact text not null default 'Chưa được cung cấp',
  is_draft_placeholder boolean not null default true,
  draft_banner_text text not null default 'Dữ liệu nghiệp vụ hiện đang ở trạng thái Placeholder minh họa (dự kiến khoảng 7 bước sơ bộ). Tên bước, chủ trì, phối hợp, chứng từ và rủi ro sẽ được điền chính xác sau khi nhận tài liệu quy trình báo giá chính thức.',
  updated_at timestamptz not null default now()
);

-- 2. Bảng các bước trong quy trình báo giá (id UUID cố định cho mỗi bước)
create table if not exists public.workflow_steps (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null,
  code text not null,
  title text not null,
  is_placeholder boolean not null default false,
  description jsonb not null default '"Chưa được cung cấp"'::jsonb,
  lead jsonb not null default '"Chưa được cung cấp"'::jsonb,
  collaborators jsonb not null default '"Chưa được cung cấp"'::jsonb,
  inputs jsonb not null default '"Chưa được cung cấp"'::jsonb,
  outputs jsonb not null default '"Chưa được cung cấp"'::jsonb,
  risks jsonb not null default '"Chưa được cung cấp"'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_workflow_steps_sort_order
  on public.workflow_steps (sort_order asc, created_at asc);

-- 3. Bật Row Level Security (RLS)
-- Chỉ cho phép đọc công khai (SELECT); khóa toàn bộ INSERT / UPDATE / DELETE từ client.
-- Mọi thao tác ghi chỉ thực hiện từ Serverless API phía server bằng SUPABASE_SERVICE_ROLE_KEY.
alter table public.workflow_meta enable row level security;
alter table public.workflow_steps enable row level security;

drop policy if exists "Allow public read workflow_meta" on public.workflow_meta;
create policy "Allow public read workflow_meta"
  on public.workflow_meta
  for select
  using (true);

drop policy if exists "Allow public read workflow_steps" on public.workflow_steps;
create policy "Allow public read workflow_steps"
  on public.workflow_steps
  for select
  using (true);

-- 4. Khởi tạo dữ liệu mặc định ban đầu (chỉ chèn nếu chưa có dữ liệu)
insert into public.workflow_meta (id)
values (1)
on conflict (id) do nothing;

insert into public.workflow_steps (sort_order, code, title, is_placeholder)
select
  n,
  'Bước ' || lpad(n::text, 2, '0'),
  'Chưa được cung cấp tên bước',
  true
from generate_series(1, 7) as n
where not exists (select 1 from public.workflow_steps limit 1);
