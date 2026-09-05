-- 升级：记录「谁用了激活码」
-- 在 Supabase SQL Editor 里运行一次即可

-- 1. 加 used_by 列（记录用码人的手机号/昵称）
alter table public.codes add column if not exists used_by text;

-- 2. 重建兑换函数（增加 p_user 参数，激活时记录用码人）
drop function if exists public.redeem_code(text) cascade;
create function public.redeem_code(p_code text, p_user text default null)
returns json language plpgsql security definer set search_path = public
as $$
declare c record;
begin
  select * into c from public.codes where code = upper(trim(p_code));
  if c is null then
    return json_build_object('ok', false, 'msg', '激活码无效，请检查');
  elsif c.used then
    return json_build_object('ok', false, 'msg', '该激活码已被使用');
  else
    update public.codes set used = true, used_at = now(), used_by = p_user where code = c.code;
    return json_build_object('ok', true, 'msg', '激活成功，已解锁全部功能');
  end if;
end;
$$;
grant execute on function public.redeem_code(text, text) to anon, authenticated;

-- 3. 查「哪些码被谁用了」用这句
-- select code, used_by, used_at from public.codes where used = true order by used_at desc;
