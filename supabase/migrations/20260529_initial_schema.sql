-- Fletix initial multi-tenant database schema (Argentina)

-- 1. Create Companies Table (Tenants)
create table public.companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  cuit text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Profiles Table (User details)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text not null,
  last_name text not null,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Memberships Table (Multi-tenant relationships & roles)
create table public.memberships (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null check (role in ('admin', 'operador', 'chofer', 'transportista')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(company_id, user_id)
);

-- 4. Create Indexes for Performance
create index idx_memberships_user_id on public.memberships(user_id);
create index idx_memberships_company_id on public.memberships(company_id);

-- 5. Enable Row Level Security (RLS)
alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;

-- 6. Helper Security Functions (security definer bypasses RLS for the function duration to avoid recursion)
create or replace function public.get_user_companies()
returns setof uuid as $$
  select company_id from public.memberships where user_id = auth.uid();
$$ language sql security definer set search_path = public;

create or replace function public.is_company_admin(comp_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.memberships 
    where company_id = comp_id and user_id = auth.uid() and role = 'admin'
  );
$$ language sql security definer set search_path = public;

-- 7. RLS Policies

-- Companies Policies
create policy "Users can view their own companies" 
  on public.companies for select 
  using (id in (select public.get_user_companies()));

create policy "Authenticated users can create companies" 
  on public.companies for insert 
  with check (auth.role() = 'authenticated');

create policy "Admins can update their company" 
  on public.companies for update 
  using (public.is_company_admin(id));

-- Profiles Policies
create policy "Users can view profiles in their company" 
  on public.profiles for select 
  using (
    id = auth.uid() or 
    exists (
      select 1 from public.memberships m1
      join public.memberships m2 on m1.company_id = m2.company_id
      where m1.user_id = auth.uid() and m2.user_id = profiles.id
    )
  );

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (id = auth.uid());

-- Memberships Policies
create policy "Members can view company memberships" 
  on public.memberships for select 
  using (company_id in (select public.get_user_companies()));

create policy "Authenticated users can insert first membership" 
  on public.memberships for insert 
  with check (auth.uid() = user_id);

create policy "Admins can update/delete company memberships" 
  on public.memberships for all 
  using (public.is_company_admin(company_id));

-- 8. Automate Profile Creation on Registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
