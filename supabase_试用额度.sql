-- 浩然 AI 实验室：云端试用额度
-- 在 Supabase Dashboard → SQL Editor 中完整执行一次。
-- 额度与 Supabase 登录用户 ID 绑定：清缓存、换设备后仍保持一致。

create table if not exists public.trial_quotas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  used_count integer not null default 0 check (used_count >= 0 and used_count <= 10),
  updated_at timestamptz not null default now()
);

alter table public.trial_quotas enable row level security;
revoke all on table public.trial_quotas from anon, authenticated;

-- 读取当前已登录账号的额度；客户端无法指定或冒用别人的账号。
create or replace function public.get_trial_quota()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare current_usage integer;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  insert into public.trial_quotas (user_id, used_count)
  values (auth.uid(), 0)
  on conflict (user_id) do nothing;

  select used_count into current_usage
  from public.trial_quotas
  where user_id = auth.uid();

  return json_build_object(
    'usage', current_usage,
    'limit', 10,
    'remaining', greatest(0, 10 - current_usage)
  );
end;
$$;

-- 原子扣减：多标签页同时提交时最多成功一次，不可能超出 10 次。
create or replace function public.consume_trial_quota()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare current_usage integer;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  insert into public.trial_quotas (user_id, used_count)
  values (auth.uid(), 0)
  on conflict (user_id) do nothing;

  update public.trial_quotas
  set used_count = used_count + 1, updated_at = now()
  where user_id = auth.uid() and used_count < 10
  returning used_count into current_usage;

  if found then
    return json_build_object(
      'ok', true,
      'usage', current_usage,
      'limit', 10,
      'remaining', 10 - current_usage
    );
  end if;

  select used_count into current_usage
  from public.trial_quotas
  where user_id = auth.uid();

  return json_build_object(
    'ok', false,
    'usage', coalesce(current_usage, 10),
    'limit', 10,
    'remaining', 0
  );
end;
$$;

revoke all on function public.get_trial_quota() from public, anon;
revoke all on function public.consume_trial_quota() from public, anon;
grant execute on function public.get_trial_quota() to authenticated;
grant execute on function public.consume_trial_quota() to authenticated;

-- 验证用：登录一个测试账号后，在网页完成一次方案生成，再在 SQL Editor 执行：
-- select * from public.trial_quotas;
