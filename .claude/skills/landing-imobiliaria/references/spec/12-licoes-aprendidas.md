# 12 · Lições aprendidas (Estância da Lapa, out–nov 2026)

Problemas reais que aconteceram. Cada um virou regra na spec.

## Código
| O que aconteceu | Causa | Regra |
|---|---|---|
| O CSS chegou a ~300 KB com 30 blocos `<style id="...-v16">`, `-v20`, `-v31` brigando com `!important` | cada ajuste foi uma camada nova por cima da anterior | ARQ-05: corrigir a regra original; um arquivo CSS organizado por seção |
| Vídeo do topo não tocava no site publicado | esperava o evento `load` (que atrasa com mapas e fontes externas); era desligado por `prefers-reduced-motion`; celular em economia de bateria bloqueia autoplay | HERO-03: iniciar no `DOMContentLoaded`, tentar de novo no primeiro gesto, não desligar por movimento reduzido |
| Vídeo novo publicado e o antigo continuava aparecendo | cache do navegador/hospedagem com o mesmo nome de arquivo | MID-V04: versão no nome do arquivo (`-v4`, `-v5`) |
| Título do topo "pulava" e quebrava ao mudar o zoom | JS medindo e reajustando o tamanho da fonte | HERO-04: tamanho só por CSS com `min(... , svh, px)` |
| Vídeo lento no celular | arquivo de computador servido no celular | MID-V02: versão 576×1024 de ~2 MB + poster |
| Botão de som grande e mal posicionado | botão flutuante sobre o vídeo | HDR-04: botão pequeno de 34 px no header |
| Ruído no vídeo aéreo e cortes secos | material bruto do drone | MID-V05: redução de ruído, LUT única, transição suave |
| Lead podia se perder se a pessoa fechasse a aba | envio só no botão final | LEAD-05/06: pendente + envio na saída + fila |

## Conteúdo e criativos (feedback do cliente)
- Não usar **degradê verde (cor da marca) sobre a foto**, **sombra no texto** nem **céu "pintado"**. A foto tem que parecer real.
- Deixar sempre claro **o que se vende e o tamanho** ("fazendinhas de 20 mil m²"). Título bonito que não diz o produto não converte.
- Fugir de títulos repetidos: usar a variedade da própria landing page ("Uma escala rara para viver melhor", "Perto de tudo o que importa. Longe de tudo o que cansa.").
- Foto ruim derruba a peça inteira: escolher com cuidado a foto principal de cada seção; preferir aéreas amplas e a portaria.
- Selo/painel creme pesado sobre a foto foi rejeitado; preferir número grande ou faixa limpa.
- Distâncias precisam ser conferidas (houve troca de 15/45 min); toda distância sai do briefing.

## Processo
- Antes de publicar, conferir no navegador headless **o site no ar**, não só o arquivo local.
- Nunca colocar chave do CRM nem webhook no site; a linha do CRM é a única porta.
- Webhook é de produção: máximo 2 leads de teste "Teste Site" e avisar para apagar.
- Mudanças visuais só no que foi pedido; se um ajuste piorar, voltar ao estado anterior.
- Nov/2026: o Meta contou mais leads (Pixel) do que chegaram ao CRM. O Pixel é entregue pelo navegador mesmo quando a página fecha; o `fetch` JSON (com pré-verificação CORS) pode se perder ao trocar para o WhatsApp. Por isso existe a reserva por `sendBeacon` e o evento `lead_envio_falhou`. Nos anúncios, use parâmetros de URL com nome: `utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}`.
- Nov/2026: cada site tinha o próprio código de envio (Make, nomes de função diferentes) e cada correção precisava ser feita site a site. Agora o padrão é único: a linha do CRM faz envio, origem, Pixel e Google; o site só chama `AsteriLead.start(chave, dados)`/`send(chave, dados)`.
- Nov/2026: a linha foi publicada num site antes de o site estar conectado no CRM e o site ficou sem envio de leads até a reversão. Sempre: conectar no CRM → conferir o script → publicar (LEAD-09).
