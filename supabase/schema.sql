-- ══════════════════════════════════════════════════════════
--  La Barbería — Supabase Schema
--  Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════

-- Tabla: barberos
create table if not exists public.barbers (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  alias         text,
  bio           text,
  experience    int default 0,
  rating        numeric(3,1) default 5.0,
  review_count  int default 0,
  styles        text[] default '{}',
  specialties   text[] default '{}',
  portfolio     text[] default '{}',   -- URLs de imágenes (Supabase Storage)
  instagram     text,
  chair         text,
  plan          text check (plan in ('Básico','Pro','Premium')) default 'Básico',
  available     boolean default true,
  badge         text check (badge in ('Disponible hoy','Alta demanda','Top rated') or badge is null),
  avatar_url    text,
  agendapro_url text,                  -- Link directo a AgendaPro del barbero
  active        boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Tabla: servicios por barbero
create table if not exists public.services (
  id         uuid primary key default gen_random_uuid(),
  barber_id  uuid references public.barbers(id) on delete cascade,
  name       text not null,
  duration   int not null,            -- minutos
  price      int not null,            -- CLP
  active     boolean default true,
  created_at timestamptz default now()
);

-- Índices
create index if not exists barbers_slug_idx on public.barbers(slug);
create index if not exists barbers_active_idx on public.barbers(active);
create index if not exists services_barber_idx on public.services(barber_id);

-- RLS: lectura pública, escritura solo autenticados (el dueño edita directo en Table Editor)
alter table public.barbers enable row level security;
alter table public.services enable row level security;

create policy "Lectura pública de barberos"
  on public.barbers for select
  using (active = true);

create policy "Lectura pública de servicios"
  on public.services for select
  using (active = true);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger barbers_updated_at
  before update on public.barbers
  for each row execute function public.handle_updated_at();

-- ══════════════════════════════════════════════════════════
--  DATOS DE EJEMPLO — borra esto en producción
-- ══════════════════════════════════════════════════════════

insert into public.barbers (slug, name, alias, bio, experience, rating, review_count, styles, specialties, instagram, chair, plan, available, badge, avatar_url, agendapro_url) values
(
  'matias-rojas', 'Matías Rojas', 'El Maestro',
  'Más de una década perfeccionando el arte clásico de la barbería. Especialista en barbas trabajadas con navaja y cortes que envejecen bien.',
  11, 4.9, 312,
  ARRAY['Clásico','Barba'],
  ARRAY['Navaja','Barba esculpida','Pompadour'],
  '@matias.barber', 'Silla 01', 'Premium', true, 'Top rated',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600',
  'https://labarberia.agendapro.com/cl'
),
(
  'kevo-flow', 'Kevin Soto', 'Kevo Flow',
  'Fades quirúrgicos y diseños personalizados. Si quieres salir distinto, este es tu barbero.',
  6, 4.8, 248,
  ARRAY['Fade','Moderno','Diseños'],
  ARRAY['Skin fade','Hair tattoo','Diseños'],
  '@kevo.flow', 'Silla 03', 'Pro', true, 'Disponible hoy',
  'https://images.unsplash.com/photo-1622253694238-3b22139576c6?w=600',
  'https://labarberia.agendapro.com/cl'
),
(
  'don-ramon', 'Ramón Vargas', 'Don Ramón',
  'Escuela de la vieja guardia. Corte preciso, conversación honesta y un gin tonic mientras esperas.',
  22, 5.0, 521,
  ARRAY['Clásico','Barba'],
  ARRAY['Tijera','Side part','Bigote handlebar'],
  '@donramon.barber', 'Silla 02', 'Premium', false, 'Alta demanda',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600',
  'https://labarberia.agendapro.com/cl'
),
(
  'tato-ink', 'Tomás Aravena', 'Tato Ink',
  'Barbero y artista. Estilos urbanos, texturas largas y trabajo de barba con carácter.',
  8, 4.7, 189,
  ARRAY['Moderno','Barba','Diseños'],
  ARRAY['Texturizado','Long hair','Barba full'],
  '@tato.ink', 'Silla 04', 'Pro', true, 'Disponible hoy',
  'https://images.unsplash.com/photo-1570158268183-d296b2892211?w=600',
  'https://labarberia.agendapro.com/cl'
);

-- Servicios para cada barbero
insert into public.services (barber_id, name, duration, price)
select id, 'Corte clásico', 30, 12000 from public.barbers where slug = 'matias-rojas'
union all
select id, 'Corte + Barba', 50, 18000 from public.barbers where slug = 'matias-rojas'
union all
select id, 'Fade premium', 45, 16000 from public.barbers where slug = 'matias-rojas'
union all
select id, 'Arreglo de barba', 25, 9000 from public.barbers where slug = 'matias-rojas'
union all
select id, 'Corte clásico', 30, 12000 from public.barbers where slug = 'kevo-flow'
union all
select id, 'Corte + Barba', 50, 18000 from public.barbers where slug = 'kevo-flow'
union all
select id, 'Fade premium', 45, 16000 from public.barbers where slug = 'kevo-flow'
union all
select id, 'Diseño + estilo', 60, 22000 from public.barbers where slug = 'kevo-flow'
union all
select id, 'Arreglo de barba', 25, 9000 from public.barbers where slug = 'kevo-flow'
union all
select id, 'Corte clásico', 30, 12000 from public.barbers where slug = 'don-ramon'
union all
select id, 'Corte + Barba', 50, 18000 from public.barbers where slug = 'don-ramon'
union all
select id, 'Arreglo de barba', 25, 9000 from public.barbers where slug = 'don-ramon'
union all
select id, 'Corte clásico', 30, 12000 from public.barbers where slug = 'tato-ink'
union all
select id, 'Corte + Barba', 50, 18000 from public.barbers where slug = 'tato-ink'
union all
select id, 'Fade premium', 45, 16000 from public.barbers where slug = 'tato-ink'
union all
select id, 'Diseño + estilo', 60, 22000 from public.barbers where slug = 'tato-ink'
union all
select id, 'Arreglo de barba', 25, 9000 from public.barbers where slug = 'tato-ink';
