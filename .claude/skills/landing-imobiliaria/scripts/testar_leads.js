// Testa os fluxos de lead SEM enviar nada ao CRM: intercepta o envio da linha do CRM (api/site/lead) e confere o corpo.
// A linha do CRM vem do próprio CRM (site conectado em Captação › Sites conectados). Se o CRM não responder (sem rede ou
// site ainda não conectado, como na página de teste com o código "teste"), o teste usa uma simulação da API padrão
// (AsteriLead.start/send com chave) e avisa: o comportamento real da linha é testado no repositório do CRM.
// Uso: node scripts/testar_leads.js <url-da-pagina> [padrao-do-envio]
// Ex.:  (cd templates && python3 -m http.server 8799 &) ; node scripts/testar_leads.js "http://localhost:8799/teste-leads.html?utm_source=teste&utm_campaign=x-captacao-202611"
// Num site real: node scripts/testar_leads.js "http://localhost:8790/index.html?utm_source=teste"
// Para ver as mensagens do WhatsApp geradas: VER=1 node scripts/testar_leads.js ...
// Com Playwright global: NODE_PATH=$(npm root -g) node scripts/testar_leads.js ...
const { chromium } = require('playwright');
const url = process.argv[2];
const hook = process.argv[3] || '**/api/site/lead**';
const SIMULACAO = "(function(){var CFG={api:'https://crm.simulacao.invalid/api/site/lead?s=teste',empreendimento:(window.SITE&&SITE.nome)||''};var q=new URLSearchParams(location.search),o={};['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','campaign_id','adset_id','ad_id'].forEach(function(k){if(q.get(k))o[k]=q.get(k);});var P={},ids={};function id(k){return ids[k]||(ids[k]='site-'+Math.random().toString(16).slice(2));}function m(L,d){Object.keys(d||{}).forEach(function(k){if(d[k]!=null&&String(d[k]).trim()!=='')L[k]=String(d[k]).trim();});return L;}function b(k,d){return m(Object.assign({lead_id:id(k),empreendimento:CFG.empreendimento,landing_page:location.href.split('#')[0],recebido_em:new Date().toISOString()},o),d);}window.AsteriLead={start:function(k,d){P[k]=P[k]?m(P[k],d):b(k,d);return P[k];},send:function(k,d){var L=P[k]?m(P[k],d):b(k,d);delete P[k];return fetch(CFG.api,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(L)}).then(function(r){return r.ok;}).catch(function(){return false;});}};})();";
if (!url) { console.error('Informe a URL da página.'); process.exit(2); }

const PROIBIDOS = ['canal'];
const OBRIGATORIOS = ['lead_id', 'nome', 'telefone', 'empreendimento', 'Interesse', 'recebido_em', 'landing_page'];
let falhas = 0;
const ok = (c, msg) => { console.log((c ? '  ✓ ' : '  ✗ ') + msg); if (!c) falhas++; };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const posts = [], popups = [], erros = [];
  p.on('pageerror', e => erros.push(e.message));
  p.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  await ctx.route(hook, r => { const d = r.request().postData() || ''; posts.push(d.trim().startsWith('{') ? JSON.parse(d) : Object.fromEntries(new URLSearchParams(d))); r.fulfill({ status: 200, body: 'Accepted' }); });
  await ctx.route('**/api/site/script.js**', async r => {
    try { const res = await r.fetch(); const body = await res.text(); if (res.ok() && /AsteriLead/.test(body)) { console.log('  · linha do CRM carregada do próprio CRM'); return r.fulfill({ status: 200, contentType: 'application/javascript', body }); } } catch (e) {}
    console.log('  ! linha do CRM indisponível (sem rede ou site não conectado): usando a simulação da API padrão');
    r.fulfill({ status: 200, contentType: 'application/javascript', body: SIMULACAO });
  });
  await ctx.route('https://wa.me/**', r => { popups.push(decodeURIComponent((r.request().url().split('text=')[1] || '').replace(/\+/g, ' '))); r.fulfill({ status: 200, body: 'wa' }); });
  ctx.on('page', np => np.close().catch(() => {}));
  await p.goto(url); await p.waitForTimeout(1800);

  const confere = (L, interesse) => {
    OBRIGATORIOS.forEach(k => ok(L && L[k], `campo "${k}" preenchido`));
    PROIBIDOS.forEach(k => ok(L && !(k in L), `sem campo "${k}"`));
    ok(L && L.Interesse === interesse, `Interesse = "${interesse}" (veio "${L && L.Interesse}")`);
    ok(L && /^\(\d{2}\) \d{4,5}-\d{4}$/.test(L.telefone), `telefone com máscara (${L && L.telefone})`);
  };

  console.log('1) Receber tabela (2 etapas)');
  await p.fill('form[data-lead="contato"] [name=nome]', 'Teste Site Automático');
  await p.type('form[data-lead="contato"] [name=telefone]', '31999998888');
  await p.click('form[data-lead="contato"] [data-submit]');
  ok(posts.length === 0, 'etapa 1 não envia na hora (fica pendente)');
  await p.selectOption('form[data-lead="contato"] [name=finalidade]', 'Investimento');
  await p.click('form[data-lead="contato"] [data-submit]');
  await p.waitForTimeout(400);
  ok(posts.length === 1, 'etapa 2 envia uma vez');
  confere(posts[0], 'Receber a tabela completa');
  ok(posts[0] && posts[0].finalidade === 'Investimento', 'finalidade da etapa 2 incluída');
  ok(popups.length === 1, 'WhatsApp aberto depois do envio');

  console.log('2) Janela de lead antes do WhatsApp');
  await p.click('a[href*="wa.me/"][href*="tabela"]');
  ok(await p.isVisible('#leadGate'), 'link do WhatsApp abre a janela');
  await p.fill('form[data-lead="whatsapp"] [name=nome]', 'Teste Site Janela');
  await p.type('form[data-lead="whatsapp"] [name=telefone]', '3133334444');
  await p.click('form[data-lead="whatsapp"] [data-submit]');
  await p.click('form[data-lead="whatsapp"] [data-skip]');
  await p.waitForTimeout(400);
  ok(posts.length === 2, 'pular na etapa 2 envia o lead');
  confere(posts[1], 'Receber a tabela completa');
  ok(!(await p.isVisible('#leadGate')), 'janela fecha depois de abrir o WhatsApp');

  console.log('3) Agendar visita');
  await p.click('[data-ctab="visita"]');
  await p.click('form[data-lead="visita"] [data-vnext]');
  ok(await p.isVisible('form[data-lead="visita"] [data-verr]'), 'exige as 3 respostas da etapa 1');
  for (const [n, v] of [['finalidade', 'Moradia'], ['prazo', 'Imediato'], ['entrada', 'Até R$ 50 mil']]) await p.check(`form[data-lead="visita"] input[name=${n}][value="${v}"]`);
  await p.click('form[data-lead="visita"] [data-vnext]');
  ok(await p.locator('form[data-lead="visita"] [data-visit-days] input').count() > 0, 'dias da visita gerados');
  await p.fill('form[data-lead="visita"] [name=nome]', 'Teste Site Visita');
  await p.type('form[data-lead="visita"] [name=telefone]', '31988887777');
  await p.click('form[data-lead="visita"] button[type=submit]');
  await p.waitForTimeout(400);
  ok(posts.length === 3, 'visita envia o lead');
  confere(posts[2], 'Agendar visita');
  ok(posts[2] && /—/.test(posts[2]['Dia e horário da visita'] || ''), 'dia e período enviados');

  console.log('4) Origem (UTM) e deduplicação');
  const temUtm = /utm_/.test(url);
  if (temUtm) ok(posts.every(L => L.utm_source), 'utm_source em todos os leads');
  ok(new Set(posts.map(L => L.lead_id)).size === posts.length, 'um lead_id por formulário');
  ok(erros.length === 0, 'sem erros no console' + (erros.length ? ': ' + erros.join(' | ') : ''));

  if (process.env.VER) { console.log('\nMensagens do WhatsApp:'); popups.forEach(t => console.log('---\n' + t)); }
  await b.close();
  console.log(falhas ? `\n${falhas} falha(s).` : '\nTudo certo.');
  process.exit(falhas ? 1 : 0);
})();
