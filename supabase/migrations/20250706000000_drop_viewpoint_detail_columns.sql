-- Remove unused viewpoint detail columns (no longer tracked in the app)

drop function if exists public.viewpoints_within_radius(double precision, double precision, double precision);

drop view if exists public.viewpoints_with_stats;

alter table public.viewpoints
  drop column if exists best_time,
  drop column if exists difficulty,
  drop column if exists estimated_visit;

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
