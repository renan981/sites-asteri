# 05 · Leads e conversão

**Padrão único dos sites da Astéri (desde 11/11/2026):** o site **não tem código próprio de envio de lead, Pixel ou Google**. Tudo isso vem da **linha do CRM**, gerada em CRM › Captação › **Sites conectados** quando o site é cadastrado. Corrigir a linha no CRM corrige todos os sites no mesmo dia.

Arquivos do site:
- **A linha do CRM** (uma tag, em todas as páginas): `<script src="https://sandybrown-gazelle-848710.hostingersite.com/crm/api/site/script.js?s=<código-do-site>"></script>`. O código do site sai do domínio (ex.: `estanciadalapa.com` → `estanciadalapa`) e aparece no cartão do site no CRM, com o botão "Copiar a linha".
- `templates/js/contato.js`: abas, formulários em 2 etapas, agendamento de visita e janela de lead do WhatsApp. Chama `window.AsteriLead` da linha. O **contrato de marcação** (atributos `data-*`) está no topo do arquivo.

## Caminho do lead
```
Visitante ─► formulário do site (etapa 1: nome + WhatsApp)
              │  AsteriLead.start(chave, dados)   → guarda como pendente + agenda envio em 90 s
              ▼
          etapa 2 (opcional) ou Pular / 90 s / sair da página / abrir WhatsApp
              │  AsteriLead.send(chave, dados)    → envia UMA vez
              ▼
   linha do CRM ─► POST direto ao CRM (api/site/lead?s=<código>) ─► fila e motor de leads do CRM
              │  falhou? fila no navegador e reserva por sendBeacon na saída; reenvio na próxima visita (mesmo lead_id)
              ▼
   Pixel "Lead" + GA4 "generate_lead" + Google Ads "conversion" (IDs do cadastro do site no CRM)
```

## Requisitos
- **LEAD-01 DEVE** o site só carrega a linha do CRM. Nenhuma chave, token, webhook do Make, URL de API ou código próprio de envio no site.
- **LEAD-02 DEVE** a linha em **todas** as páginas (inclusive privacidade), **sem `defer`**, antes de `contato.js`, para `window.AsteriLead` existir quando os formulários forem usados.
- **LEAD-03 DEVE** chamar só a API padrão, com chave: `AsteriLead.start(chave, dados)` e `AsteriLead.send(chave, dados)` (chaves `contato`, `visita`, `whatsapp`). Para atualizar um pendente, chame `start(chave, dados)` de novo. Não criar outro formato de chamada (ex.: `start(dados)` sem chave, `update`).
- **LEAD-04 DEVE** todo link `wa.me` passa pela janela de lead (etapa 1 nome + WhatsApp; etapa 2 e-mail, finalidade, entrada, prazo, profissão opcionais). O WhatsApp só abre depois do envio ao CRM.
- **LEAD-05 DEVE** site com formulários e janela próprios (`contato.js`) leva `<body data-asteri="manual">`, para a linha não capturar de novo. Site **sem** JavaScript próprio de formulário (formulário HTML comum) não leva o atributo: a linha captura os formulários e mostra a própria janela antes do WhatsApp (opções do cadastro no CRM).
- **LEAD-06 DEVE** não enviar o campo `canal`. O CRM deduz pela origem.
- **LEAD-07 DEVE** máscara de telefone `(DD) 9XXXX-XXXX`, validação de nome (≥ 2 letras) e telefone (10–11 dígitos) antes de avançar; mensagens de erro junto ao campo.
- **LEAD-08 DEVE** a mensagem do WhatsApp é pré-preenchida conforme o botão (ver `config.js` → `mensagens`), incluindo a unidade quando vier do inventário.
- **LEAD-09 DEVE** o site é conectado no CRM **antes** de ser publicado com a linha. Ordem: cadastrar o site em Sites conectados → abrir `https://sandybrown-gazelle-848710.hostingersite.com/crm/api/site/script.js?s=<código>` e ver a linha do site → só então publicar o site. Publicar a linha antes do cadastro deixa o site **sem envio de leads**.

## Corpo do lead (nomes exatos do CRM Astéri)
Campos de pessoa e qualificação:

| Campo | Exemplo | Origem |
|---|---|---|
| `lead_id` | `site-1b2c...` | gerado pela linha |
| `nome` | `Maria Souza` | etapa 1 |
| `telefone` | `(31) 99999-9999` | etapa 1 |
| `email` | `maria@...` | etapa 2 |
| `empreendimento` | `Estância da Lapa` | cadastro do site no CRM |
| `finalidade` | `Moradia` · `Investimento` · `Lazer / segunda casa` | etapa 2 |
| `Prazo para comprar` | `Imediato` · `Em até 3 meses` · `De 3 a 6 meses` · `Mais de 6 meses` · `Ainda não sei` | etapa 2 |
| `Faixa de investimento` | `R$ 467.000` | simulador/inventário |
| `Valor para entrada` | `Até R$ 50 mil` · `De R$ 50 a 100 mil` · ... | etapa 2 / visita |
| `Cidade onde mora` | | PODE |
| `Quem participa da decisão` | | PODE |
| `Profissão` | | etapa 2 da janela |
| `Interesse` | ver tabela abaixo | botão de origem |
| `Dia e horário da visita` | `Sáb, 15/11 — manhã` | aba visita |

Outras perguntas entram com o próprio nome (ex.: `Sobre a entrada`) e aparecem na ficha como respostas extras.

Campos de origem (preenchidos pela linha): `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `li_fat_id`, `fbp`, `fbc`, `campaign_id`, `adset_id`, `ad_id`, `landing_page`, `referrer`, `primeiro_toque` (só quando é outra visita, anterior), `recebido_em`.

Valores de `Interesse`:
| Ponto de captura | Interesse |
|---|---|
| Contato › Receber tabela | `Receber a tabela completa` |
| Contato › Agendar visita | `Agendar visita` |
| WhatsApp aberto pelo simulador ou ficha de unidade | `Simular minha parcela` |
| WhatsApp aberto por "Receber tabela" | `Receber a tabela completa` |
| Demais botões de WhatsApp | `Falar no WhatsApp` |

## API pública (`window.AsteriLead`, da linha)
```js
AsteriLead.start('contato', { nome, telefone, 'Interesse': 'Receber a tabela completa' }); // etapa 1 (chamar de novo atualiza o pendente)
AsteriLead.send('contato', { email, finalidade, 'Prazo para comprar': prazo });             // etapa 2 / pular
AsteriLead.send('visita',  { nome, telefone, finalidade, 'Prazo para comprar': p, 'Valor para entrada': e,
                             'Interesse': 'Agendar visita', 'Dia e horário da visita': 'Sáb, 15/11 — manhã' });
```

## Teste (DEVE seguir)
1. Sem gerar lead: `scripts/testar_leads.js` intercepta o envio ao CRM (`**/api/site/lead**`) e confere os 3 fluxos e o corpo.
2. Real: depois de publicar, **um** lead com nome começando por **"Teste Site"**, em aba anônima, com o link de teste (UTMs e IDs reais). Conferir no CRM: lead novo, origem, campanha e anúncio. Avisar o usuário para apagar.
3. No CRM, Sites conectados › **Conferir agora** deve ficar verde (linha instalada, formulários, Pixel).
