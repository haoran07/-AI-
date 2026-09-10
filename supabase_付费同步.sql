-- 修复：换设备 / 清缓存后，登录时自动恢复付费状态
-- 在 Supabase SQL Editor 里运行一次即可（不会影响已有激活码数据）

-- 1. 新增「按手机号查是否已激活」函数（前端登录时自动调用）
create or replace function public.check_paid(p_user text)
returns json language sql security definer set search_path = public
as $$
  select json_build_object('paid', exists(select 1 from public.codes where used = true and used_by = p_user));
$$;
grant execute on function public.check_paid(text) to anon, authenticated;

-- 2. 让「重复输入自己已经用过的激活码」也能恢复权限（幂等，不再提示被占用）
create or replace function public.redeem_code(p_code text, p_user text default null)
returns json language plpgsql security definer set search_path = public
as $$
declare c record;
begin
  select * into c from public.codes where code = upper(trim(p_code));
  if c is null then
    return json_build_object('ok', false, 'msg', '激活码无效，请检查');
  elsif c.used and c.used_by is not null and c.used_by = p_user then
    -- 这个码就是当前账号用的：允许恢复权限，不报「被占用」
    return json_build_object('ok', true, 'msg', '该账号已激活，正在恢复权限');
  elsif c.used then
    return json_build_object('ok', false, 'msg', '该激活码已被使用');
  else
    update public.codes set used = true, used_at = now(), used_by = p_user where code = c.code;
    return json_build_object('ok', true, 'msg', '激活成功，已解锁全部功能');
  end if;
end;
$$;
grant execute on function public.redeem_code(text, text) to anon, authenticated;

-- 3. 手动核对某手机号是否已激活（可选，用于排查）
-- select * from public.check_paid('13800000000');
