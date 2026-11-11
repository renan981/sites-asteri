/* Formulários e WhatsApp: abas do contato, "Receber tabela" em 2 etapas, "Agendar visita" em 2 etapas
   e janela de lead antes de qualquer link do WhatsApp. Usa window.SITE (config.js) e window.AsteriLead (linha do CRM, carregada antes deste arquivo).
   Versão limpa e consolidada dos módulos da Estância da Lapa (conversao-v24 + janela do WhatsApp).

   CONTRATO DE MARCAÇÃO (use estes atributos no HTML):
   Abas ............ botões [data-ctab="info|visita"] (role="tab") · painéis [data-cpanel="info|visita"]
   Telefone ........ <input name="telefone" data-mask="tel" required pattern="\(\d{2}\) \d{4,5}-\d{4}">
   Etapas .......... dentro do form: [data-step="1"] e [data-step="2"] · rótulo [data-step-label] · botão [data-submit] (texto num <span>)
   Pular ........... <button type="button" data-skip>
   Receber tabela .. <form data-lead="contato" novalidate> · etapa 1: nome, telefone · etapa 2: finalidade, prazo, email (opcionais)
   Agendar visita .. <form data-lead="visita" novalidate> · etapa 1: rádios finalidade, prazo, entrada (obrigatórios) + [data-vnext] + [data-verr]
                     etapa 2: [data-visit-days] (dias gerados aqui), rádios periodo, nome, telefone + [data-vback]
   Janela WhatsApp . <div id="leadGate" role="dialog" aria-modal="true" aria-hidden="true"> com [data-gate-close]
                     e <form data-lead="whatsapp" novalidate> · <input type="hidden" name="interesse">
                     etapa 1: nome, telefone · etapa 2: email, finalidade, entrada, prazo, profissao (opcionais)
   Qualquer <a href="https://wa.me/..."> ou [data-wa] abre a janela; o texto (?text=) define o Interesse. */
(function(){
  var S = window.SITE || {};
  var WA = 'https://wa.me/' + String(S.whatsapp || '').replace(/\D/g, '');
  function $(s, c){ return (c || document).querySelector(s); }
  function $$(s, c){ return [].slice.call((c || document).querySelectorAll(s)); }
  function lead(){ return window.AsteriLead || { start: function(){}, send: function(){ return Promise.resolve(false); } }; }
  function openWa(lines){ window.open(WA + '?text=' + encodeURIComponent(lines.filter(function(l){ return l !== null; }).join('\n')), '_blank', 'noopener'); }
  function val(form, name){ var d = new FormData(form).get(name); return d == null ? '' : String(d).trim(); }

  /* ---------- telefone: máscara (DD) 9XXXX-XXXX ---------- */
  document.addEventListener('input', function(e){
    var el = e.target; if(!el.matches || !el.matches('[data-mask="tel"]')) return;
    var v = el.value.replace(/\D/g, '').slice(0, 11);
    if(v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    else if(v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    else if(v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    el.value = v;
  });
  /* tira o aviso de erro assim que o campo fica válido */
  ['input', 'change'].forEach(function(t){ document.addEventListener(t, function(e){ var box = e.target.closest && e.target.closest('.field'); if(box && e.target.checkValidity && e.target.checkValidity()) box.classList.remove('is-invalid'); }); });

  /* valida só os campos informados; marca .is-invalid e foca o primeiro com erro */
  function check(fields){
    var bad = fields.filter(function(f){ if(!f) return false; var good = f.checkValidity() && (f.name !== 'nome' || /\p{L}{2,}/u.test(f.value)); var box = f.closest('.field'); if(box) box.classList.toggle('is-invalid', !good); return !good; });
    if(bad.length){ bad[0].focus(); if(bad[0].reportValidity) bad[0].reportValidity(); }
    return !bad.length;
  }
  /* etapa 2 revela os campos [data-step="2"]; os da etapa 1 continuam visíveis */
  function step(form, n, label, button){
    form.setAttribute('data-stage', n); form.classList.toggle('is-step2', n === 2);
    $$('[data-step="2"]', form).forEach(function(s){ s.hidden = n !== 2; });
    var l = $('[data-step-label]', form); if(l && label) l.textContent = label;
    var b = $('[data-submit] span', form) || $('[data-submit]', form); if(b && button) b.textContent = button;
  }
  function stage(form){ return +(form.getAttribute('data-stage') || 1); }

  /* ---------- abas do contato ---------- */
  document.addEventListener('click', function(e){
    var t = e.target.closest && e.target.closest('[data-ctab]'); if(!t) return;
    var tab = t.getAttribute('data-ctab');
    $$('[data-ctab]').forEach(function(b){ var on = b === t; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', String(on)); });
    $$('[data-cpanel]').forEach(function(p){ p.classList.toggle('is-active', p.getAttribute('data-cpanel') === tab); p.hidden = p.getAttribute('data-cpanel') !== tab; });
  });

  /* ---------- botões Pular (etapa 2) ---------- */
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-skip]'); if(!b) return;
    e.preventDefault();
    var form = b.closest('form'); if(form) submit(form, true);
  });
  document.addEventListener('submit', function(e){
    var form = e.target; if(!form.hasAttribute || !form.hasAttribute('data-lead')) return;
    e.preventDefault(); submit(form, false);
  });

  function submit(form, skip){
    var kind = form.getAttribute('data-lead');
    if(kind === 'contato') return contato(form, skip);
    if(kind === 'visita') return visita(form);
    if(kind === 'whatsapp') return janela(form, skip);
  }

  /* ---------- Receber tabela: 2 etapas ---------- */
  function contato(form, skip){
    if(stage(form) === 1){
      if(!check([form.elements.nome, form.elements.telefone])) return;
      lead().start('contato', { nome: val(form, 'nome'), telefone: val(form, 'telefone'), 'Interesse': 'Receber a tabela completa' });
      step(form, 2, 'Etapa 2 de 2 · opcional, ajuda o consultor a preparar seu atendimento', 'Enviar');
      var f = form.elements.finalidade; if(f) setTimeout(function(){ f.focus(); }, 60);
      return;
    }
    if(!skip && form.elements.email && !check([form.elements.email])) return;
    lead().send('contato', skip ? {} : { finalidade: val(form, 'finalidade'), 'Prazo para comprar': val(form, 'prazo'), email: val(form, 'email') });
    openWa([
      (S.mensagens && S.mensagens.tabela) || 'Olá, quero receber a tabela completa.', '',
      'Nome: ' + val(form, 'nome'), 'WhatsApp: ' + val(form, 'telefone'),
      !skip && val(form, 'finalidade') ? 'Finalidade: ' + val(form, 'finalidade') : null,
      !skip && val(form, 'prazo') ? 'Prazo para comprar: ' + val(form, 'prazo') : null,
      !skip && val(form, 'email') ? 'E-mail: ' + val(form, 'email') : null
    ]);
    form.classList.add('is-sent');
    var l = $('[data-step-label]', form); if(l) l.textContent = 'Pronto! Continue a conversa no WhatsApp que abrimos para você.';
  }

  /* ---------- Agendar visita: perfil → dia, período e contato ---------- */
  var days = $('[data-visit-days]');
  if(days){
    var wd = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'], excl = (S.visitas && S.visitas.excluirDiasDaSemana) || [], total = (S.visitas && S.visitas.proximosDias) || 8, html = '', d0 = new Date(), n = 0;
    for(var i = 1; n < total && i < 31; i++){
      var dt = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + i);
      if(excl.indexOf(dt.getDay()) !== -1) continue;
      var dd = String(dt.getDate()).padStart(2, '0') + '/' + String(dt.getMonth() + 1).padStart(2, '0');
      html += '<label><input type="radio" name="dia" value="' + wd[dt.getDay()] + ', ' + dd + '"' + (n === 0 ? ' checked' : '') + '/><span><b>' + wd[dt.getDay()] + '</b>' + dd + '</span></label>';
      n++;
    }
    days.innerHTML = html;
  }
  $$('form[data-lead="visita"]').forEach(function(form){
    var vstep = function(k){
      $$('[data-vstep]', form).forEach(function(s){ s.hidden = s.getAttribute('data-vstep') !== String(k); });
      var l = $('[data-step-label]', form); if(l) l.textContent = k === 1 ? 'Etapa 1 de 2 · antes de agendar, conte um pouco sobre você' : 'Etapa 2 de 2 · escolha o melhor dia para a visita';
    };
    form._vstep = vstep;
    var next = $('[data-vnext]', form), back = $('[data-vback]', form), err = $('[data-verr]', form);
    if(next) next.addEventListener('click', function(){
      var good = val(form, 'finalidade') && val(form, 'prazo') && val(form, 'entrada');
      if(err) err.hidden = !!good; if(!good) return;
      vstep(2); if(form.elements.nome) form.elements.nome.focus({ preventScroll: true });
    });
    if(back) back.addEventListener('click', function(){ vstep(1); });
    vstep(1);
  });
  function visita(form){
    var err = $('[data-verr]', form);
    if(!(val(form, 'finalidade') && val(form, 'prazo') && val(form, 'entrada'))){ if(form._vstep) form._vstep(1); if(err) err.hidden = false; return; }
    if(!check([form.elements.nome, form.elements.telefone])) return;
    var quando = val(form, 'dia') + ' — ' + val(form, 'periodo');
    lead().send('visita', { nome: val(form, 'nome'), telefone: val(form, 'telefone'), 'Interesse': 'Agendar visita', 'Dia e horário da visita': quando,
      finalidade: val(form, 'finalidade'), 'Prazo para comprar': val(form, 'prazo'), 'Valor para entrada': val(form, 'entrada') });
    openWa(['Olá, quero agendar uma visita ao ' + (S.nome || 'empreendimento') + '.', '', 'Dia: ' + val(form, 'dia') + ' (' + val(form, 'periodo') + ')',
      'Nome: ' + val(form, 'nome'), 'WhatsApp: ' + val(form, 'telefone'), 'Objetivo: ' + val(form, 'finalidade'), 'Prazo para comprar: ' + val(form, 'prazo'), 'Entrada: ' + val(form, 'entrada')]);
    form.classList.add('is-sent');
    var l = $('[data-step-label]', form); if(l) l.textContent = 'Pedido enviado! O consultor confirma o horário pelo WhatsApp.';
  }

  /* ---------- Janela de lead antes do WhatsApp ---------- */
  var gate = $('#leadGate'), gform = $('form[data-lead="whatsapp"]'), lastFocus = null;
  function interesse(t){
    var o = { 'Interesse': /simula|parcela/i.test(t) ? 'Simular minha parcela' : /tabela/i.test(t) ? 'Receber a tabela completa' : /visita/i.test(t) ? 'Agendar visita' : 'Falar no WhatsApp' };
    var m = t.match(/(R\$\s?[\d.]+)/); if(m && o['Interesse'] === 'Simular minha parcela') o['Faixa de investimento'] = m[1];
    return o;
  }
  function openGate(text){
    if(!gate || !gform){ window.open(WA + (text ? '?text=' + encodeURIComponent(text) : ''), '_blank', 'noopener'); return; }
    lastFocus = document.activeElement;
    gform.reset(); gform.classList.remove('is-sent');
    if(gform.elements.interesse) gform.elements.interesse.value = text || '';
    step(gform, 1, 'Etapa 1 de 2 · só nome e WhatsApp', 'Continuar');
    gate.classList.add('is-open'); gate.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    setTimeout(function(){ var f = gform.elements.nome; if(f) f.focus(); }, 50);
    try{ if(window.gtag) gtag('event', 'whatsapp_clique', { interesse: interesse(text || '')['Interesse'] }); }catch(e){}
  }
  function closeGate(){
    if(!gate) return;
    gate.classList.remove('is-open'); gate.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href*="wa.me/"], a[href*="api.whatsapp.com"], [data-wa]'); if(!a) return;
    if(gate && gate.contains(a)) return;
    e.preventDefault();
    var href = a.getAttribute('href') || '', m = href.match(/[?&]text=([^&]*)/);
    openGate(a.getAttribute('data-wa') || (m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : ''));
  }, true);
  if(gate){
    gate.addEventListener('click', function(e){ if(e.target === gate || (e.target.closest && e.target.closest('[data-gate-close]'))) closeGate(); });
    document.addEventListener('keydown', function(e){
      if(!gate.classList.contains('is-open')) return;
      if(e.key === 'Escape') return closeGate();
      if(e.key === 'Tab'){                                   // mantém o foco dentro da janela
        var f = $$('a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea', gate).filter(function(x){ return x.offsetParent !== null; });
        if(!f.length) return;
        if(e.shiftKey && document.activeElement === f[0]){ e.preventDefault(); f[f.length - 1].focus(); }
        else if(!e.shiftKey && document.activeElement === f[f.length - 1]){ e.preventDefault(); f[0].focus(); }
      }
    });
  }
  function janela(form, skip){
    var text = val(form, 'interesse'), info = interesse(text);
    if(stage(form) === 1){
      if(!check([form.elements.nome, form.elements.telefone])) return;
      lead().start('whatsapp', Object.assign({ nome: val(form, 'nome'), telefone: val(form, 'telefone') }, info));
      step(form, 2, 'Etapa 2 de 2 · opcional, ajuda o consultor', 'Abrir WhatsApp');
      return;
    }
    if(!skip && form.elements.email && !check([form.elements.email])) return;
    lead().send('whatsapp', skip ? info : Object.assign(info, { email: val(form, 'email'), finalidade: val(form, 'finalidade'),
      'Prazo para comprar': val(form, 'prazo'), 'Valor para entrada': val(form, 'entrada'), 'Profissão': val(form, 'profissao') }));
    var padrao = (S.mensagens && S.mensagens.padrao) || 'Olá!';
    var pedido = text && text !== padrao ? text.replace(/^Ol[áa][,!.]?\s*/i, '') : '';
    if(pedido) pedido = pedido.charAt(0).toUpperCase() + pedido.slice(1);
    openWa([
      padrao, pedido ? 'Pedido: ' + pedido : null,
      '', 'Nome: ' + val(form, 'nome'), 'WhatsApp: ' + val(form, 'telefone'),
      !skip && val(form, 'email') ? 'E-mail: ' + val(form, 'email') : null,
      !skip && val(form, 'finalidade') ? 'Finalidade: ' + val(form, 'finalidade') : null,
      !skip && val(form, 'prazo') ? 'Prazo para comprar: ' + val(form, 'prazo') : null,
      !skip && val(form, 'entrada') ? 'Valor para entrada: ' + val(form, 'entrada') : null,
      !skip && val(form, 'profissao') ? 'Profissão: ' + val(form, 'profissao') : null
    ]);
    closeGate();
  }
})();
