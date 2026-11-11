# 03 · Design system

O visual de referência é "alto padrão natural": verde profundo, marfim, dourado e terracota, com tipografia leve e uma palavra manuscrita em cada título.
Para um produto novo, **mantenha a estrutura** (tokens, componentes, ritmo) e **troque os valores** pelas cores e fontes da marca do produto.

## Tokens (DS-01, DEVE existir como variáveis CSS em `:root`)
| Token | Referência (Estância) | Uso |
|---|---|---|
| `--brand-dark` | `#062f27` | fundo das seções escuras, header, barra do celular, `theme-color` |
| `--brand-dark-2` | `#0b4035` | degradês e cartões sobre o escuro |
| `--brand-dark-3` | `#154f41` | bordas e realces no escuro |
| `--ink` | `#17201d` | texto sobre fundo claro |
| `--ivory` | `#f5f0e7` | fundo das seções claras |
| `--ivory-2` | `#ebe3d6` | cartões e divisórias no claro |
| `--paper` | `#fffdf8` | texto sobre o escuro, cartões brancos |
| `--accent` | `#b76540` (terracota) | botão principal |
| `--gold` | `#cda565` | filetes, ícones, números |
| `--gold-light` | `#f1bc79` | palavra manuscrita e destaques no escuro |
| `--muted` | `#9aaa99` | textos de apoio no escuro |
| `--line` | `rgba(23,32,29,.14)` | divisórias no claro |
| `--container` | `min(1380px, calc(100vw - 96px))` | largura do conteúdo (24 px de margem no celular) |
| `--ease` | `cubic-bezier(.22,1,.36,1)` | todas as transições |

Contraste mínimo 4,5:1 para texto (AA). Confira ao trocar as cores da marca.

## Tipografia (DS-02, DEVE)
- **Principal**: Montserrat 300/400/500/600 (Google Fonts, `display=swap`, carregada com `preload` + `onload`).
- **Manuscrita**: Nothing You Could Do (só para a palavra final dos títulos e frases curtas de assinatura).
- Se a marca tiver fontes próprias, troque mantendo os papéis: uma sem serifa leve + uma manuscrita.

| Elemento | Regra |
|---|---|
| H1 do topo | peso 300; `font-size: min(calc(var(--container) * .0735), 13.2svh, 126px)` no computador; no celular `clamp(38px, 11vw, 58px)`; `letter-spacing: -.04em`; altura de linha ~1.0 |
| H2 de seção | peso 300; `clamp(34px, 4vw, 60px)/1.04`; `letter-spacing: -.05em` |
| `.script` | fonte manuscrita, `display:block`, `font-size: .62em`, cor `--gold-light` (escuro) ou `--accent` (claro) |
| Kicker | 11–13 px, peso 500, maiúsculas, `letter-spacing: .22em`, com filete dourado antes (`<i>`) |
| Corpo | 16–18 px, peso 300–400, altura de linha 1.6 |
| Números grandes | peso 300, unidade menor em `<em>` (ex.: `20.000 <em>m²</em>`) |

## Componentes (DS-03)
| Componente | Classe | Regras |
|---|---|---|
| Botão principal | `.button` | fundo `--accent`, texto claro, altura ≥ 55 px, seta SVG à direita, maiúsculas pequenas com espaçamento |
| Botão contorno | `.button--outline` | fundo transparente, borda `rgba(255,255,255,.46)` no escuro |
| Botão magnético | `.magnetic` | PODE seguir levemente o mouse (só computador) |
| Kicker | `.kicker` / `__kicker` | `<div class="x__kicker"><i></i><span>Texto</span></div>` |
| Título com assinatura | `h2` + `.script` | `Texto principal <span class="script">fecho.</span>` |
| Cartão com brilho | `[data-spot]` | brilho radial segue o mouse via `--mx/--my` |
| Fatos | `.x__facts` | 3 itens: número + legenda curta |
| Selos | `.x__badges` | ícone em círculo dourado + texto curto |
| Ícones | SVG inline de traço 1.5, `stroke: currentColor` | mesmo estilo em todo o site (casa, cadeado, água, raio, wi-fi, estrada, folha, avião, pino de mapa) |

## Ritmo das seções (DS-04, DEVERIA)
Alterne fundos para dar respiro: escuro (topo) → escuro (diferenciais) → claro (conceito) → escuro (infraestrutura) → claro/satélite (localização) → claro (galeria) → claro (inventário) → escuro (preços) → foto escurecida (contato) → claro (FAQ) → escuro (rodapé).
Espaçamento vertical das seções: `clamp(80px, 10vw, 150px)`.

## Movimento (DS-05)
| Efeito | Atributo | Regra |
|---|---|---|
| Aparecer ao rolar | `data-reveal` (+ `data-delay="1..3"`) | sobe 24 px e aparece; uma vez só |
| Revelar imagem | `data-reveal="clip"` | máscara abre de baixo para cima |
| Palavra manuscrita | `.script` | "escreve" da esquerda para a direita (clip-path) ao aparecer |
| Filetes dourados | `.x__kicker i` | se desenham ao aparecer |
| Contadores | `data-count="20000"` | contam de 0 ao valor em 1,4 s quando 60% visível; texto final é o do HTML |
| Parallax leve | `data-parallax` | só computador |
| Grão | `.grain` | textura fixa com opacidade ~0,04 sobre a página |
| Pré-carregador | `.preloader` | PODE existir; nunca segura a página mais que 1,2 s |
| Cursor próprio | `.cursor` | PODE; só computador com mouse |

`prefers-reduced-motion: reduce` desliga reveal, contadores, parallax, cursor e escrita da manuscrita (tudo aparece pronto).
**Não** desliga o vídeo do topo (ver `12-licoes-aprendidas.md`).
Conteúdo nunca pode depender de animação para ficar visível: sem JS, tudo aparece (classe `no-js` removida pelo primeiro script).

## Pontos de quebra (DS-06)
`1120 px` (header compacta) · `860 px` (menu vira gaveta, barra fixa do celular aparece) · `560 px` (grades viram uma coluna) · `389 px` (ajustes finos).

## Texto (DS-07, DEVE)
**Tom**: calmo, seguro e concreto. Fala de liberdade e de história, mas sempre com dados (tamanho, distância, condição).

Fórmulas:
- **H1**: convite + categoria + assinatura. Ex.: "Venha viver no melhor condomínio de fazendas *da história.*"
- **Lead do topo**: o que é + tamanho + para quê + localização. Ex.: "Glebas a partir de 20.000 m² para viver, criar e construir patrimônio com liberdade, natureza e uma localização que mantém a cidade por perto."
- **H2**: afirmação + fecho manuscrito. Ex.: "Estrutura clara para usar, construir e *permanecer.*" · "Perto de tudo o que importa. *Longe de tudo o que cansa.*" · "Conheça cada *detalhe.*"
- **Kicker**: categoria da seção, 2–4 palavras. Ex.: "Infraestrutura planejada", "Imagens reais do empreendimento".
- **Texto de apoio**: 1–2 frases, até ~240 caracteres.

Regras:
- O topo DEVE dizer o tipo de produto e o tamanho mínimo ("fazendinhas de 20 mil m²", "lotes a partir de 360 m²", "apartamentos de 2 e 3 quartos").
- Números no padrão brasileiro: `20.000 m²`, `R$ 467 mil`, `15 min`, `(31) 99780-1248`.
- Proibido: "imperdível", "última chance", exclamações em série, promessas de valorização garantida, letras maiúsculas em frases inteiras.
- Escassez só com número real ("82% já vendido", "Restam 9 glebas").
- Chamadas preferidas: "Agendar visita", "Receber tabela", "Ver preços e condições", "Falar com um consultor".
