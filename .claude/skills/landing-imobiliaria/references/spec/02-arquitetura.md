# 02 · Arquitetura

## ARQ-01 · Site estático (DEVE)
HTML, CSS e JavaScript puros, sem framework e sem etapa de build. Publicado como arquivos numa hospedagem comum (Hostinger/Apache).
Bibliotecas externas só sob demanda e com versão fixa (ex.: `maplibre-gl@4.7.1` do unpkg, carregado quando o mapa chega perto da tela).

## ARQ-02 · Estrutura de pastas (DEVE)
```
<repositorio>/
├── briefing/produto.yaml          # briefing aprovado (fonte da verdade, não é publicado)
├── docs/                          # deploy.md, captura-de-leads.md (não publicado)
│   └── spec/                      # spec deste site: arquivos gerais + secoes/ (um arquivo por seção)
├── tools/sync_inventario.py       # se houver inventário pela planilha
├── .github/workflows/deploy.yml   # publica public_html/ na branch deploy/hostinger
└── public_html/                   # tudo o que vai ao ar
    ├── index.html
    ├── politica-de-privacidade.html
    ├── .htaccess  robots.txt  sitemap.xml  site.webmanifest
    ├── data/inventario.json       # se houver
    └── assets/
        ├── css/site.css
        ├── js/config.js  contato.js  site.js  [mapa.js] [inventario.js]   (envio, Pixel e Google: linha do CRM)
        ├── img/       (hero, fotos de seção; sempre WebP com versão -sm)
        ├── galeria/   (fotos da galeria, WebP grande + -sm)
        ├── video/     (hero-desktop-vN.mp4, hero-mobile-vN.mp4, posters)
        ├── audio/     (trilha.m4a, se houver)
        ├── planta/    (planta para o mapa de unidades)
        ├── icons/     (favicon.ico, favicon-32/48, apple-touch-icon, app-192/512)
        └── share-<slug>-vN.jpg   (1200×630 para WhatsApp/redes)
```
A referência tem tudo dentro do `index.html`. Para sites novos, **separe CSS e JS em arquivos** (a hospedagem já manda sem cache para `.html/.js/.css`, ver `10-deploy.md`).
Exceção: o CSS crítico do topo (header + hero, até ~6 KB) PODE ficar inline no `<head>` para o topo aparecer antes do CSS completo.

## ARQ-03 · Configuração única (DEVE)
Todo dado que muda de produto para produto fica em `assets/js/config.js` (modelo em `templates/js/config.js`):
nome do empreendimento, WhatsApp, e-mail, código do site no CRM, coordenadas, mensagens do WhatsApp. IDs de Pixel e Google ficam no cadastro do site no CRM (05/06).
Nenhum outro arquivo JS pode repetir esses valores. Números de venda que aparecem no HTML (preço, área, distâncias) saem do briefing e são conferidos na Fase 5.

## ARQ-04 · Ordem dos scripts (DEVE)
1. `<head>`: só metadados, preload da imagem do topo e das fontes. Pixel e Google vêm da linha do CRM (IDs no cadastro do site); Tag Manager e Clarity do cliente, se houver, no HTML.
2. Fim do `<body>`, nesta ordem, todos com `defer` ou no final:
   `config.js` → [Tag Manager do cliente] → **linha do CRM** (`<script src="https://sandybrown-gazelle-848710.hostingersite.com/crm/api/site/script.js?s=<código-do-site>"></script>`, sem `defer`) → `contato.js` → `site.js` → módulos sob demanda (`mapa.js`, `inventario.js`).
3. A linha do CRM DEVE estar em todas as páginas (inclusive a de privacidade), para guardar a origem de quem entra por qualquer porta.

## ARQ-05 · Regras de código (DEVE)
- Um módulo por responsabilidade, cada um dentro de `(function(){ ... })();`, sem variáveis globais além de `window.SITE` (config) e `window.AsteriLead` (API de leads).
- Sem camadas de correção: proibido criar `<style id="ajustes-v2">` sobrescrevendo regras com `!important`. Corrija a regra original.
- CSS com classes por bloco (`.hero`, `.hero__copy`, `.hero__fact`; modificador `--outline`, estado `.is-open`, `.is-active`).
- Atributos de comportamento em `data-*`: `data-reveal`, `data-delay`, `data-count`, `data-spot`, `data-video-open`, `data-gal-filter`, `data-ctab`.
- Todo acesso a `localStorage`/`sessionStorage` dentro de `try/catch` (navegação anônima e Safari podem bloquear).
- Nada pode depender do evento `load` para aparecer (vídeos externos e mapas atrasam o `load`). Use `DOMContentLoaded` e `IntersectionObserver`.
- Comentários em português, curtos, explicando o porquê.

## ARQ-06 · Navegadores (DEVE)
Últimas 2 versões de Chrome, Safari (iOS e macOS), Edge, Firefox e Samsung Internet. Larguras: 360 px a 2560 px.
Zoom do navegador de 50% a 200% sem quebrar o título do topo (ver `HERO-04`).

## ARQ-07 · Páginas (DEVE)
- `index.html` — a landing page.
- `politica-de-privacidade.html` — mesma identidade, texto LGPD (ver `09-seo-performance-a11y.md` §Privacidade).
- Qualquer outro caminho volta para `index.html` (`.htaccess`).

## ARQ-08 · Marcadores de seção (DEVE)
Cada seção é um bloco que se adiciona ou apaga inteiro. O mesmo `id` liga a spec, o HTML, o CSS e o JS:
```html
<!-- ===== SEÇÃO galeria · spec: docs/spec/secoes/08-galeria.md ===== -->
<section class="galeria" id="galeria"> ... </section>
<!-- ===== /SEÇÃO galeria ===== -->
```
```css
/* ===== SEÇÃO galeria · docs/spec/secoes/08-galeria.md ===== */
.galeria { ... }
/* ===== /SEÇÃO galeria ===== */
```
- Classes de uma seção começam pelo nome dela (`.galeria__grid`); nenhuma seção estiliza outra.
- JS de uma seção fica em módulo próprio (`assets/js/galeria.js`) que não quebra se a seção não existir (`if(!document.getElementById('galeria')) return;`).
- O que é compartilhado (botões, kicker, títulos, movimento) fica no topo do `site.css`, fora dos blocos de seção.
- Resultado: apagar uma seção = apagar o bloco do HTML, o bloco do CSS, o módulo JS e os links do menu. Nada mais quebra.
