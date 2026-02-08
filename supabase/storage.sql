insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;
