// Conferência automática do site (spec 11 · parte "Automático").
// Sobe um servidor local para a pasta public_html, abre no computador e no celular,
// rola a página inteira (para carregar imagens com lazy) e confere:
//   erros de console e de página · arquivos locais que não carregaram (404) · imagens quebradas
//   âncoras sem destino · links do WhatsApp com número diferente do config · um único h1
//   title/description/canonical/og:image · campos obrigatórios do config sem "[preencher]"
// Salva prints de página inteira em <saida>/ (padrão: qa/ ao lado da pasta do site).
// Uso: node scripts/checar_site.js public_html [saida]
// Com Playwright global: NODE_PATH=$(npm root -g) node scripts/checar_site.js public_html
const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const raiz = path.resolve(process.argv[2] || 'public_html');
const saida = path.resolve(process.argv[3] || path.join(raiz, '..', 'qa'));
if (!fs.existsSync(path.join(raiz, 'index.html'))) { console.error('Não achei index.html em ' + raiz); process.exit(2); }
fs.mkdirSync(saida, { recursive: true });

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.m4a': 'audio/mp4', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
const servidor = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(raiz, u === '/' ? 'index.html' : u);
  if (!f.startsWith(raiz) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
  const st = fs.statSync(f), tipo = TIPOS[path.extname(f).toLowerCase()] || 'application/octet-stream';
  const range = req.headers.range;               // vídeo precisa de Range
  if (range) {
    const [a, b] = range.replace('bytes=', '').split('-'); const ini = +a, fim = b ? +b : st.size - 1;
    res.writeHead(206, { 'Content-Type': tipo, 'Content-Range': `bytes ${ini}-${fim}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': fim - ini + 1 });
    return fs.createReadStream(f, { start: ini, end: fim }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': tipo, 'Content-Length': st.size }); fs.createReadStream(f).pipe(res);
});

let falhas = 0, avisos = 0;
const ok = (c, msg, aviso) => { if (c) return console.log('  ✓ ' + msg); if (aviso) { avisos++; return console.log('  ! ' + msg); } falhas++; console.log('  ✗ ' + msg); };

(async () => {
  await new Promise(r => servidor.listen(0, r));
  const base = `http://localhost:${servidor.address().port}/`;
  const b = await chromium.launch();
  for (const [nome, opts] of [['computador', { viewport: { width: 1440, height: 900 } }], ['celular', { ...devices['iPhone 13'] }]]) {
    console.log(`\n== ${nome}`);
    const ctx = await b.newContext(opts), p = await ctx.newPage();
    const erros = [], externos = [], quebrados = [];
    p.on('pageerror', e => erros.push(e.message));
    p.on('console', m => {
      if (m.type() !== 'error') return;
      const de = (m.location() || {}).url || '';
      // falha de rede em serviço externo (mapa, fontes, Pixel) vira aviso: depende da rede de quem testa
      if (/Failed to load resource/.test(m.text()) && de && !de.startsWith(base)) externos.push(de.split('?')[0]); else erros.push(m.text());
    });
    p.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) quebrados.push(r.status() + ' ' + r.url().replace(base, '')); });
    await ctx.route('**/hook.**', r => r.fulfill({ status: 200, body: 'bloqueado no teste' }));   // nunca gera lead
    await p.goto(base + 'index.html', { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(2500);
    const altura = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < altura; y += 700) { await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(120); }
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1200);

    const r = await p.evaluate(() => {
      const S = window.SITE || {}, num = String(S.whatsapp || '').replace(/\D/g, '');
      const meta = n => (document.querySelector(`meta[name="${n}"],meta[property="${n}"]`) || {}).content || '';
      return {
        h1: document.querySelectorAll('h1').length,
        title: document.title,
        description: meta('description'), ogImage: meta('og:image'),
        canonical: (document.querySelector('link[rel=canonical]') || {}).href || '',
        imgs: [...document.images].filter(i => i.complete && i.currentSrc && i.naturalWidth === 0).map(i => i.currentSrc),
        ancoras: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.getElementById(h.slice(1))),
        wa: [...document.querySelectorAll('a[href*="wa.me/"]')].map(a => a.href).filter(h => !num || !h.includes('wa.me/' + num)),
        config: ['nome', 'whatsapp', 'crmSite'].filter(k => !S[k] || /^\[/.test(S[k])),
        linha: !!document.querySelector('script[src*="/api/site/script.js?s="]'), envioProprio: !!document.querySelector('script[src*="leads.js"]') || /hook\.[a-z0-9]+\.make\.com/.test(document.documentElement.innerHTML),
        temSite: !!window.SITE, temLead: !!window.AsteriLead
      };
    });
    ok(!erros.length, 'sem erros no console' + (erros.length ? ':\n      ' + [...new Set(erros)].slice(0, 8).join('\n      ') : ''));
    ok(!externos.length, 'serviços externos responderam' + (externos.length ? ' (confira a rede):\n      ' + [...new Set(externos)].slice(0, 6).join('\n      ') : ''), true);
    ok(!quebrados.length, 'arquivos locais carregados' + (quebrados.length ? ':\n      ' + [...new Set(quebrados)].join('\n      ') : ''));
    ok(!r.imgs.length, 'sem imagens quebradas' + (r.imgs.length ? ': ' + r.imgs.join(', ') : ''));
    ok(!r.ancoras.length, 'âncoras com destino' + (r.ancoras.length ? ': ' + [...new Set(r.ancoras)].join(', ') : ''));
    if (nome === 'computador') {
      ok(r.temSite && r.linha, 'config.js (window.SITE) e a linha do CRM (api/site/script.js) na página');
      ok(!r.envioProprio, 'sem envio próprio de leads (leads.js ou webhook do Make) — só a linha do CRM');
      ok(!r.wa.length, 'links do WhatsApp com o número do config' + (r.wa.length ? ': ' + r.wa.slice(0, 3).join(' | ') : ''));
      ok(r.h1 === 1, `um único h1 (achei ${r.h1})`);
      ok(r.title && r.description && r.canonical && r.ogImage, 'title, description, canonical e og:image');
      ok(!r.config.length, 'config obrigatório preenchido' + (r.config.length ? ': falta ' + r.config.join(', ') : ''));
    }
    await p.screenshot({ path: path.join(saida, `${nome}-topo.jpg`), type: 'jpeg', quality: 80 });
    await p.screenshot({ path: path.join(saida, `${nome}-pagina.jpg`), type: 'jpeg', quality: 70, fullPage: true });
    await ctx.close();
  }
  await b.close(); servidor.close();
  console.log(`\nPrints em ${saida}`);
  console.log(falhas ? `${falhas} falha(s), ${avisos} aviso(s).` : `Tudo certo (${avisos} aviso(s)).`);
  process.exit(falhas ? 1 : 0);
})();
