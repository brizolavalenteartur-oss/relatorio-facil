-- Cole tudo isto no SQL Editor do Supabase e clique em Run.

create table clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  month text not null,
  file_path text not null,
  file_name text not null,
  created_at timestamptz default now()
);

alter table clients enable row level security;
alter table reports enable row level security;

create policy "clientes proprios" on clients for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "relatorios proprios" on reports for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Pasta privada para os PDFs
insert into storage.buckets (id, name, public) values ('reports', 'reports', false);

create policy "ler proprios arquivos" on storage.objects for select
  using (bucket_id = 'reports' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "enviar proprios arquivos" on storage.objects for insert
  with check (bucket_id = 'reports' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "apagar proprios arquivos" on storage.objects for delete
  using (bucket_id = 'reports' and (storage.foldername(name))[1] = auth.uid()::text);
