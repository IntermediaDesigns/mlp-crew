-- Drop existing table if it exists
drop table if exists public.ponies;

-- Create the ponies table without auth
create table public.ponies (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    kind text not null,
    personality text[] default '{}'::text[],
    skills text[] default '{}'::text[],
    description text,
    image text
);

-- Grant access to anon and authenticated roles
grant usage on schema public to anon, authenticated;
grant all privileges on table public.ponies to anon, authenticated;
