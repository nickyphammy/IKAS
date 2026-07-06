-- Clear all IKAS app data (run in Supabase SQL Editor)
-- Order respects foreign keys; TRUNCATE is faster than DELETE

truncate table
  public.saved_viewpoints,
  public.viewpoint_ratings,
  public.viewpoint_tags,
  public.viewpoints,
  public.tags,
  public.profiles
restart identity cascade;

-- Clear uploaded images
delete from storage.objects
where bucket_id = 'viewpoint-images';

-- Note: auth users are NOT removed by this script.
-- To delete test accounts: Authentication → Users → select → Delete
