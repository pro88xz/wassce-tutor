-- Public, aggregate-only count of confirmed student accounts for the homepage.
-- No email addresses, profile fields, or individual user records are exposed.
create or replace function public.get_public_student_count()
returns bigint
language sql
stable
security definer
set search_path = ''
as $function$
  select count(*)
  from auth.users u
  where u.confirmed_at is not null
    and not exists (
      select 1
      from public.profiles p
      where p.id = u.id
        and p.is_admin is true
    );
$function$;

revoke all on function public.get_public_student_count() from public;
grant execute on function public.get_public_student_count() to anon, authenticated;
