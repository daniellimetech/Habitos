-- Execute no SQL Editor do Supabase. Não apaga tabelas existentes.
begin;
create table if not exists public.habit_accounts (
 user_id uuid primary key references auth.users(id) on delete cascade,
 habits jsonb not null default '[]'::jsonb check (jsonb_typeof(habits) = 'array' and jsonb_array_length(habits) <= 200 and octet_length(habits::text) <= 2000000),
 revision integer not null default 1 check (revision > 0),
 updated_at timestamptz not null default now()
);
alter table public.habit_accounts enable row level security;
drop policy if exists "Read own habits" on public.habit_accounts;
create policy "Read own habits" on public.habit_accounts for select to authenticated using ((select auth.uid()) = user_id);
-- Escritas são permitidas apenas pela função atômica, não pela API da tabela.
revoke all on public.habit_accounts from anon, authenticated;
grant select on public.habit_accounts to authenticated;
create or replace function public.save_habits(p_habits jsonb, p_revision integer)
returns integer language plpgsql security definer set search_path = '' as $$
declare result integer;
begin
 if auth.uid() is null then raise exception 'Authentication required' using errcode = '42501'; end if;
 if p_revision < 0 or p_revision is null or p_habits is null or jsonb_typeof(p_habits) <> 'array' then raise exception 'Invalid payload'; end if;
 if p_revision = 0 then
   insert into public.habit_accounts(user_id, habits, revision) values (auth.uid(), p_habits, 1)
   on conflict (user_id) do nothing returning revision into result;
 else
   update public.habit_accounts set habits = p_habits, revision = revision + 1, updated_at = now()
   where user_id = auth.uid() and revision = p_revision returning revision into result;
 end if;
 if result is null then raise exception 'STALE_REVISION' using errcode = '40001'; end if;
 return result;
end;
$$;
revoke all on function public.save_habits(jsonb, integer) from public, anon;
grant execute on function public.save_habits(jsonb, integer) to authenticated;
commit;
