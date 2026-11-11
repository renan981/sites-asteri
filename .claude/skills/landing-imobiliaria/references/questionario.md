# Questionário do produto imobiliário

Objetivo: preencher `briefing/produto.yaml` com o mínimo de perguntas.
Legenda: **[O]** obrigatório para publicar · **[R]** recomendado · **[P]** pode ficar para depois.
Cada pergunta indica o campo do briefing (`→ campo`).

## Como conduzir
1. **Rodada 0 (sempre primeiro):** pergunte o que já existe e peça os arquivos. Leia tudo antes da rodada 1.
2. Faça rodadas de até 4 perguntas. Pule as que o material já respondeu e mostre o que você extraiu ("Do book eu tirei: ... Está certo?").
3. Use alternativas sempre que existirem; deixe espaço para "Outro".
4. Se o usuário não souber, registre `[preencher]` e continue. Só **[O]** bloqueia a publicação, não a construção.
5. No fim, mostre as pendências agrupadas por quem resolve (comercial, marketing, técnico).

---

## Rodada 0 — Materiais existentes
"Antes das perguntas: o que você já tem desse produto? Pode anexar ou mandar links (Drive, site, YouTube)."
- Book ou apresentação comercial (PDF) · tabela de preços (planilha) · planta/implantação (imagem, PDF, KMZ)
- Fotos (portaria, obra, áreas comuns, unidades, drone) · vídeos (drone, institucional, YouTube)
- Logo e manual de marca · site antigo ou de concorrente que goste · anúncios já veiculados
→ `materiais.*`

## Bloco A — O produto
1. **[O]** Nome comercial do empreendimento e como ele é escrito (acentos, "da", "do"). → `empreendimento.nome`
2. **[O]** Que tipo de produto é? (alternativas) → `empreendimento.tipo`
   Condomínio de fazendas/chácaras · Loteamento aberto · Condomínio de lotes · Condomínio de casas · Apartamentos · Salas/lojas · Outro
3. **[O]** Em que fase está? Pronto · Em obras · Lançamento/pré-lançamento. → `empreendimento.fase`
4. **[O]** Como se chama a unidade e qual a faixa de tamanho? (gleba, lote, casa, apartamento; "a partir de X m²", até Y m²) → `produto.unidade_nome`, `produto.area_min`, `produto.area_max`
5. **[R]** Quantas unidades no total e quantas estão disponíveis hoje? Quanto já foi vendido (%)? → `produto.total_unidades`, `comercial.disponiveis`, `comercial.percentual_vendido`
6. **[R]** Tipologias (para casas e apartamentos): nome, área privativa, quartos/suítes, vagas e planta de cada uma. → `produto.tipologias`
7. **[R]** Quem é o empreendedor/loteador/incorporadora? Registro/aprovação (matrícula, alvará, RI) pode aparecer no site? → `empreendimento.empreendedor`, `empreendimento.registro`
8. **[P]** Regras importantes do condomínio (fracionamento, área mínima construída, animais, uso comercial). → `produto.regras`

## Bloco B — Localização
1. **[O]** Endereço ou região, cidade e estado. → `localizacao.*`
2. **[O]** Coordenada da portaria ou do stand (link do Google Maps serve). → `localizacao.coordenadas`
3. **[R]** Por onde se chega (rodovias, avenidas) e se há trecho de terra no caminho. → `localizacao.acessos`, `localizacao.mostrar_tipo_pista`
4. **[R]** Distâncias que vendem: aeroporto, capital, centro da cidade, shopping, hospital, escolas. Em minutos de carro.
   Se não souber, calcule pela rota e peça confirmação. → `localizacao.distancias`
5. **[R]** Pontos de destaque da região para o mapa (parques, atrativos, cidades vizinhas, serviços). → `localizacao.pontos`

## Bloco C — Diferenciais e infraestrutura
1. **[O]** Os 4 principais diferenciais, do mais forte para o mais fraco. O primeiro vira o destaque grande. → `produto.diferenciais`
2. **[O]** Infraestrutura: o que está **pronto**, **em obras** e **previsto** (portaria, água, energia, internet, asfalto/cascalho, iluminação, lazer). → `produto.infraestrutura`
3. **[R]** Lazer e áreas comuns. → `produto.lazer`
4. **[R]** Uma frase que resume o conceito ("uma nova escala para viver"). Se não houver, proponha 3 opções. → `empreendimento.conceito`
5. **[R]** Uma chamada de impacto para a faixa corrida (ex.: "82% já vendido", "Últimas unidades"). → `comercial.selo`

## Bloco D — Preço e condições
1. **[O]** Preço "a partir de" e qual unidade é a referência (número, área). → `comercial.preco_a_partir`, `comercial.unidade_referencia`
2. **[O]** Planos de pagamento: para cada um, entrada (% ou R$), número e valor das parcelas, juros/correção, anuais/balões. → `comercial.planos`
3. **[R]** A tabela completa está numa planilha Google? Pode ser compartilhada "qualquer pessoa com o link pode ver"? Qual aba? → `comercial.inventario`
4. **[R]** Texto legal obrigatório (validade da tabela, correção, CRECI). → `comercial.aviso_legal`
5. **[P]** Simulador de parcela no site? Sim/Não. → `site.simulador`

## Bloco E — Marca e mídia
1. **[O]** Logo (SVG ou PNG transparente) e cores da marca. Existe manual? → `marca.*`
2. **[R]** Fontes da marca, se houver. Padrão de referência: Montserrat + uma manuscrita. → `marca.fontes`
3. **[O]** Fotos reais: onde estão? Quais são as melhores para o topo? → `midia.fotos`
4. **[R]** Vídeo aéreo para o topo (sem texto, 20–40 s). Música de fundo: sim/não (padrão: sim, com botão de silenciar). → `midia.video_hero`, `midia.trilha`
5. **[R]** Vídeos para o YouTube/modal (apresentação, institucional): links. → `midia.videos`
6. **[R]** Tom de voz: palavras que a marca usa e palavras proibidas. → `marca.tom`

## Bloco F — Atendimento e integrações
1. **[O]** WhatsApp comercial (com DDD) e e-mail que aparecem no site. → `contato.*`
2. **[O]** Domínio do site, para conectar em CRM › Captação › Sites conectados (o usuário conecta; o CRM gera o código e a linha). → `integracoes.crm_site`
3. **[R]** Nome do produto exatamente como cadastrado no CRM (campo `empreendimento`). → `integracoes.crm_empreendimento`
4. **[R]** IDs de medição já criados: Pixel da Meta, GA4 (G-…), conversão do Google Ads (AW-…/rótulo) — vão no cadastro do site no CRM; Tag Manager e Clarity, se existirem, ficam no HTML. Se não existirem, ficam desligados. → `integracoes.*`
5. **[R]** Dias e horários de visita. → `contato.visitas`
6. **[P]** Perguntas de qualificação extras (renda, cidade, quem decide). → `site.qualificacao`

## Bloco G — Domínio e publicação
1. **[O]** Domínio do site (já comprado?). → `site.dominio`
2. **[R]** Hospedagem: Hostinger (padrão), outra, ou ainda não tem. → `site.hospedagem`
3. **[R]** Repositório GitHub: criar novo (`renan981/<slug>`) ou usar existente. → `site.repositorio`
4. **[P]** Precisa de política de privacidade nova (responsável, CNPJ, e-mail de contato do encarregado)? → `site.privacidade`
