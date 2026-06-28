create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('student', 'business')),
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  business_name text not null,
  business_email text not null,
  business_phone text not null,
  location text not null,
  title text not null,
  description text not null,
  pay text not null,
  hours text not null,
  category text not null check (category in ('creative', 'tech', 'ops')),
  skills text[] not null default '{}',
  status text not null default 'open' check (status in ('open', 'hired', 'closed')),
  listing_fee_status text not null default 'pending' check (listing_fee_status in ('pending', 'paid')),
  selected_application_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  student_name text not null,
  student_email text not null,
  school text not null,
  availability text not null,
  skills text[] not null default '{}',
  portfolio_url text,
  resume text not null,
  status text not null default 'submitted' check (status in ('submitted', 'selected', 'not_selected')),
  student_fee_status text not null default 'pending' check (student_fee_status in ('pending', 'paid')),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  student_email text not null,
  message text not null,
  fee_amount numeric(10,2) not null default 5.00,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.listings
  add column if not exists owner_id uuid references public.profiles(id) on delete cascade;

alter table public.applications
  add column if not exists student_id uuid references public.profiles(id) on delete cascade;

alter table public.notifications
  add column if not exists student_id uuid references public.profiles(id) on delete cascade;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'listings_selected_application_fk'
  ) then
    alter table public.listings
      add constraint listings_selected_application_fk
      foreign key (selected_application_id)
      references public.applications(id)
      deferrable initially deferred;
  end if;
end
$$;

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.applications enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
drop policy if exists "Profiles can be created by owner" on public.profiles;
drop policy if exists "Profiles can be updated by owner" on public.profiles;

create policy "Profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles can be created by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles can be updated by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Public listings are readable" on public.listings;
drop policy if exists "Anyone can create a listing" on public.listings;
drop policy if exists "Business owner can update listing by email" on public.listings;
drop policy if exists "Business owners can create listings" on public.listings;
drop policy if exists "Business owners can update own listings" on public.listings;

create policy "Public listings are readable"
  on public.listings for select
  using (true);

create policy "Business owners can create listings"
  on public.listings for insert
  with check (
    auth.uid() = owner_id
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'business'
    )
  );

create policy "Business owners can update own listings"
  on public.listings for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Applications are readable for prototype" on public.applications;
drop policy if exists "Anyone can apply" on public.applications;
drop policy if exists "Applications can be updated for hiring" on public.applications;
drop policy if exists "Students and listing owners can read applications" on public.applications;
drop policy if exists "Students can apply to open listings" on public.applications;
drop policy if exists "Listing owners can select applications" on public.applications;

create policy "Students and listing owners can read applications"
  on public.applications for select
  using (
    auth.uid() = student_id
    or exists (
      select 1 from public.listings
      where listings.id = applications.listing_id
        and listings.owner_id = auth.uid()
    )
  );

create policy "Students can apply to open listings"
  on public.applications for insert
  with check (
    auth.uid() = student_id
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'student'
    )
    and exists (
      select 1 from public.listings
      where listings.id = listing_id
        and listings.status = 'open'
    )
  );

create policy "Listing owners can select applications"
  on public.applications for update
  using (
    exists (
      select 1 from public.listings
      where listings.id = applications.listing_id
        and listings.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.listings
      where listings.id = applications.listing_id
        and listings.owner_id = auth.uid()
    )
  );

drop policy if exists "Notifications are readable for prototype" on public.notifications;
drop policy if exists "Notifications can be created" on public.notifications;
drop policy if exists "Students and listing owners can read notifications" on public.notifications;
drop policy if exists "Listing owners can create notifications" on public.notifications;

create policy "Students and listing owners can read notifications"
  on public.notifications for select
  using (
    auth.uid() = student_id
    or exists (
      select 1
      from public.applications
      join public.listings on listings.id = applications.listing_id
      where applications.id = notifications.application_id
        and listings.owner_id = auth.uid()
    )
  );

create policy "Listing owners can create notifications"
  on public.notifications for insert
  with check (
    exists (
      select 1
      from public.applications
      join public.listings on listings.id = applications.listing_id
      where applications.id = application_id
        and applications.student_id = notifications.student_id
        and listings.owner_id = auth.uid()
    )
  );
