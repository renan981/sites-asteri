// Teste obrigatório antes de publicar: em cada tamanho de tela, todo botão de envio de todo formulário
// precisa ficar visível e clicável (nada por cima), as janelas precisam rolar e o menu do celular também (FLT-06, HDR-06, CTT-06).
// Também confere rolagem lateral indevida. Não envia lead (o envio ao CRM é bloqueado).
// Uso: node tools/testar_telas.js http://localhost:8799 [pasta-prints]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const base = process.argv[2] || 'http://localhost:8799', out = process.argv[3];
if (out) fs.mkdirSync(out, { recursive: true });
const TELAS = [
  ['Celular 320 em pé', 320, 568, 1], ['Celular 360 em pé', 360, 640, 1], ['Celular 375 em pé', 375, 667, 1], ['Celular 390 em pé', 390, 844, 1],
  ['Celular 414 em pé', 414, 896, 1], ['Celular 430 em pé', 430, 932, 1],
  ['Celular 320 deitado', 568, 320, 1], ['Celular 360 deitado', 640, 360, 1], ['Celular 375 deitado', 667, 375, 1], ['Celular 390 deitado', 844, 390, 1], ['Celular 430 deitado', 932, 430, 1],
  ['Tablet em pé', 768, 1024, 1], ['Tablet deitado', 1024, 768, 1], ['Tablet grande em pé', 820, 1180, 1],
  ['Notebook 1024×600', 1024, 600, 0], ['Notebook 1280×720', 1280, 720, 0], ['Notebook 1366×768', 1366, 768, 0],
  ['Janela baixa 1440×620', 1440, 620, 0], ['Monitor 1920×1080', 1920, 1080, 0]
];
const rel = []; let falhas = 0;

// deixa o elemento à vista (rola a página e as caixas roláveis) e confere se um clique no centro chega nele
async function alcancavel(p, sel) {
  return p.evaluate(s => {
    const el = [...document.querySelectorAll(s)].find(e => e.offsetParent !== null);
    if (!el) return { ok: false, motivo: 'não encontrado/visível' };
    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    const r = el.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    if (r.width < 1 || r.height < 1) return { ok: false, motivo: 'sem tamanho' };
    const dentro = r.top >= 0 && r.left >= 0 && r.bottom <= H + 1 && r.right <= W + 1;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2, topo = document.elementFromPoint(cx, cy);
    const livre = !!topo && (topo === el || el.contains(topo));
    return { ok: dentro && livre, motivo: !dentro ? `fora da tela (${Math.round(r.top)}..${Math.round(r.bottom)} de ${H})` : !livre ? 'coberto por ' + (topo ? topo.className || topo.tagName : '?') : '' };
  }, sel);
}

(async () => {
  const b = await chromium.launch();
  for (const [nome, w, h, touch] of TELAS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: !!touch && w < 1024, hasTouch: !!touch, deviceScaleFactor: 1, locale: 'pt-BR' });
    await ctx.route('**/api/site/lead**', r => r.fulfill({ status: 503, body: '' }));
    await ctx.route(/connect\.facebook\.net|googletagmanager|wa\.me/, r => r.abort());
    const p = await ctx.newPage(); const itens = [];
    const conf = async (rot, sel) => { const r = await alcancavel(p, sel); itens.push([rot, r.ok, r.motivo]); if (!r.ok) falhas++; return r.ok; };
    await p.goto(base + '/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(700);
    const lateral = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    itens.push(['Sem rolagem lateral', lateral <= 0, lateral > 0 ? `sobra ${lateral}px` : '']); if (lateral > 0) falhas++;

    // menu do celular
    if (await p.isVisible('.header__menu')) {
      await p.click('.header__menu'); await p.waitForTimeout(500);
      await conf('Menu: último link', '.mobile-nav__links a:last-child');
      await conf('Menu: botão Agendar visita', '.mobile-nav__foot .button');
      await conf('Menu: botão fechar', '.mobile-nav__close');
      await p.click('.mobile-nav__close'); await p.waitForTimeout(400);
    }
    // contato: Receber tabela (etapas 1 e 2)
    await p.evaluate(() => document.getElementById('contato').scrollIntoView()); await p.waitForTimeout(500);
    await conf('Tabela etapa 1: Continuar', 'form[data-lead="contato"] [data-submit]');
    await p.fill('form[data-lead="contato"] [name=nome]', 'Teste Site Tela'); await p.type('form[data-lead="contato"] [name=telefone]', '31999990000');
    await p.click('form[data-lead="contato"] [data-submit]'); await p.waitForTimeout(300);
    await conf('Tabela etapa 2: Enviar', 'form[data-lead="contato"] [data-submit]');
    await conf('Tabela etapa 2: Pular', 'form[data-lead="contato"] [data-skip]');
    // contato: Agendar visita (etapas 1 e 2)
    await p.evaluate(() => document.querySelector('[data-ctab="visita"]').click()); await p.waitForTimeout(200);
    await conf('Visita etapa 1: Continuar', 'form[data-lead="visita"] [data-vnext]');
    await p.evaluate(() => ['Moradia', 'Imediato', 'Até R$ 50 mil'].forEach(v => { const i = document.querySelector(`form[data-lead="visita"] input[value="${v}"]`); i.checked = true; }));
    await p.evaluate(() => document.querySelector('form[data-lead="visita"] [data-vnext]').click()); await p.waitForTimeout(300);
    await conf('Visita etapa 2: Solicitar visita', 'form[data-lead="visita"] button[type=submit]');
    // janela de lead antes do WhatsApp (etapas 1 e 2)
    await p.evaluate(() => document.querySelector('#glebas .inv__card a.button').click()); await p.waitForTimeout(500);
    await conf('Janela etapa 1: Continuar', '#leadGate [data-submit]');
    if (out && (h <= 430 || w <= 390)) await p.screenshot({ path: path.join(out, `janela-${w}x${h}.png`) });
    await p.fill('#leadGate [name=nome]', 'Teste Site Tela'); await p.type('#leadGate [name=telefone]', '31999990000');
    await p.click('#leadGate [data-submit]'); await p.waitForTimeout(300);
    await conf('Janela etapa 2: Abrir WhatsApp', '#leadGate [data-submit]');
    await conf('Janela etapa 2: Pular', '#leadGate [data-skip]');
    await conf('Janela: fechar', '#leadGate [data-gate-close]');
    rel.push([nome, w, h, itens]); await ctx.close();
  }
  await b.close();
  let md = '# Teste de telas · ' + new Date().toLocaleString('pt-BR') + '\n\n| Tela | Tamanho | Resultado | Problemas |\n|---|---|---|---|\n';
  for (const [nome, w, h, itens] of rel) {
    const ruins = itens.filter(i => !i[1]);
    md += `| ${nome} | ${w}×${h} | ${ruins.length ? '✗ ' + ruins.length + ' de ' + itens.length : '✓ ' + itens.length + '/' + itens.length} | ${ruins.map(i => i[0] + ': ' + i[2]).join('; ') || '—'} |\n`;
  }
  console.log(md); console.log(falhas ? falhas + ' falha(s).' : 'Tudo certo.');
  if (out) fs.writeFileSync(path.join(out, 'relatorio-telas.md'), md);
  process.exit(falhas ? 1 : 0);
})();
