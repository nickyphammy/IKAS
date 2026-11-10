-- Photo attribution and provenance for viewpoints.
--
-- Curated viewpoints use freely licensed photos (public domain, CC BY, CC BY-SA). CC BY and CC BY-SA
-- require crediting the author and linking the license, so the credit is stored next to the image.
-- `source` / `source_id` record where a curated spot came from (e.g. 'wikidata' / 'Q123') so the
-- curator never imports the same place twice. All columns are null for user-submitted viewpoints.

alter table public.viewpoints
  add column if not exists image_author text,
  add column if not exists image_license text,
  add column if not exists image_license_url text,
  add column if not exists image_source_url text,
  add column if not exists source text,
  add column if not exists source_id text;

create unique index if not exists viewpoints_source_uidx
  on public.viewpoints (source, source_id)
  where source_id is not null;

-- `v.*` in the view is expanded when the view is created, so recreate the view (and the function
-- that returns its row type) to expose the new columns.
drop function if exists public.viewpoints_within_radius(double precision, double precision, double precision);

drop view if exists public.viewpoints_with_stats;

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
