/* 全站登录系统：Supabase + 前端登录门禁（账号=手机号） */
(function(){
  var SUPABASE_URL = 'https://ysslreesusynfbrgxnew.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzc2xyZWVzdXN5bmZicmd4bmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjcwNDgsImV4cCI6MjEwNDA0MzA0OH0.UUObV7HAjVZ_I6YsT2tWRAjwx0YsQvRoiElHQFMzHwk';

  function email(p){ return (p||'').trim() + '@haoxixi.com'; }
  function cur(){ try{ return { nick: localStorage.getItem('hyr_nick')||'', token: localStorage.getItem('hyr_token')||'' }; }catch(e){ return {nick:'',token:''}; } }
  function $(id){ return document.getElementById(id); }

  // 注入登录门
  var gate = document.createElement('div');
  gate.id = 'authOverlay';
  gate.className = 'auth-overlay';
  gate.innerHTML =
    '<div class="auth-card">'+
      '<h2 class="auth-title" id="authTitle">登录</h2>'+
      '<p class="auth-sub">手机号即账号，登录后浏览全站内容</p>'+
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
  document.body.appendChild(pill);

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
    show: function(){ $('authOverlay').style.display = 'flex'; },
    hide: function(){ $('authOverlay').style.display = 'none'; },
    save: function(j, nick){
      try{ localStorage.setItem('hyr_token', j.access_token||''); localStorage.setItem('hyr_refresh', j.refresh_token||''); localStorage.setItem('hyr_nick', nick||''); }catch(e){}
    },
    register: async function(){
      var nick = $('regNick').value.trim(), phone = $('regPhone').value.trim(), pwd = $('regPwd').value;
      if(!nick || !phone || !pwd){ A.msg('请填写完整信息'); return; }
      if(!/^1\d{10}$/.test(phone)){ A.msg('请输入正确的 11 位手机号'); return; }
      if(pwd.length < 6){ A.msg('密码至少 6 位'); return; }
      var r = await fetch(SUPABASE_URL + '/auth/v1/signup', { method:'POST', headers:{'apikey':SUPABASE_ANON_KEY,'Content-Type':'application/json'}, body: JSON.stringify({ email: email(phone), password: pwd, data: { nickname: nick, phone: phone } }) });
      var j = await r.json();
      if(j.access_token){ A.save(j, nick); A.msg('注册成功，已登录', true); A.refresh(); setTimeout(A.hide, 600); }
      else { A.msg(j.msg || j.error_description || '注册失败，请重试'); }
    },
    login: async function(){
      var phone = $('loginPhone').value.trim(), pwd = $('loginPwd').value;
      if(!phone || !pwd){ A.msg('请填写手机号和密码'); return; }
      var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', { method:'POST', headers:{'apikey':SUPABASE_ANON_KEY,'Content-Type':'application/json'}, body: JSON.stringify({ email: email(phone), password: pwd }) });
      var j = await r.json();
      if(j.access_token){
        var nick = '';
        try { var u = await fetch(SUPABASE_URL + '/auth/v1/user', { headers:{'apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+j.access_token} }).then(function(x){ return x.json(); }); nick = (u.user_metadata && u.user_metadata.nickname) || phone; } catch(e){ nick = phone; }
        A.save(j, nick); A.msg('登录成功', true); A.refresh(); setTimeout(A.hide, 600);
      } else { A.msg(j.error_description || '登录失败，请检查手机号或密码'); }
    },
    logout: function(){
      try{ localStorage.removeItem('hyr_token'); localStorage.removeItem('hyr_refresh'); localStorage.removeItem('hyr_nick'); }catch(e){}
      A.refresh(); A.switchAuth('login'); A.show();
    },
    refresh: function(){
      var u = cur();
      if(u.nick){
        $('authNick').textContent = '👤 ' + u.nick;
        pill.style.display = 'flex';
        document.body.classList.remove('locked');
      } else {
        pill.style.display = 'none';
        document.body.classList.add('locked');
      }
    }
  };

  window.__auth = A;
  A.refresh();
  if(!cur().nick){ A.switchAuth('login'); A.show(); }
})();
