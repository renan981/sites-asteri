# 04 · Catálogo de seções

Ordem de referência (Estância da Lapa) e `id` de cada seção:

| # | Seção | id | Obrigação |
|---|---|---|---|
| 1 | Header + menu | `header` | DEVE |
| 2 | Topo (hero) | `inicio` | DEVE |
| 3 | Faixa corrida | — (`.ticker`) | DEVERIA |
| 4 | Diferenciais | `diferenciais` | DEVE |
| 5 | Conceito | `conceito` | DEVERIA |
| 6 | Infraestrutura | `infraestrutura` | DEVE |
| 7 | Localização e arredores (mapa + rota) | `arredores` (rota em `localizacao`) | DEVE |
| 8 | Galeria | `galeria` | DEVE |
| 9 | Inventário (mapa de unidades) | `glebas` / `lotes` / `unidades` | PODE (ver tabela por tipo) |
| 10 | Preços e condições | `condicoes` | DEVE |
| 11 | Contato (tabela / visita) | `contato` | DEVE |
| 12 | Dúvidas frequentes | `duvidas` | DEVE |
| 13 | Rodapé | — | DEVE |
| 14 | Flutuantes: WhatsApp, barra do celular, janela de lead, modal de vídeo, lightbox | — | DEVE |

## Seções por tipo de produto
| Tipo | Inventário | Infraestrutura destaca | Localização destaca | Extra |
|---|---|---|---|---|
| Condomínio de fazendas/chácaras | Mapa de glebas na planta + satélite/relevo | portaria, água, energia, internet, vias | rota com tipo de pista (asfalto × terra) | — |
| Loteamento / condomínio de lotes | Mapa de lotes na planta | asfalto, rede de esgoto, iluminação, lazer | escolas, comércio, centro | regras de construção |
| Condomínio de casas | Lista de casas disponíveis com planta | lazer, segurança | escolas, mercados | seção **Tipologias** (plantas) |
| Apartamentos | Quadro de unidades por andar/final (PODE) | lazer, tecnologia, sustentabilidade | mobilidade, serviços | seção **Tipologias** + **Andamento da obra** |
| Salas/lojas | Quadro de unidades | estacionamento, fluxo | vias, polos empresariais | seção **Rentabilidade** (PODE) |

Seções extras usam o mesmo esqueleto (kicker + h2 com `.script` + texto de apoio + conteúdo) e entram entre Infraestrutura e Galeria.

---

## 1 · Header (`HDR`)
- **HDR-01 DEVE** fixo no topo, transparente sobre o hero e com fundo `--brand-dark` translúcido + desfoque depois de rolar (`.is-scrolled`).
- **HDR-02 DEVE** conter: logo (link para `#inicio`), menu com até 6 âncoras (O projeto, Infraestrutura, Galeria, Localização, Preços, FAQ), botão "Agendar visita" (`#contato`).
- **HDR-03 DEVE** abaixo de 860 px: menu vira gaveta (`.mobile-nav`) aberta por botão com `aria-expanded`; fecha ao tocar num link e com Esc.
- **HDR-04 DEVE**, se houver trilha: botão de som pequeno (34 px, círculo com borda) ao lado do menu, `aria-pressed` e rótulo "Desativar som"/"Ativar som". Preferência salva em `localStorage` (`<slug>_som`).
- **HDR-05 DEVERIA** marcar o link da seção visível (`.is-active`).

## 2 · Topo / hero (`HERO`)
Conteúdo: mídia de fundo, kicker (cidade · estado), H1, lead, 2 botões, painel de 3 fatos, indicador "Role para descobrir".
- **HERO-01 DEVE** altura `min(max(760px, 100svh), 1100px)` no computador; no celular ocupa a tela.
- **HERO-02 DEVE** mostrar primeiro uma **foto** (com `fetchpriority="high"`, `srcset` 1100w/1600w e `preload` no `<head>`) e depois o **vídeo aéreo** por cima, com fade de 1,4 s.
- **HERO-03 DEVE** iniciar o vídeo no `DOMContentLoaded` (não no `load`), `muted playsinline loop`, versão de celular quando `largura ≤ 760` ou retrato; tentar de novo no primeiro toque/rolagem; pausar fora da tela; não carregar com `saveData`. Detalhes de arquivo em `08-midia.md`.
- **HERO-04 DEVE** tamanho do H1 só por CSS (fórmula em `03-design-system.md`). Proibido JS que mede e reajusta o título.
- **HERO-05 DEVE** botões: principal "Receber apresentação" (`#contato`) e contorno "Ver preços e condições" (`#condicoes`).
- **HERO-06 DEVE** painel de fatos com 3 números verdadeiros: tamanho mínimo, distância 1 (aeroporto/centro), distância 2 (capital).
- **HERO-07 PODE** trilha de fundo (`<audio loop>`): tenta tocar 1,2 s após aparecer; se bloqueada, começa no primeiro gesto; pausa com a aba escondida e quando um vídeo do modal abre; volume moderado; respeita o botão do header.
- **HERO-08 DEVE** filtro leve no vídeo para o texto ler bem (`brightness(.86)`), **sem** degradê colorido e **sem** sombra no texto.

## 3 · Faixa corrida (`TICK`)
- **TICK-01 DEVERIA** faixa com 5–8 frases curtas separadas por `✦`, rolando em loop infinito (2 grupos iguais, o segundo `aria-hidden`).
- **TICK-02 DEVE** a primeira frase é a prova mais forte (ex.: "82% já vendido"). Para em `prefers-reduced-motion`.

## 4 · Diferenciais (`DIF`)
- **DIF-01 DEVE** cabeçalho (kicker + H2 + texto) e grade com 1 destaque grande + lista de 3.
- **DIF-02 DEVE** destaque: foto com parallax, número grande com contador (ex.: "a partir de **20.000** m²"), título, texto e botão "Assistir apresentação" (abre modal de vídeo) se houver vídeo.
- **DIF-03 DEVE** itens da lista numerados (02–04), com ícone, título e uma frase.

## 5 · Conceito (`CON`)
- **CON-01 DEVERIA** texto à esquerda (ornamento, H2, lead, 3 métricas com contador, frase-assinatura) e mosaico de imagens à direita: foto principal com legenda, foto lateral e miniatura de vídeo clicável.
- **CON-02 DEVE** as métricas repetem os fatos do topo com o mesmo valor (fonte: briefing).

## 6 · Infraestrutura (`INF`)
- **INF-01 DEVE** cabeçalho com 3 selos (ex.: "100% regularizado", "Acesso pela MG-424", "15 min de Confins").
- **INF-02 DEVE** foto grande (legenda "Chegada · Portaria e acesso") + grade de 6 cartões `data-spot` com ícone, título e frase.
- **INF-03 DEVE** só listar como pronto o que está pronto. Item em obras/previsto leva etiqueta "Em obras"/"Previsto".

## 7 · Localização e arredores (`LOC`)
- **LOC-01 DEVE** mapa de satélite (MapLibre GL + imagens Esri World Imagery) centrado no empreendimento, carregado só quando a seção se aproxima da tela.
- **LOC-02 DEVE** pontos principais fixos do briefing (aeroporto, cidades, atrativos) com ícone e etiqueta; etiquetas que se cruzam recolhem para só ícone.
- **LOC-03 DEVERIA** pontos de serviço ao vivo do OpenStreetMap (Overpass, com servidores alternativos) por categoria: natureza, mercados e depósitos, restaurantes, serviços, cidades. Filtros em botões no topo do mapa.
- **LOC-04 DEVE** botões "Voltar ao empreendimento" e "Tela cheia". Fora da tela cheia, a rolagem da página não fica presa no mapa (um dedo rola a página).
- **LOC-05 DEVE** calculadora de rota: campo "De onde você vai sair?" (CEP, bairro ou cidade) + "Usar minha localização"; mostra distância, tempo, e links "Abrir no Google Maps" e "Abrir no Waze" apontando para a coordenada da portaria.
- **LOC-06 PODE** (rural) barra de tipo de pista: km de asfalto × km de terra, e lista das vias do caminho com o tipo de cada trecho (OSRM/Valhalla + OSM).
- **LOC-07 DEVE** painel "Na região" com distâncias e tempos de carro **a partir da portaria, pelo trajeto, sem trânsito** (OSRM), e nota de créditos (© OpenStreetMap, Esri).
- **LOC-08 DEVE** se o mapa falhar (sem rede, bloqueio), mostrar a lista de distâncias e o botão do Google Maps; nunca uma caixa vazia.

## 8 · Galeria (`GAL`)
- **GAL-01 DEVE** só fotos reais e atuais, com categorias (ex.: Portaria, Acesso, Infraestrutura, Casas, Aéreas) em filtros com contagem.
- **GAL-02 DEVE** grade em blocos de 5 (1 grande + 4), alternando o lado da grande; sobras tratadas (1 → faixa inteira; 2 → metade/metade; 3 → grande + 2; 4 → 2 linhas de 2).
- **GAL-03 DEVE** cada foto: miniatura `-sm.webp` com `loading="lazy"`, `alt` descritivo, legenda "Categoria · descrição"; clique abre lightbox com a versão grande, setas, contador "3/25", teclado (← → Esc) e deslize no celular.
- **GAL-04 DEVE** CTA no fim: "Prefere ver pessoalmente?" + "Agendar visita".

## 9 · Inventário (`INV`) — ver `07-inventario-dinamico.md`
- **INV-01** título com a contagem real ("Escolha a sua gleba. *Restam 9 disponíveis.*") e 3 números (Disponíveis, Reservadas, A partir de).
- **INV-02** planta com as unidades disponíveis em destaque (sombra sobre o resto), números sobre cada unidade, zoom (+/−, arrastar), legenda Disponível/Reservada/Vendida.
- **INV-03** ficha da unidade ao tocar: número, quadra, área, preço, planos calculados, botão de WhatsApp com a unidade no texto, botão "Ver no satélite".
- **INV-04** lista ordenável (número, menor preço, maior área), sincronizada com a planta.
- **INV-05 PODE** vista de satélite e relevo 3D com o contorno da unidade e transparência da planta.

## 10 · Preços e condições (`PRE`)
- **PRE-01 DEVE** H2 com o preço "a partir de" e 3 fatos (unidades disponíveis, faixa de área, "sem juros nos planos curtos" se for o caso).
- **PRE-02 DEVERIA** barra de vendido animada com o percentual real e "Restam X unidades".
- **PRE-03 DEVE** 3 cartões de plano (o do meio em destaque `.is-featured`): nome curto, entrada, parcelas, frase explicativa.
- **PRE-04 DEVE** CTA "Receba a tabela completa..." com botão de WhatsApp (passa pela janela de lead, Interesse `Receber a tabela completa`) e "Agendar visita".
- **PRE-05 DEVE** nota legal: unidade de referência, "valores sujeitos a alteração sem aviso e à disponibilidade", correção conforme contrato.
- **PRE-06 DEVE** todos os números iguais ao briefing ou ao `inventario.json` (se o preço vem da planilha, os textos da seção são preenchidos por JS a partir dela, com o HTML como reserva).

## 11 · Contato (`CTT`) — ver `05-leads-e-conversao.md`
- **CTT-01 DEVE** fundo com foto aérea escurecida, texto à esquerda (kicker "Atendimento personalizado", H2 "Agende sua *visita.*", lista de 4 benefícios) e formulário à direita.
- **CTT-02 DEVE** duas abas: "Receber tabela" e "Agendar visita".
- **CTT-03 DEVE** aba tabela em 2 etapas: (1) nome + WhatsApp → (2) finalidade, prazo, e-mail, todos opcionais, com "Pular".
- **CTT-04 DEVE** aba visita em 2 etapas: (1) objetivo, prazo, entrada (escolha única, as três obrigatórias) → (2) dia (próximos dias úteis/fins de semana conforme briefing), período (manhã/tarde), nome e WhatsApp.
- **CTT-05 DEVE** texto de privacidade com link para a política, abaixo do botão.

## 12 · Dúvidas frequentes (`FAQ`)
- **FAQ-01 DEVE** 6–8 perguntas reais (onde fica, tamanho, documentação, como conhecer, uso permitido, preço, formas de pagamento), a primeira aberta, acordeão acessível (`button` + `aria-expanded`).
- **FAQ-02 DEVE** cartão "Não encontrou sua resposta?" com WhatsApp e número escrito.
- **FAQ-03 DEVERIA** marcação `FAQPage` em JSON-LD com as mesmas perguntas (ver `09-seo-performance-a11y.md`).

## 13 · Rodapé (`FTR`)
- **FTR-01 DEVE** logo, frase de 2 linhas (o que é + tamanho + acesso), menu, WhatsApp e e-mail, © ano automático, link da política, aviso "Imagens, valores e disponibilidade sujeitos a confirmação no atendimento."

## 14 · Flutuantes (`FLT`)
- **FLT-01 DEVE** botão de WhatsApp flutuante no computador (canto inferior direito), escondido no celular (a barra cumpre o papel).
- **FLT-02 DEVE** barra fixa no celular (≤ 860 px) com "Ver preços" e "WhatsApp"; aparece depois de 60% do hero e some quando o formulário de contato está na tela; respeita `safe-area-inset-bottom`.
- **FLT-03 DEVE** janela de lead antes do WhatsApp (ver `LEAD-04`), com foto lateral e 3 benefícios no computador.
- **FLT-04 DEVE** modal de vídeo: aceita `data-video-open="yt:ID"` (YouTube sem cookies, autoplay) ou ID do Google Drive; fecha com ×, clique fora e Esc; devolve o foco; pausa a trilha enquanto aberto.
- **FLT-05 DEVE** todos os diálogos com `role="dialog"`, `aria-modal`, foco preso dentro e rolagem do fundo travada.
