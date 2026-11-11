---
name: landing-imobiliaria
description: Cria a landing page de um novo empreendimento imobiliário (loteamento, condomínio de fazendas, condomínio de casas, apartamentos, salas) seguindo a especificação extraída do site da Estância da Lapa. Entrevista o usuário sobre o produto, monta o briefing, compõe as seções, escreve os textos, constrói o site estático com captura de leads (webhook do Make → CRM), Pixel/GA4/Ads/Clarity, confere no navegador e prepara o deploy. Também altera sites feitos por ela (adicionar, apagar ou mudar seção), sempre atualizando a spec do site antes do código. Use quando o pedido for "criar site/landing page/página de vendas" de um produto imobiliário, mudar uma seção de um site desses, ou quando o usuário chamar /landing-imobiliaria.
---

# Landing page imobiliária (spec-driven)

Você vai construir a landing page de um novo produto imobiliário **a partir de uma especificação**, não de memória.
A especificação está em `references/spec/` e foi extraída do site da Estância da Lapa (https://estanciadalapa.com),
que é a **implementação de referência** (`public_html/index.html` do repositório `renan981/estancia-da-lapa`).

Fale sempre em **português do Brasil**, com frases curtas e sem jargão. O usuário não é programador.

## Ordem de trabalho

Siga as fases nesta ordem. Não pule a entrevista nem a confirmação do briefing.
Se o pedido for **alterar** um site já feito com esta skill (adicionar, apagar ou mudar seção), vá direto para a Fase 7.

### Fase 0 — Ler a especificação
1. Leia `references/spec/00-indice.md` inteiro. Ele diz o que é obrigatório (DEVE), recomendado (DEVERIA) e opcional (PODE).
2. Leia `references/spec/12-licoes-aprendidas.md`. São erros que já aconteceram e não podem se repetir.
3. Os outros arquivos da spec você lê **quando chegar na fase que precisa deles** (a tabela do índice diz qual).

### Fase 1 — Entrevista sobre o produto
Siga `references/questionario.md`. Resumo:
1. **Primeiro pergunte o que já existe pronto:** book/apresentação em PDF, tabela de preços, planta, fotos, vídeos, logo e manual de marca, site antigo, anúncios. Peça para anexar ou passar links.
   Extraia tudo o que der desses materiais **antes** de perguntar. Não pergunte o que o material já responde.
2. Depois faça as perguntas em **rodadas de até 4**, por bloco (produto → localização → diferenciais e infraestrutura → preço e condições → mídia e marca → atendimento e integrações → domínio e publicação).
   - Quando houver opções claras, use a ferramenta de perguntas com alternativas (`AskUserQuestion`, se existir). Coloque a alternativa recomendada primeiro, com "(Recomendado)".
   - Perguntas abertas (nomes, números, endereços) vão em texto, numeradas, numa única mensagem por rodada.
3. Nunca invente dado comercial: preço, área, prazo, quantidade, distância, ID de Pixel/Google, telefone.
   Se faltar, escreva `[preencher]` no briefing e siga em frente. No fim, liste as pendências.
4. Distâncias e tempos: se o usuário não souber, calcule pela rota (OSRM) a partir da coordenada da portaria/stand e **mostre para ele confirmar**.

### Fase 2 — Briefing
1. Preencha `templates/produto.yaml` e salve como `briefing/produto.yaml` na raiz do repositório do novo site.
   Use `templates/exemplo-estancia-da-lapa.yaml` como exemplo de preenchimento completo.
2. Mostre ao usuário um resumo curto (o que é, para quem, onde, preço, seções que o site terá, pendências) e **peça confirmação**.
   Ajuste até ele aprovar. O briefing aprovado é a fonte única de verdade: números do site saem dele.

### Fase 3 — Composição e textos
1. Escolha as seções pelo catálogo de `references/spec/04-secoes.md` (tabela "Seções por tipo de produto").
2. Escreva os textos seguindo o tom de voz e as fórmulas de `references/spec/03-design-system.md` §Texto.
   Cada título tem uma palavra ou expressão final em letra manuscrita (`.script`).
   O que se vende, o tamanho e o lugar precisam ficar claros no topo.
3. Mostre ao usuário o roteiro do site: seção por seção, título e subtítulo. Aprovação rápida antes de codar.

### Fase 4 — Construção
0. **Spec própria do site (antes do código).** No repositório novo, crie `docs/spec/`:
   - copie os arquivos gerais desta skill (`references/spec/00` a `03` e `05` a `12`), que valem para o site inteiro;
   - crie **um arquivo por seção escolhida** em `docs/spec/secoes/`, a partir de `templates/secao.md`: `01-header.md`, `02-hero.md`, `03-ticker.md`... Cada um traz os requisitos daquela seção (copiados de `04-secoes.md` e adaptados ao produto), o conteúdo aprovado (textos, fotos, números) e o critério de aceite;
   - crie `docs/spec/secoes/00-ordem.md` com a lista das seções na ordem da página (id, arquivo, se está no menu).
   A partir daí, essa pasta é a fonte da verdade do site. Esta skill continua sendo só o modelo.
1. Estrutura de arquivos, configuração única (`assets/js/config.js`) e regras de código: `references/spec/02-arquitetura.md` (inclusive ARQ-08, marcadores de seção).
2. Visual: `references/spec/03-design-system.md`. Cores, fontes e logo vêm da marca do produto. Se não houver marca, proponha uma paleta e peça aprovação.
3. Seções: `references/spec/04-secoes.md`. Cada seção tem requisitos com código (ex.: `HERO-03`). Implemente todos os DEVE.
4. Leads e WhatsApp: **não escreva código de envio**. Peça ao usuário para conectar o site no CRM (Captação › Sites conectados) e use a linha que o CRM gera (`<script src="https://sandybrown-gazelle-848710.hostingersite.com/crm/api/site/script.js?s=<código-do-site>"></script>`) em todas as páginas, antes de `contato.js`. Copie `templates/js/contato.js` sem mudar a lógica e siga o contrato de marcação do topo; `<body data-asteri="manual">`. Detalhes em `references/spec/05-leads-e-conversao.md`.
5. Medição: `references/spec/06-medicao.md`. IDs só os que o usuário passar.
6. Inventário dinâmico (mapa de lotes/glebas/unidades, se houver): `references/spec/07-inventario-dinamico.md`.
7. Mídia: `references/spec/08-midia.md` e os scripts `scripts/otimizar_imagens.py` e `scripts/video_hero.sh`.
8. Quando tiver dúvida de **como** algo foi resolvido, consulte a implementação de referência (se o repositório `renan981/estancia-da-lapa` estiver disponível). Ela tem camadas de correção acumuladas (`-v16`, `-v20`, `-v31`...): copie a **ideia**, nunca as camadas. O site novo nasce limpo.

### Fase 5 — Conferência
1. Rode `node scripts/checar_site.js <pasta-public_html>`. O script tira prints no computador e no celular, lista erros do console, imagens quebradas, âncoras sem destino e links de WhatsApp sem número.
   No ambiente com Playwright global: `NODE_PATH=$(npm root -g) node ...`.
2. Olhe os prints. Confira a lista de aceite de `references/spec/11-aceite-qa.md`, item por item.
3. **Teste de lead sem gerar lead:** com o site servido localmente, rode `node scripts/testar_leads.js "http://localhost:<porta>/index.html?utm_source=teste"`. O script intercepta o envio ao CRM e confere os 3 fluxos (tabela, janela do WhatsApp, visita), os campos do CRM e a ausência do campo `canal`.
4. **Teste real:** depois de publicar, um lead "Teste Site" em aba anônima com o link de teste; conferir no CRM e avisar o usuário para apagar.

### Fase 6 — Publicação
Siga `references/spec/10-deploy.md`: repositório, `deploy.yml`, Hostinger, domínio, `.htaccess`, verificações do Google e da Meta.
Peça ao usuário para criar o repositório do site em github.com/new (privado, nome = slug do empreendimento; o Claude não tem permissão para criar) e adicione-o à sessão. Peça autorização antes de fazer push ou mexer em DNS. **Antes da primeira publicação, o site precisa estar conectado no CRM** e o endereço da linha precisa responder (LEAD-09, DEP-09); senão o site sobe sem envio de leads. Depois de publicar, confira o site no ar (não só o deploy), **Conferir agora** verde no CRM e um lead "Teste Site".

### Fase 7 — Alterações depois do site pronto
Vale para qualquer pedido de mudança num site feito com esta skill (repositório com `docs/spec/secoes/`).
**Sempre a spec primeiro, depois o código, depois a conferência.**
- **Nova seção:** crie `docs/spec/secoes/NN-<id>.md` a partir de `templates/secao.md` (requisitos, conteúdo, aceite), inclua em `00-ordem.md`, mostre o rascunho ao usuário e só então implemente o HTML, o CSS e o JS entre os marcadores da seção (ARQ-08). Se tiver item de menu, atualize header, gaveta do celular e rodapé.
- **Apagar seção:** remova o bloco marcado no HTML, o bloco marcado no CSS, o módulo JS dela (se houver), os links do menu/rodapé que apontam para o `id` e as fotos que só ela usava. Mova o arquivo da spec para `docs/spec/secoes/removidas/` (dá para voltar depois) e tire de `00-ordem.md`. O `checar_site.js` acusa âncora sem destino se sobrar link.
- **Mudar uma seção:** edite o arquivo da spec da seção (texto, número, requisito) e depois o código só daquela seção. Não mexa no visual de outras seções.
- **Mudar dado comercial** (preço, plano, distância, WhatsApp): atualize `briefing/produto.yaml` e `config.js`; procure o valor antigo no site inteiro para não sobrar nenhum.
- **Mudar ordem:** edite `00-ordem.md` e mova o bloco marcado inteiro.
- Registre cada alteração no fim de `docs/spec/secoes/00-ordem.md` (data · o que mudou · motivo) e use o código do requisito no commit.
- Rode a Fase 5 de novo antes de publicar.

## Regras que nunca mudam
- Nunca coloque no site chave, token, senha ou webhook. O envio de leads, o Pixel e o Google vêm só da **linha do CRM**; o site chama `AsteriLead.start(chave, dados)` e `AsteriLead.send(chave, dados)`, sem outro formato.
- Não envie o campo `canal` no lead: o CRM descobre sozinho pela origem.
- Não invente IDs de Pixel, GA4, Google Ads ou Clarity. Pixel e Google vão no cadastro do site no CRM; sem ID, ficam vazios.
- Não peça senhas nem tokens no chat.
- Fotos: só imagens reais do empreendimento (ou da região, identificadas como tal). Nada de céu "pintado", degradê de cor sobre a foto ou sombra atrás do texto.
- Não mude o visual além do que foi pedido quando estiver ajustando um site já aprovado.
- Preço e condição sempre com aviso "valores de referência, sujeitos a alteração e disponibilidade".

## Arquivos desta skill
| Caminho | Para quê |
|---|---|
| `references/questionario.md` | Roteiro da entrevista, com o que é obrigatório |
| `references/spec/*.md` | A especificação do site (requisitos e critérios de aceite) |
| `templates/produto.yaml` | Modelo do briefing |
| `templates/secao.md` | Modelo da spec de uma seção (um arquivo por seção no site novo) |
| `templates/exemplo-estancia-da-lapa.yaml` | Briefing completo da Estância (exemplo real) |
| `templates/js/config.js` | Configuração única do site (preenchida a partir do briefing) |
| `templates/js/contato.js` | Abas, formulários em 2 etapas, agendamento de visita e janela de lead do WhatsApp |
| `templates/teste-leads.html` | Página mínima que segue o contrato de marcação (base para o HTML e para testar) |
| `templates/deploy.yml`, `templates/htaccess.txt` | Publicação na Hostinger |
| `scripts/otimizar_imagens.py` | Gera WebP grande e pequeno (`-sm`) de cada foto |
| `scripts/video_hero.sh` | Gera vídeo do topo (computador e celular) e capas |
| `scripts/checar_site.js` | Conferência automática com prints |
| `scripts/testar_leads.js` | Teste dos formulários com o envio ao CRM interceptado (não gera lead) |
