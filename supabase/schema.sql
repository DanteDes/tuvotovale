-- Teams
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  votes_count integer not null default 0,
  created_at timestamptz default now()
);

-- Payments
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  mp_payment_id text not null unique,
  team_id uuid references teams(id),
  status text not null default 'pending',
  amount numeric not null,
  fingerprint text,
  user_id uuid,
  created_at timestamptz default now()
);

-- Votes (se crea solo cuando payment es approved)
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) not null,
  payment_id text not null unique,
  fingerprint text,
  user_id uuid,
  created_at timestamptz default now()
);

-- Índices
create index if not exists votes_team_id_idx on votes(team_id);
create index if not exists votes_fingerprint_idx on votes(fingerprint);

-- Habilitar realtime en teams
alter publication supabase_realtime add table teams;

-- Función para incrementar votos atómicamente
create or replace function increment_votes(team_id uuid)
returns void as $$
  update teams set votes_count = votes_count + 1 where id = team_id;
$$ language sql;

-- Datos de ejemplo
insert into teams (name, slug, logo_url) values
  ('Boca Juniors', 'boca', null),
  ('River Plate', 'river', null),
  ('Racing Club', 'racing', null),
  ('Independiente', 'independiente', null),
  ('San Lorenzo', 'san-lorenzo', null)
on conflict (slug) do nothing;
