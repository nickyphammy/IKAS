-- Enable PostGIS for geospatial queries
create extension if not exists postgis with schema extensions;

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Viewpoints
create table public.viewpoints (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  location extensions.geography(point, 4326) generated always as (
    extensions.st_setsrid(extensions.st_makepoint(longitude, latitude), 4326)::extensions.geography
  ) stored,
  best_time text,
  difficulty text,
  estimated_visit text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index viewpoints_location_idx on public.viewpoints using gist (location);

alter table public.viewpoints enable row level security;

create policy "Viewpoints are viewable by everyone"
  on public.viewpoints for select
  using (true);

create policy "Authenticated users can create viewpoints"
  on public.viewpoints for insert
  with check (auth.uid() = created_by);

create policy "Owners can update viewpoints"
  on public.viewpoints for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Owners can delete viewpoints"
  on public.viewpoints for delete
  using (auth.uid() = created_by);

-- Tags
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

alter table public.tags enable row level security;

create policy "Tags are viewable by everyone"
  on public.tags for select
  using (true);

create policy "Authenticated users can create tags"
  on public.tags for insert
  with check (auth.uid() is not null);

create table public.viewpoint_tags (
  viewpoint_id uuid not null references public.viewpoints (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (viewpoint_id, tag_id)
);

alter table public.viewpoint_tags enable row level security;

create policy "Viewpoint tags are viewable by everyone"
  on public.viewpoint_tags for select
  using (true);

create policy "Authenticated users can tag viewpoints"
  on public.viewpoint_tags for insert
  with check (auth.uid() is not null);

-- Ratings
create table public.viewpoint_ratings (
  id uuid primary key default gen_random_uuid(),
  viewpoint_id uuid not null references public.viewpoints (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now(),
  unique (viewpoint_id, user_id)
);

alter table public.viewpoint_ratings enable row level security;

create policy "Ratings are viewable by everyone"
  on public.viewpoint_ratings for select
  using (true);

create policy "Users can insert own ratings"
  on public.viewpoint_ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ratings"
  on public.viewpoint_ratings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own ratings"
  on public.viewpoint_ratings for delete
  using (auth.uid() = user_id);

-- Saved viewpoints
create table public.saved_viewpoints (
  user_id uuid not null references auth.users (id) on delete cascade,
  viewpoint_id uuid not null references public.viewpoints (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, viewpoint_id)
);

alter table public.saved_viewpoints enable row level security;

create policy "Users can view own saved viewpoints"
  on public.saved_viewpoints for select
  using (auth.uid() = user_id);

create policy "Users can save viewpoints"
  on public.saved_viewpoints for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave viewpoints"
  on public.saved_viewpoints for delete
  using (auth.uid() = user_id);

-- View with aggregate stats
create or replace view public.viewpoints_with_stats
with (security_invoker = true) as
select
  v.*,
  round(avg(r.rating)::numeric, 1) as avg_rating,
  count(r.rating)::int as rating_count,
  coalesce(
    array_agg(distinct t.name) filter (where t.name is not null),
    '{}'::text[]
  ) as tags
from public.viewpoints v
left join public.viewpoint_ratings r on r.viewpoint_id = v.id
left join public.viewpoint_tags vt on vt.viewpoint_id = v.id
left join public.tags t on t.id = vt.tag_id
group by v.id;

-- Radius search function (miles)
create or replace function public.viewpoints_within_radius(
  center_lat double precision,
  center_lng double precision,
  radius_miles double precision
)
returns setof public.viewpoints_with_stats
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select vws.*
  from public.viewpoints_with_stats vws
  join public.viewpoints v on v.id = vws.id
  where extensions.st_dwithin(
    v.location,
    extensions.st_setsrid(extensions.st_makepoint(center_lng, center_lat), 4326)::extensions.geography,
    radius_miles * 1609.344
  );
$$;

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger viewpoints_updated_at
  before update on public.viewpoints
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
