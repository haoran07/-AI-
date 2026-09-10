/* 自定义 AI 客服：调用 Dify Agent API（经服务器 nginx 中转，密钥不暴露）
   支持流式打字机输出 + 多轮对话记忆 */
(function(){
  var API_URL = '/api/dify/chat-messages';
  var convId = '';       // 多轮对话的会话ID（后端返回）
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

  // 过滤掉 <think>...</think> 思考块，只显示最终回答
  function stripThink(s){
    if(!s) return '';
    var end = s.indexOf('</think>');
    if(end >= 0){
      return s.slice(end + 8).replace(/^\s+/, '');
    }
    if(s.indexOf('<think>') >= 0){
      return '';   // 还在思考块里，先不显示
    }
    return s;
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
    addMsg('ai', '你好，我是浩然的 AI 建站助手 👋\n可以问我：怎么选组件、怎么生成 Prompt、建站流程等问题。');
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

  function addMsg(role, text, typing){
    var body = document.getElementById('hyChatBody');
    var d = document.createElement('div');
    d.className = 'msg ' + (role === 'me' ? 'me' : 'ai') + (typing ? ' typing' : '');
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }

  async function send(){
    if(busy) return;
    var input = document.getElementById('hyChatInput');
    var text = (input.value || '').trim();
    if(!text) return;
    input.value = '';
    addMsg('me', text);
    var aiEl = addMsg('ai', '', true);
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
            if(j.answer){ full += j.answer; aiEl.textContent = stripThink(full); aiEl.classList.remove('typing'); }
          } else if(j.event === 'message' && !seenAgent){
            // 兼容 Chatflow 型：answer 在 message 事件里
            if(j.answer){ full += j.answer; aiEl.textContent = stripThink(full); aiEl.classList.remove('typing'); }
          } else if(j.event === 'message_end'){
            if(j.conversation_id) convId = j.conversation_id;
            if(!full && j.answer){ full = j.answer; aiEl.textContent = stripThink(full); aiEl.classList.remove('typing'); }
          } else if(j.event === 'error'){
            full = j.message || '出错了，请稍后再试';
            aiEl.textContent = full; aiEl.classList.remove('typing');
          }
        }
        var body = document.getElementById('hyChatBody');
        if(body) body.scrollTop = body.scrollHeight;
      }
    }catch(e){
      full = full || '网络错误，请稍后再试';
    }

    var display = stripThink(full);
    if(!display){ display = '（没有收到回复，请稍后再试）'; }
    aiEl.textContent = display;
    aiEl.classList.remove('typing');
    var body = document.getElementById('hyChatBody');
    if(body) body.scrollTop = body.scrollHeight;
    busy = false;
    if(btn) btn.disabled = false;
  }

  window.__hyChat = { send: send, close: close };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
