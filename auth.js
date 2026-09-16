/* 全站登录 + 付费系统：Supabase + 前端三层漏斗（账号=手机号）
   三层：visitor（访客，看落地页） / trial（登录未付费，试用） / paid（付费解锁，全部）
*/
(function(){
  var SUPABASE_URL = 'https://ysslreesusynfbrgxnew.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzc2xyZWVzdXN5bmZicmd4bmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjcwNDgsImV4cCI6MjEwNDA0MzA0OH0.UUObV7HAjVZ_I6YsT2tWRAjwx0YsQvRoiElHQFMzHwk';
  // 激活码已迁移到 Supabase（服务端校验 + 自动标记已用）

  function email(p){ return (p||'').trim() + '@haoxixi.com'; }
  function cur(){ try{ return { nick: localStorage.getItem('hyr_nick')||'', phone: localStorage.getItem('hyr_phone')||'', token: localStorage.getItem('hyr_token')||'', paid: localStorage.getItem('hyr_paid')||'' }; }catch(e){ return {nick:'',phone:'',token:'',paid:''}; } }
  function $(id){ return document.getElementById(id); }

  // 注入登录门
  var gate = document.createElement('div');
  gate.id = 'authOverlay';
  gate.className = 'auth-overlay';
  gate.innerHTML =
    '<div class="auth-card">'+
      '<button class="auth-close" onclick="__auth.hide()">✕</button>'+
      '<h2 class="auth-title" id="authTitle">登录</h2>'+
      '<p class="auth-sub">手机号即账号，登录后免费试用</p>'+
      '<div class="auth-tabs">'+
        '<button id="tabLogin" class="auth-tab active" onclick="__auth.switchAuth(\'login\')">登录</button>'+
        '<button id="tabReg" class="auth-tab" onclick="__auth.switchAuth(\'register\')">注册</button>'+
      '</div>'+
      '<div id="loginForm">'+
        '<div class="auth-field"><label>手机号</label><input id="loginPhone" inputmode="numeric" placeholder="请输入手机号"></div>'+
        '<div class="auth-field"><label>密码</label><input id="loginPwd" type="password" placeholder="请输入密码"></div>'+
        '<button class="auth-btn" onclick="__auth.login()">登录</button>'+
      '</div>'+
      '<div id="regForm" style="display:none;">'+
        '<div class="auth-field"><label>昵称</label><input id="regNick" placeholder="怎么称呼你"></div>'+
        '<div class="auth-field"><label>手机号</label><input id="regPhone" inputmode="numeric" placeholder="手机号作为登录账号"></div>'+
        '<div class="auth-field"><label>密码</label><input id="regPwd" type="password" placeholder="设置密码（至少 6 位）"></div>'+
        '<button class="auth-btn" onclick="__auth.register()">注册</button>'+
      '</div>'+
      '<div class="auth-msg" id="authMsg"></div>'+
    '</div>';
  document.body.appendChild(gate);

  // 注入用户信息（右上角）
  var pill = document.createElement('div');
  pill.id = 'authPill';
  pill.className = 'auth-pill';
  pill.innerHTML = '<span class="auth-pill-name" id="authNick"></span><button class="auth-pill-out" onclick="__auth.logout()">退出</button>';
  var nav = document.querySelector('.navbar'); if(nav){ nav.appendChild(pill); } else { document.body.appendChild(pill); }

  var FREE_WORKFLOW_LIMIT = 10;
  var workflowUsageValue = 0;
  var workflowReady = false;
  function rpcHeaders(){
    return { 'apikey':SUPABASE_ANON_KEY, 'Authorization':'Bearer '+cur().token, 'Content-Type':'application/json' };
  }
  function workflowUsage(){ return workflowUsageValue; }
  function workflowRemaining(){ return A.isPaid() ? Infinity : Math.max(0, FREE_WORKFLOW_LIMIT - workflowUsageValue); }

  // AI 建站顾问属于配置器的试用权益：登录用户可试用，年度版不限次数。
  function setChatVisible(v){
    var btn = document.getElementById('hyChatBubble');
    var win = document.getElementById('hyChatWindow');
    if(btn) btn.style.display = v ? '' : 'none';
    if(win) win.style.display = v ? '' : 'none';
  }

  var A = {
    switchAuth: function(mode){
      $('loginForm').style.display = mode==='login' ? '' : 'none';
      $('regForm').style.display = mode==='register' ? '' : 'none';
      $('tabLogin').classList.toggle('active', mode==='login');
      $('tabReg').classList.toggle('active', mode==='register');
      $('authTitle').textContent = mode==='login' ? '登录' : '注册';
      A.msg('');
    },
    msg: function(m, ok){
      var el = $('authMsg');
      el.textContent = m;
      el.style.display = m ? 'block' : 'none';
      el.className = 'auth-msg' + (ok ? ' ok' : '');
    },
    show: function(){ A.switchAuth('login'); $('authOverlay').style.display = 'flex'; },
    hide: function(){ $('authOverlay').style.display = 'none'; },
    save: function(j, nick, phone){
      try{ localStorage.setItem('hyr_token', j.access_token||''); localStorage.setItem('hyr_refresh', j.refresh_token||''); localStorage.setItem('hyr_nick', nick||''); if(phone) localStorage.setItem('hyr_phone', phone); }catch(e){}
    },
    register: async function(){
      var nick = $('regNick').value.trim(), phone = $('regPhone').value.trim(), pwd = $('regPwd').value;
      if(!nick || !phone || !pwd){ A.msg('请填写完整信息'); return; }
      if(!/^1\d{10}$/.test(phone)){ A.msg('请输入正确的 11 位手机号'); return; }
      if(pwd.length < 6){ A.msg('密码至少 6 位'); return; }
      var r = await fetch(SUPABASE_URL + '/auth/v1/signup', { method:'POST', headers:{'apikey':SUPABASE_ANON_KEY,'Content-Type':'application/json'}, body: JSON.stringify({ email: email(phone), password: pwd, data: { nickname: nick, phone: phone } }) });
      var j = await r.json();
      if(j.access_token){ A.save(j, nick, phone); A.msg('注册成功，已登录', true); A.refresh(); A.hide(); A.syncPaid().then(function(){ return A.syncTrialQuota(); }); document.dispatchEvent(new CustomEvent('haoran-auth-register')); }
      else { A.msg(j.msg || j.error_description || '注册失败，请重试'); }
    },
    login: async function(){
      var phone = $('loginPhone').value.trim(), pwd = $('loginPwd').value;
      if(!phone || !pwd){ A.msg('请填写手机号和密码'); return; }
      var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', { method:'POST', headers:{'apikey':SUPABASE_ANON_KEY,'Content-Type':'application/json'}, body: JSON.stringify({ email: email(phone), password: pwd }) });
      var j = await r.json();
      if(j.access_token){
        var nick = '', phone2 = phone;
        try { var u = await fetch(SUPABASE_URL + '/auth/v1/user', { headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+j.access_token} }).then(function(x){ return x.json(); }); nick = (u.user_metadata && u.user_metadata.nickname) || phone; phone2 = (u.user_metadata && u.user_metadata.phone) || phone; } catch(e){ nick = phone; }
        A.save(j, nick, phone2); A.msg('登录成功', true); A.refresh(); A.hide(); A.syncPaid().then(function(){ return A.syncTrialQuota(); });
      } else { A.msg(j.error_description || '登录失败，请检查手机号或密码'); }
    },
    logout: function(){
      try{ localStorage.removeItem('hyr_token'); localStorage.removeItem('hyr_refresh'); localStorage.removeItem('hyr_nick'); localStorage.removeItem('hyr_paid'); localStorage.removeItem('hyr_phone'); }catch(e){}
      workflowUsageValue = 0; workflowReady = false;
      A.refresh();
    },
    // 兑换码解锁（Supabase 服务端校验 + 原子标记已用，前端看不到码）
    redeem: async function(code){
      code = (code||'').trim().toUpperCase();
      try{
        var r = await fetch(SUPABASE_URL + '/rest/v1/rpc/redeem_code', {
          method:'POST',
          headers:rpcHeaders(),
          body: JSON.stringify({ p_code: code, p_user: (cur().phone || cur().nick || '未登录') })
        });
        var j = await r.json();
        if(j && j.ok === true){
          try{ localStorage.setItem('hyr_paid','1'); }catch(e){}
          A.refresh();
          return { ok:true, msg: j.msg || '激活成功' };
        }
        return { ok:false, msg: (j && j.msg) || '激活码错误' };
      }catch(e){
        return { ok:false, msg:'网络错误，请重试' };
      }
    },
    isPaid: function(){ return cur().paid === '1'; },
    isTrial: function(){ return !!cur().nick && cur().paid !== '1'; },
    isVisitor: function(){ return !cur().nick; },
    getWorkflowLimit: function(){ return FREE_WORKFLOW_LIMIT; },
    getWorkflowUsage: function(){ return workflowUsage(); },
    getWorkflowRemaining: function(){ return workflowRemaining(); },
    isWorkflowReady: function(){ return A.isPaid() || workflowReady; },
    canUseWorkflow: function(){ return A.isPaid() || (workflowReady && workflowRemaining() > 0); },
    syncTrialQuota: async function(){
      if(A.isPaid()){ workflowReady = true; if(window.onAuthChange) window.onAuthChange(); return true; }
      if(!cur().token){ workflowUsageValue = 0; workflowReady = false; if(window.onAuthChange) window.onAuthChange(); return false; }
      workflowReady = false; if(window.onAuthChange) window.onAuthChange();
      try{
        var r = await fetch(SUPABASE_URL + '/rest/v1/rpc/get_trial_quota', { method:'POST', headers:rpcHeaders(), body:'{}' });
        var j = await r.json();
        if(!r.ok || !j || typeof j.usage !== 'number') throw new Error('quota sync failed');
        workflowUsageValue = Math.min(FREE_WORKFLOW_LIMIT, Math.max(0, j.usage));
        workflowReady = true;
        if(window.onAuthChange) window.onAuthChange();
        return true;
      }catch(e){
        workflowReady = false;
        if(window.onAuthChange) window.onAuthChange();
        return false;
      }
    },
    consumeWorkflow: async function(){
      if(A.isPaid()) return true;
      if(!cur().token) return false;
      try{
        var r = await fetch(SUPABASE_URL + '/rest/v1/rpc/consume_trial_quota', { method:'POST', headers:rpcHeaders(), body:'{}' });
        var j = await r.json();
        if(!r.ok || !j || typeof j.usage !== 'number') throw new Error('quota consume failed');
        workflowUsageValue = Math.min(FREE_WORKFLOW_LIMIT, Math.max(0, j.usage));
        workflowReady = true;
        if(window.onAuthChange) window.onAuthChange();
        return j.ok === true;
      }catch(e){
        workflowReady = false;
        if(window.onAuthChange) window.onAuthChange();
        return false;
      }
    },
    // 登录后向 Supabase 核对：这个手机号是否已经激活过（换设备/清缓存也能恢复付费状态）
    syncPaid: async function(){
      var u = cur();
      if(!u.phone){ return false; }
      if(u.paid === '1'){ return true; }
      try{
        var r = await fetch(SUPABASE_URL + '/rest/v1/rpc/check_paid', {
          method:'POST',
          headers:rpcHeaders(),
          body: JSON.stringify({ p_user: u.phone })
        });
        var j = await r.json();
        if(j && j.paid === true){
          try{ localStorage.setItem('hyr_paid','1'); }catch(e){}
          A.refresh();
          return true;
        }
        return false;
      }catch(e){ return false; }
    },
    refresh: function(){
      var u = cur();
      if(u.nick){
        pill.style.display = 'flex';
        $('authNick').textContent = '👤 ' + u.nick;
      } else {
        pill.style.display = 'none';
      }
      document.body.classList.toggle('visitor', !u.nick);
      document.body.classList.toggle('trial', !!u.nick && u.paid !== '1');
      document.body.classList.toggle('paid', u.paid === '1');
      document.body.classList.toggle('locked', u.paid !== '1');
      if(u.nick){ A.hide(); }
      setChatVisible(!!u.nick);
      if(window.onAuthChange){ window.onAuthChange(); }
    }
  };

  window.__auth = A;
  A.refresh();
  A.syncPaid().then(function(){ return A.syncTrialQuota(); });
})();
