// Teste dos leads SEM enviar nada ao CRM: intercepta api/site/lead e confere o corpo e o destino.
// Versão com a página /obrigado/ (FLT-07, OBR-01):
//   CRM confirma (200)  -> vai para /obrigado/?f=<chave> e guarda o link do WhatsApp para a página abrir
//   CRM não confirma    -> agradece na própria página e abre o WhatsApp
// Página sem /obrigado (SITE.obrigado vazio, ex.: templates/teste-leads.html): o envio abre o WhatsApp direto, e o teste aceita.
// Uso: node scripts/testar_leads.js "http://localhost:8799/index.html?utm_source=teste"
const { chromium } = require('playwright');
const url = process.argv[2]; if (!url) { console.error('Informe a URL.'); process.exit(2); }
const OBRIG = ['lead_id', 'nome', 'telefone', 'empreendimento', 'Interesse', 'recebido_em', 'landing_page'];
let falhas = 0; const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) falhas++; };
const SIM = "(function(){var q=new URLSearchParams(location.search),o={};['utm_source','utm_campaign'].forEach(function(k){if(q.get(k))o[k]=q.get(k);});var P={},n=0;function m(L,d){Object.keys(d||{}).forEach(function(k){if(d[k]!=null&&String(d[k]).trim()!=='')L[k]=String(d[k]).trim();});return L;}function b(d){return m(Object.assign({lead_id:'site-'+(++n)+Math.random().toString(16).slice(2),empreendimento:(window.SITE||{}).nome,landing_page:location.href,recebido_em:new Date().toISOString()},o),d);}window.AsteriLead={start:function(k,d){P[k]=P[k]?m(P[k],d):b(d);},send:function(k,d){var L=P[k]?m(P[k],d):b(d);delete P[k];return fetch('https://sandybrown-gazelle-848710.hostingersite.com/crm/api/site/lead?s=teste',{method:'POST',body:JSON.stringify(L)}).then(function(r){return r.ok;}).catch(function(){return false;});}};})();";

async function cenario(b, confirma) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const posts = [], was = [], erros = [];
  await ctx.route('**/api/site/lead**', r => { const d = r.request().postData() || ''; try { posts.push(JSON.parse(d)); } catch (e) { posts.push(Object.fromEntries(new URLSearchParams(d))); } r.fulfill(confirma ? { status: 200, body: 'Accepted' } : { status: 503, body: 'erro' }); });
  await ctx.route('**/api/site/script.js**', async r => { try { const res = await r.fetch(); const t = await res.text(); if (res.ok() && /AsteriLead/.test(t)) return r.fulfill({ status: 200, contentType: 'application/javascript', body: t }); } catch (e) {} r.fulfill({ status: 200, contentType: 'application/javascript', body: SIM }); });
  await ctx.route(/connect\.facebook\.net|googletagmanager|google-analytics/, r => r.abort());
  await ctx.route('https://wa.me/**', r => { was.push(decodeURIComponent((r.request().url().split('text=')[1] || '').replace(/\+/g, ' '))); r.fulfill({ status: 200, body: 'wa' }); });
  const p = await ctx.newPage(); p.on('pageerror', e => erros.push(e.message));
  ctx.on('page', np => { if (np !== p) np.close().catch(() => {}); });   // aba nova do WhatsApp
  const abrir = async () => { await p.goto(url); await p.waitForTimeout(1200); };
  const confere = (L, interesse) => { OBRIG.forEach(k => ok(L && L[k], `campo "${k}"`)); ok(L && !('canal' in L), 'sem campo "canal"'); ok(L && L.Interesse === interesse, `Interesse = ${interesse}`); ok(L && /^\(\d{2}\) \d{4,5}-\d{4}$/.test(L.telefone), 'telefone com máscara'); };
  const destino = async (kind) => {
    const temObrigado = await p.evaluate(() => !!(window.SITE && SITE.obrigado && SITE.obrigado.url)).catch(() => true);
    if (confirma && !temObrigado) { await p.waitForTimeout(800); ok(was.length >= 1, 'sem página de obrigado: abre o WhatsApp'); return; }
    if (confirma) { await p.waitForURL('**/obrigado/**', { timeout: 10000 }).catch(() => {}); ok(/\/obrigado\/\?f=/.test(p.url()) && p.url().includes('f=' + kind), `foi para /obrigado/?f=${kind}`);
      const wa = await p.evaluate(() => { try { return sessionStorage.getItem('asteri_wa'); } catch (e) { return null; } }); ok(wa && /^https:\/\/wa\.me\//.test(wa), 'link do WhatsApp guardado para a página de obrigado'); }
    else { await p.waitForTimeout(9500); ok(!/obrigado/.test(p.url()), 'sem confirmação: fica na página'); ok(was.length >= 1, 'sem confirmação: abre o WhatsApp'); }
  };

  console.log(`\n== CRM ${confirma ? 'confirma o lead' : 'NÃO confirma'} ==`);
  console.log('1) Receber tabela (2 etapas)'); await abrir();
  await p.fill('form[data-lead="contato"] [name=nome]', 'Teste Site Automático'); await p.type('form[data-lead="contato"] [name=telefone]', '31999998888');
  await p.click('form[data-lead="contato"] [data-submit]'); ok(posts.length === 0, 'etapa 1 não envia na hora');
  await p.selectOption('form[data-lead="contato"] [name=finalidade]', 'Investimento'); await p.click('form[data-lead="contato"] [data-submit]');
  await p.waitForTimeout(600); ok(posts.length === 1, 'etapa 2 envia uma vez'); confere(posts[0], 'Receber a tabela completa'); await destino('contato');
  if (!confirma) ok(await p.locator('form[data-lead="contato"].is-sent').count() === 1, 'agradece no próprio formulário');

  console.log('2) Janela antes do WhatsApp'); await abrir(); was.length = 0;
  await p.evaluate(() => { const a = [...document.querySelectorAll('a[href*="wa.me/"]')].find(x => /tabela|pre[cç]o|parcela/i.test(decodeURIComponent(x.href))) || document.querySelector('a[href*="wa.me/"]'); a.click(); });
  await p.waitForTimeout(300); ok(await p.isVisible('#leadGate'), 'link do WhatsApp abre a janela de lead');
  await p.fill('form[data-lead="whatsapp"] [name=nome]', 'Teste Site Janela'); await p.type('form[data-lead="whatsapp"] [name=telefone]', '3133334444');
  await p.click('form[data-lead="whatsapp"] [data-submit]'); await p.click('form[data-lead="whatsapp"] [data-skip]'); await p.waitForTimeout(600);
  const jan = posts.filter(L => L.nome === 'Teste Site Janela').pop(); ok(!!jan, 'pular envia o lead'); confere(jan, jan && jan.Interesse); await destino('whatsapp');

  console.log('3) Agendar visita'); await abrir(); was.length = 0;
  await p.click('[data-ctab="visita"]'); await p.click('form[data-lead="visita"] [data-vnext]');
  ok(await p.isVisible('form[data-lead="visita"] [data-verr]'), 'exige as 3 respostas');
  for (const [n, v] of [['finalidade', 'Moradia'], ['prazo', 'Imediato'], ['entrada', 'Até R$ 50 mil']]) await p.check(`form[data-lead="visita"] input[name=${n}][value="${v}"]`, { force: true });
  await p.click('form[data-lead="visita"] [data-vnext]');
  ok(await p.locator('form[data-lead="visita"] [data-visit-days] input').count() > 0, 'dias da visita gerados');
  await p.fill('form[data-lead="visita"] [name=nome]', 'Teste Site Visita'); await p.type('form[data-lead="visita"] [name=telefone]', '31988887777');
  await p.click('form[data-lead="visita"] button[type=submit]'); await p.waitForTimeout(600);
  const vis = posts.filter(L => L.nome === 'Teste Site Visita').pop(); ok(!!vis, 'visita envia o lead'); confere(vis, 'Agendar visita'); ok(/—/.test((vis || {})['Dia e horário da visita'] || ''), 'dia e período enviados'); await destino('visita');

  if (/utm_/.test(url)) ok(posts.every(L => L.utm_source), 'utm_source em todos os leads');
  /* sem confirmação, a linha do CRM reenvia o mesmo lead (mesmo lead_id) na próxima visita: conta por pessoa */
  const porNome = {}; posts.forEach(L => { (porNome[L.nome] = porNome[L.nome] || new Set()).add(L.lead_id); });
  ok(Object.values(porNome).every(s => s.size === 1) && new Set(posts.map(L => L.lead_id)).size === Object.keys(porNome).length, 'um lead_id por pessoa (reenvio usa o mesmo id)');
  ok(erros.length === 0, 'sem erros de página' + (erros.length ? ': ' + erros.join(' | ') : ''));
  await ctx.close();
}
(async () => { const b = await chromium.launch(); await cenario(b, true); await cenario(b, false); await b.close(); console.log(falhas ? `\n${falhas} falha(s).` : '\nTudo certo.'); process.exit(falhas ? 1 : 0); })();
