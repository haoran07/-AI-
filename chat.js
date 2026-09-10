/* 自定义 AI 客服：调用 Dify Agent API（经服务器 nginx 中转，密钥不暴露）
   支持流式打字机 + Markdown 渲染 + 一键复制 + 「思考中…」占位 + 多轮记忆 */
(function(){
  var API_URL = '/api/dify/chat-messages';
  var convId = '';
  var busy = false;

  function uid(){
    try{
      var p = localStorage.getItem('hyr_phone');
      if(p) return p;
      var u = localStorage.getItem('_hy_uid');
      if(!u){ u = 'u' + Math.random().toString(36).slice(2,10); localStorage.setItem('_hy_uid', u); }
      return u;
    }catch(e){ return 'guest'; }
  }

  function escapeHtml(s){
    return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // 行内 Markdown：代码、加粗、链接
  function inlineMd(s){
    s = escapeHtml(s);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }

  // 极简 Markdown 渲染：代码块 / 标题 / 列表 / 段落
  function mdToHtml(md){
    var lines = (md||'').split('\n');
    var html = [];
    var inCode = false, codeBuf = [];
    var listType = '', listBuf = [];
    function flushList(){
      if(listBuf.length){
        html.push('<' + (listType||'ul') + '>' + listBuf.join('') + '</' + (listType||'ul') + '>');
        listBuf = []; listType = '';
      }
    }
    for(var i=0;i<lines.length;i++){
      var line = lines[i];
      var t = line.trim();
      if(t.indexOf('```') === 0){
        if(inCode){ html.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>'); codeBuf=[]; inCode=false; }
        else { flushList(); inCode = true; }
        continue;
      }
      if(inCode){ codeBuf.push(line); continue; }
      if(!t){ flushList(); continue; }
      var h = t.match(/^(#{1,3})\s+(.*)$/);
      if(h){ flushList(); var lv = h[1].length + 1; html.push('<h'+lv+'>' + inlineMd(h[2]) + '</h'+lv+'>'); continue; }
      var ul = t.match(/^[-*]\s+(.*)$/);
      if(ul){ if(listType !== 'ul'){ flushList(); listType = 'ul'; } listBuf.push('<li>' + inlineMd(ul[1]) + '</li>'); continue; }
      var ol = t.match(/^\d+[\.、]\s+(.*)$/);
      if(ol){ if(listType !== 'ol'){ flushList(); listType = 'ol'; } listBuf.push('<li>' + inlineMd(ol[1]) + '</li>'); continue; }
      flushList();
      html.push('<p>' + inlineMd(t) + '</p>');
    }
    flushList();
    if(inCode){ html.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>'); }
    return html.join('');
  }

  // 提取 Markdown 代码块内容（当作「提示词」），没有代码块返回空字符串
  function extractCode(md){
    var m = (md||'').match(/```[a-zA-Z]*\s*\n?([\s\S]*?)```/);
    return m ? m[1].replace(/\s+$/,'') : '';
  }

  // 判断当前是「思考中」还是「有回答」
  function renderState(full){
    var ts = full.indexOf('<think>');
    var te = full.indexOf('</think>');
    if(ts >= 0 && te < 0){ return { thinking:true, text:'' }; }
    if(te >= 0){ return { thinking:false, text: full.slice(te + 8).replace(/^\s+/, '') }; }
    return { thinking:false, text: full };
  }

  function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(text).then(function(){ return true; }).catch(function(){ return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly','');
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.focus(); ta.select();
    var ok = false; try{ ok = document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta);
    return ok;
  }

  function inject(){
    if(document.getElementById('hyChatBubble')) return;
    var bubble = document.createElement('button');
    bubble.id = 'hyChatBubble';
    bubble.type = 'button';
    bubble.innerHTML = '💬<span class="dot"></span>';
    bubble.onclick = toggle;

    var win = document.createElement('div');
    win.id = 'hyChatWindow';
    win.innerHTML =
      '<div class="head"><div class="avatar">🤖</div><div class="info"><b>AI 建站客服</b><span>在线 · 有问必答</span></div><button class="close" onclick="__hyChat.close()">✕</button></div>'+
      '<div class="body" id="hyChatBody"></div>'+
      '<div class="input"><input id="hyChatInput" placeholder="问我建站相关问题…" onkeydown="if(event.key===\'Enter\')__hyChat.send()"><button id="hyChatSend" onclick="__hyChat.send()">➤</button></div>';
    document.body.appendChild(bubble);
    document.body.appendChild(win);
    addAi('你好，我是浩然的 AI 建站助手 👋\n\n可以问我：\n- 怎么选组件\n- 怎么生成 Prompt\n- 建站流程和注意事项');
  }

  function toggle(){
    var w = document.getElementById('hyChatWindow');
    if(!w) return;
    w.classList.toggle('open');
    if(w.classList.contains('open')){
      var i = document.getElementById('hyChatInput');
      if(i) i.focus();
    }
  }

  function close(){
    var w = document.getElementById('hyChatWindow');
    if(w) w.classList.remove('open');
  }

  function addUser(text){
    var body = document.getElementById('hyChatBody');
    var d = document.createElement('div');
    d.className = 'msg me';
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }

  // 新增 AI 消息（markdown 内容 + 复制按钮，仅当有提示词时才显示复制按钮）
  function addAi(raw){
    var body = document.getElementById('hyChatBody');
    var d = document.createElement('div');
    d.className = 'msg ai';
    d.innerHTML = '<div class="md"></div><button class="copy-btn" onclick="__hyChat.copy(this)">📋 复制提示词</button>';
    body.appendChild(d);
    if(raw !== undefined){
      d.dataset.raw = raw;
      d.querySelector('.md').innerHTML = mdToHtml(raw);
      var prompt = extractCode(raw);
      if(prompt){ d.dataset.prompt = prompt; d.querySelector('.copy-btn').classList.add('show'); }
    }
    body.scrollTop = body.scrollHeight;
    return d;
  }

  function copy(btn){
    var msg = btn.closest('.msg');
    var text = (msg && msg.dataset.prompt) || '';
    if(!text && msg){ text = msg.querySelector('.md').innerText || ''; }
    copyText(text).then(function(ok){
      btn.textContent = ok ? '✅ 已复制' : '❌ 复制失败';
      setTimeout(function(){ btn.textContent = '📋 复制提示词'; }, 1500);
    });
  }

  async function send(){
    if(busy) return;
    var input = document.getElementById('hyChatInput');
    var text = (input.value || '').trim();
    if(!text) return;
    input.value = '';
    addUser(text);
    var aiEl = addAi();
    aiEl.querySelector('.md').innerHTML = '<div class="thinking"><span class="sp"></span>思考中…</div>';
    busy = true;
    var btn = document.getElementById('hyChatSend');
    if(btn) btn.disabled = true;

    var full = '';
    try{
      var resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: {},
          query: text,
          response_mode: 'streaming',
          conversation_id: convId,
          user: uid()
        })
      });
      if(!resp.ok) throw new Error('HTTP ' + resp.status);

      var reader = resp.body.getReader();
      var decoder = new TextDecoder();
      var buf = '';
      var seenAgent = false;

      while(true){
        var r = await reader.read();
        if(r.done) break;
        buf += decoder.decode(r.value, { stream: true });
        var lines = buf.split('\n');
        buf = lines.pop();
        for(var i = 0; i < lines.length; i++){
          var line = lines[i].trim();
          if(line.indexOf('data:') !== 0) continue;
          var payload = line.slice(5).trim();
          if(!payload || payload === '[DONE]') continue;
          var j;
          try{ j = JSON.parse(payload); }catch(e){ continue; }

          if(j.event === 'agent_message'){
            seenAgent = true;
            if(j.answer){ full += j.answer; }
          } else if(j.event === 'message' && !seenAgent){
            if(j.answer){ full += j.answer; }
          } else if(j.event === 'message_end'){
            if(j.conversation_id) convId = j.conversation_id;
            if(!full && j.answer){ full = j.answer; }
          } else if(j.event === 'error'){
            full = j.message || '出错了，请稍后再试';
          }
        }

        // 实时更新：思考中显示占位，有内容就渲染 markdown；有提示词就亮出复制按钮
        var st = renderState(full);
        if(st.thinking || !st.text){
          aiEl.querySelector('.md').innerHTML = '<div class="thinking"><span class="sp"></span>思考中…</div>';
        } else {
          aiEl.dataset.raw = st.text;
          aiEl.querySelector('.md').innerHTML = mdToHtml(st.text);
          var prompt = extractCode(st.text);
          if(prompt){
            aiEl.dataset.prompt = prompt;
            aiEl.querySelector('.copy-btn').classList.add('show');
          }
        }
        var body = document.getElementById('hyChatBody');
        if(body) body.scrollTop = body.scrollHeight;
      }
    }catch(e){
      full = full || '网络错误，请稍后再试';
    }

    var st = renderState(full);
    var finalText = st.text || '（没有收到回复，请稍后再试）';
    aiEl.dataset.raw = finalText;
    aiEl.querySelector('.md').innerHTML = mdToHtml(finalText);
    var prompt = extractCode(finalText);
    if(prompt){
      aiEl.dataset.prompt = prompt;
      aiEl.querySelector('.copy-btn').classList.add('show');
    }
    var body = document.getElementById('hyChatBody');
    if(body) body.scrollTop = body.scrollHeight;
    busy = false;
    if(btn) btn.disabled = false;
  }

  window.__hyChat = { send: send, close: close, copy: copy };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
