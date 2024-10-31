-- Drop existing table if it exists
drop table if exists public.ponies;

-- Create the ponies table with category and role columns
create table public.ponies (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    kind text not null,
    personality text[] default '{}'::text[],
    skills text[] default '{}'::text[],
    description text,
    image text,
    category text,
    role text
);

-- Create a sequence for the id column
create sequence public.ponies_id_seq
    start with 1
    increment by 1;

-- Grant access to anon and authenticated roles
grant usage on schema public to anon, authenticated;
grant all privileges on table public.ponies to anon, authenticated;
grant usage on sequence public.ponies_id_seq to anon, authenticated;
