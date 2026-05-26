-- news 테이블
create table if not exists news (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  summary      text,
  url          text unique not null,
  source       text,
  categories   text[] default '{}',
  published_at date,
  created_at   timestamptz default now()
);

-- 인덱스
create index if not exists news_published_at_idx on news (published_at desc);
create index if not exists news_categories_idx on news using gin (categories);

-- RLS
alter table news enable row level security;

create policy "anon select" on news
  for select using (true);

create policy "service insert" on news
  for insert with check (true);

create policy "service update" on news
  for update using (true);
