-- contests 테이블
create table if not exists contests (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  organizer     text,
  category      text,          -- ai | dev | planning | startup | etc
  start_date    date,
  end_date      date,
  prize         text,
  target        text,
  wevity_url    text unique,
  official_url  text,
  thumbnail_url text,
  source        text default 'wevity',
  scraped_at    timestamptz default now(),
  created_at    timestamptz default now()
);

-- 인덱스
create index if not exists contests_category_idx on contests (category);
create index if not exists contests_end_date_idx on contests (end_date);

-- RLS
alter table contests enable row level security;

create policy "anon select" on contests
  for select using (true);

create policy "service insert" on contests
  for insert with check (true);

create policy "service update" on contests
  for update using (true);
