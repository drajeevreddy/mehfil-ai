-- ============================================================
-- MEHFIL AI — Supabase schema (dormant by product decision)
--
-- The shipped version persists user data in browser storage only
-- (PRODUCT.md `## Stack`). This migration is READY TO APPLY the
-- day Supabase credentials exist: `supabase db push` (or run in
-- the SQL editor). Until then nothing reads or writes these
-- tables, and demo mode is fully functional without them.
--
-- The research corpus intentionally stores NO lyrics: verse text
-- is forbidden by product truth; only metadata, annotations,
-- citations and confidence live here.
-- ============================================================

create extension if not exists vector;

-- ---------- research knowledge base ----------

create table if not exists qawwali_catalog (
  slug            text primary key,
  verified_title  text not null check (length(verified_title) between 2 and 200),
  language        text not null,
  poetic_tradition text not null default 'qawwali',
  attributed_poet text check (attributed_poet is null or length(attributed_poet) >= 2),
  years_recorded  text,
  research_status text not null default 'sample_annotation'
                  check (research_status in ('verified_metadata', 'sample_annotation')),
  annotation_status text not null default 'sample_annotation'
                    check (annotation_status in ('sample_annotation', 'crowdsourced', 'reviewed')),
  confidence      text not null default 'medium' check (confidence in ('high', 'medium', 'low')),
  coverage_note   text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists research_annotations (
  id            uuid primary key default gen_random_uuid(),
  composition   text not null references qawwali_catalog(slug) on delete cascade,
  kind          text not null check (kind in ('interpretation', 'emotional_profile', 'concept', 'imagery', 'literary')),
  body          jsonb not null,
  embedding     vector(768),
  reviewed      boolean not null default false,
  created_at    timestamptz not null default now()
);
create index if not exists research_annotations_composition_idx on research_annotations (composition);
create index if not exists research_annotations_reviewed_idx on research_annotations (reviewed);
create index if not exists research_annotations_embedding_idx
  on research_annotations using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create table if not exists research_sources (
  id           uuid primary key default gen_random_uuid(),
  annotation   uuid references research_annotations(id) on delete cascade,
  composition  text references qawwali_catalog(slug) on delete cascade,
  label        text not null,
  url          text,
  kind         text not null default 'metadata' check (kind in ('metadata', 'scholarship', 'journalism')),
  created_at   timestamptz not null default now()
);

create table if not exists research_reviews (
  id          uuid primary key default gen_random_uuid(),
  annotation  uuid not null references research_annotations(id) on delete cascade,
  reviewer    text not null,
  verdict     text not null check (verdict in ('approved', 'rejected', 'changes-requested')),
  note        text,
  created_at  timestamptz not null default now()
);

-- ---------- symbolic + conceptual vocabularies ----------

create table if not exists sufi_concepts (
  key         text primary key,
  title       text not null,
  gloss       text not null
);

create table if not exists poetry_imagery (
  key         text primary key,
  urdu        text not null,
  hindi       text not null,
  gloss       text not null,
  fields      text[] not null default '{}'
);

-- ---------- generation records (server-session analytics; users' saved
-- poetry remains on-device by product decision) ----------

create table if not exists poetry_generation_history (
  id          uuid primary key default gen_random_uuid(),
  seed        bigint not null,
  intent      jsonb not null,
  form        text not null check (form in ('sher', 'quatrain', 'six-line', 'eight-line', 'ghazal-inspired')),
  language    text not null check (language in ('urdu', 'roman', 'hindi', 'english', 'urdu-en')),
  provider    text not null check (provider in ('local-core', 'anthropic-claude')),
  quality     jsonb not null,
  originality_flagged boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists pg_history_created_idx on poetry_generation_history (created_at desc);
create index if not exists pg_history_flagged_idx on poetry_generation_history (originality_flagged);

-- ---------- optional server-side saved shayari (future auth) ----------

create table if not exists saved_shayari (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null, -- auth.uid() once Supabase auth is wired
  payload     jsonb not null,
  collection  text not null default 'Uncollated',
  demo        boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists saved_shayari_user_idx on saved_shayari (user_id, created_at desc);

alter table saved_shayari enable row level security;
-- When Supabase auth is enabled, each user reads/writes only their own rows:
create policy "own rows read"    on saved_shayari for select using (auth.uid() = user_id);
create policy "own rows insert"  on saved_shayari for insert with check (auth.uid() = user_id);
create policy "own rows delete"  on saved_shayari for delete using (auth.uid() = user_id);

alter table poetry_generation_history enable row level security;
create policy "public read recent" on poetry_generation_history for select using (true);
-- inserts happen only server-side (service role), never from clients.

alter table qawwali_catalog enable row level security;
alter table research_annotations enable row level security;
alter table research_sources enable row level security;
alter table research_reviews enable row level security;
alter table sufi_concepts enable row level security;
alter table poetry_imagery enable row level security;
-- Public read for knowledge base; writes via service role only (admin API).
create policy "public read" on qawwali_catalog for select using (true);
create policy "public read" on research_annotations for select using (true);
create policy "public read" on research_sources for select using (true);
create policy "public read" on sufi_concepts for select using (true);
create policy "public read" on poetry_imagery for select using (true);
create policy "public read" on research_reviews for select using (true);
