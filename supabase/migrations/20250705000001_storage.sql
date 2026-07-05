-- Storage bucket for viewpoint images
insert into storage.buckets (id, name, public)
values ('viewpoint-images', 'viewpoint-images', true)
on conflict (id) do nothing;

create policy "Anyone can view viewpoint images"
  on storage.objects for select
  using (bucket_id = 'viewpoint-images');

create policy "Authenticated users can upload viewpoint images"
  on storage.objects for insert
  with check (
    bucket_id = 'viewpoint-images'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own viewpoint images"
  on storage.objects for update
  using (
    bucket_id = 'viewpoint-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'viewpoint-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own viewpoint images"
  on storage.objects for delete
  using (
    bucket_id = 'viewpoint-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
