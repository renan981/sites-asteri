# 09 · SEO, desempenho, acessibilidade e privacidade

## SEO (`SEO`)
- **SEO-01 DEVE** `<html lang="pt-BR">`, `<title>` "Nome | Tipo de produto em Cidade" (≤ 60 caracteres), `meta description` com tipo, tamanho e cidade (≤ 160).
- **SEO-02 DEVE** Open Graph completo (`og:title`, `og:description`, `og:type=website`, `og:url`, `og:image` + `secure_url`, `type`, `width=1200`, `height=630`, `alt`, `og:locale=pt_BR`) e `twitter:card=summary_large_image`.
- **SEO-03 DEVE** `<link rel="canonical">` com o domínio final (`https://dominio.com/`), `theme-color`, ícones e `manifest`.
- **SEO-04 DEVE** `robots.txt` (bloqueia páginas de teste/backup) e `sitemap.xml` (home + privacidade, com `lastmod`).
- **SEO-05 DEVERIA** JSON-LD: `Organization` (nome, logo, telefone), `Place`/`Residence` com endereço e coordenadas, e `FAQPage` com as perguntas do FAQ.
- **SEO-06 DEVE** um único `h1`; `h2` por seção; `h3` dentro das seções.

## Desempenho (`PERF`)
- **PERF-01 DEVE** LCP ≤ 2,5 s no celular (PageSpeed, 4G): a foto do topo com `preload` + `fetchpriority="high"` + `srcset`; o vídeo entra depois.
- **PERF-02 DEVE** CLS ≤ 0,1: imagens com `width`/`height` ou `aspect-ratio`; fontes com `display=swap`.
- **PERF-03 DEVE** mapas (MapLibre), Overpass, OSRM e planta grande carregam só quando a seção chega perto da tela (`IntersectionObserver`, `rootMargin` ~600 px).
- **PERF-04 DEVE** fotos 2 e 3 do topo e trilha só depois que a página aparece; nada pesado bloqueia o primeiro desenho.
- **PERF-05 DEVERIA** peso da primeira visita no celular sem vídeo ≤ 1,5 MB.

## Acessibilidade (`A11Y`)
- **A11Y-01 DEVE** contraste AA; foco visível (`outline` dourado de 2 px) em todos os controles.
- **A11Y-02 DEVE** navegação por teclado em menu, abas, acordeão, galeria, diálogos (Esc fecha, foco volta ao botão de origem).
- **A11Y-03 DEVE** `aria-label` em botões só de ícone; `aria-pressed` no botão de som; `role="tablist"/"tab"` nas abas; `aria-live="polite"` em resultados (rota, ficha da unidade).
- **A11Y-04 DEVE** campos com `<label>`, `autocomplete` (`name`, `tel`, `email`), `inputmode="tel"` e mensagens de erro anunciadas.
- **A11Y-05 DEVE** elementos decorativos com `aria-hidden="true"` (grão, cursor, mídia do topo, segunda cópia da faixa corrida).

## Privacidade (`PRIV`)
- **PRIV-01 DEVE** `politica-de-privacidade.html` com: 1. Quem é o responsável · 2. Quais dados coletamos · 3. Para que usamos · 4. Bases legais (LGPD) · 5. Com quem compartilhamos (CRM, Make, Meta, Google, Microsoft Clarity) · 6. Cookies e armazenamento no navegador · 7. Por quanto tempo guardamos · 8. Seus direitos · 9. Segurança · 10. Alterações.
- **PRIV-02 DEVE** responsável, CNPJ e e-mail de contato vêm do briefing (`site.privacidade`); sem esses dados, `[preencher]` e pendência.
- **PRIV-03 DEVE** aviso curto abaixo de cada formulário com link para a política.
