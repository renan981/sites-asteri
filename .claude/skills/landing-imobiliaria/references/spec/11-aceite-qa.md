# 11 · Lista de aceite

Marque cada item antes de publicar. Itens com código remetem ao requisito.

## Automático (`node scripts/checar_site.js public_html`)
- [ ] Nenhum erro no console (computador 1440×900 e celular iPhone 13).
- [ ] Nenhuma imagem quebrada; nenhuma âncora `#x` sem seção correspondente.
- [ ] Todo link `wa.me/` tem o número do `config.js`.
- [ ] Um único `h1`; `title`, `description`, `canonical`, `og:image` presentes.
- [ ] `config.js` sem `[preencher]` nos campos obrigatórios (`nome`, `whatsapp`, `crmSite`).
- [ ] A linha do CRM em todas as páginas, sem `defer`, antes de `contato.js`; nenhum webhook, `leads.js` ou Pixel/Google colado à mão (LEAD-01, LEAD-02).

## Conteúdo
- [ ] O topo diz tipo de produto, tamanho mínimo e cidade (DS-07, HERO-06).
- [ ] Todos os números conferidos com o briefing: preço, áreas, distâncias, planos, % vendido, unidades restantes (CON-02, PRE-06).
- [ ] Só fotos reais; legendas corretas; sem céu pintado, degradê colorido ou sombra no texto (MID-F01, MID-F02).
- [ ] Nota legal de preços presente (PRE-05). Rodapé com aviso de confirmação (FTR-01).
- [ ] Ortografia revisada (acentos, nome do empreendimento sempre igual).

## Comportamento
- [ ] Vídeo do topo começa no computador e no celular, inclusive após recarregar; foto aparece antes (HERO-02, HERO-03).
- [ ] Título do topo estável com zoom de 50% a 200% (HERO-04).
- [ ] Trilha: começa (ou começa no primeiro toque), botão desliga e lembra a escolha, pausa no modal de vídeo e com a aba escondida (HERO-07).
- [ ] Menu do celular abre/fecha; barra fixa aparece e some nos pontos certos (HDR-03, FLT-02).
- [ ] Mapa carrega, filtros funcionam, rota calcula a partir de um CEP e "Usar minha localização" pede permissão (LOC-*).
- [ ] Galeria: filtros, lightbox com setas, teclado e deslize (GAL-*).
- [ ] Inventário: planta, ficha, lista ordenável e números batendo com o JSON (INV-*).
- [ ] Formulários: máscara, validação, 2 etapas, pular, aba de visita completa (CTT-*, LEAD-08).
- [ ] Todo botão de WhatsApp abre a janela de lead antes (LEAD-04).
- [ ] `node scripts/testar_leads.js <url>` passa sem falhas (LEAD-*).
- [ ] Site conectado no CRM antes de publicar; depois de publicar, **Conferir agora** verde e um lead "Teste Site" conferido no CRM (LEAD-09, DEP-09).
- [ ] Envio real opcional: no máximo 2 leads "Teste Site" e usuário avisado para apagar.
- [ ] Pixel/GA4/Ads/Clarity: só os IDs fornecidos; eventos disparam no envio (MED-*).

## Qualidade
- [ ] PageSpeed celular: LCP ≤ 2,5 s, CLS ≤ 0,1 (PERF-01, PERF-02).
- [ ] Teclado e leitor de tela nos diálogos, abas e acordeão (A11Y-*).
- [ ] Política de privacidade completa e linkada (PRIV-*).

## Publicação
- [ ] Workflow verde e `deploy/hostinger` com o mesmo tree (DEP-06).
- [ ] Site no ar conferido no domínio final, celular e computador.
- [ ] `www` e endereço provisório redirecionam com 301 (DEP-05).
- [ ] Pendências do briefing listadas para o usuário.
