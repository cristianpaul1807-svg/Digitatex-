-- ============================================================================
-- Digitatex — esquema completo de Supabase
-- Correr en: Supabase Dashboard > SQL Editor > New query > Run
-- Es seguro correrlo varias veces (no duplica ni borra nada).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. LEADS — formulario de cotizacion
-- ----------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text,
  project_type text,
  integrations text[],
  existing_url text,
  wants_3d_scroll boolean default false,
  product_photo_urls text[],
  message text,
  estimated_price_min integer,
  estimated_price_max integer,
  estimated_maintenance_min integer,
  estimated_maintenance_max integer
);

alter table public.leads enable row level security;

-- El sitio usa la clave anonima desde el navegador: solo puede INSERTAR.
-- Nadie de afuera puede leer los leads (eso se ve desde el dashboard o el panel).
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads for insert to anon with check (true);

-- Vos, ya logueado en el panel de gestion, si podes leerlos.
drop policy if exists "authenticated can read leads" on public.leads;
create policy "authenticated can read leads"
  on public.leads for select to authenticated using (true);


-- ----------------------------------------------------------------------------
-- 2. TESTIMONIALS — links de reels de Instagram que subis desde el panel
-- ----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  instagram_url text not null,
  shortcode text,
  author_name text,
  author_handle text,
  quote text,
  cover_url text,
  sort_order integer default 0,
  published boolean default true
);

alter table public.testimonials enable row level security;

-- Cualquiera que visite la web puede VER los testimonios publicados.
drop policy if exists "public can read published testimonials" on public.testimonials;
create policy "public can read published testimonials"
  on public.testimonials for select to anon using (published = true);

-- Solo vos (logueado en el panel) podes crear / editar / borrar.
drop policy if exists "authenticated can read all testimonials" on public.testimonials;
create policy "authenticated can read all testimonials"
  on public.testimonials for select to authenticated using (true);

drop policy if exists "authenticated can insert testimonials" on public.testimonials;
create policy "authenticated can insert testimonials"
  on public.testimonials for insert to authenticated with check (true);

drop policy if exists "authenticated can update testimonials" on public.testimonials;
create policy "authenticated can update testimonials"
  on public.testimonials for update to authenticated using (true) with check (true);

drop policy if exists "authenticated can delete testimonials" on public.testimonials;
create policy "authenticated can delete testimonials"
  on public.testimonials for delete to authenticated using (true);


-- ----------------------------------------------------------------------------
-- 3. STORAGE — fotos del formulario + portadas de testimonios
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('testimonial-covers', 'testimonial-covers', true)
on conflict (id) do nothing;

drop policy if exists "anon can upload product photos" on storage.objects;
create policy "anon can upload product photos"
  on storage.objects for insert to anon
  with check (bucket_id = 'product-photos');

drop policy if exists "public can view product photos" on storage.objects;
create policy "public can view product photos"
  on storage.objects for select to public
  using (bucket_id in ('product-photos', 'testimonial-covers'));

drop policy if exists "authenticated can upload covers" on storage.objects;
create policy "authenticated can upload covers"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'testimonial-covers');

drop policy if exists "authenticated can delete covers" on storage.objects;
create policy "authenticated can delete covers"
  on storage.objects for delete to authenticated
  using (bucket_id = 'testimonial-covers');
