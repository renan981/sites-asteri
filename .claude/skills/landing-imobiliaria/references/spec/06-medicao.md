# 06 · Medição

Pixel, Google Analytics e conversão do Google Ads ficam no **cadastro do site no CRM** (Sites conectados), não no código do site: a linha do CRM carrega e dispara os eventos com o mesmo ID do lead. Sem ID, o campo fica vazio e o bloco desligado. **Nunca invente ID.** Se o cliente já tem um **Google Tag Manager**, o snippet do contêiner fica no HTML do site **antes** da linha do CRM; a linha então envia os eventos para ele. O Clarity, se houver, também fica no HTML.

| Ferramenta | Campo no `config.js` | Formato | Eventos |
|---|---|---|---|
| Pixel da Meta | `pixel` | só números (ex.: `478526204473983`) | `PageView` em toda visita; `Lead` no envio, com `eventID = lead_id` |
| Google Analytics 4 | `ga4` | `G-XXXXXXXXXX` | `page_view` automático; `generate_lead` com `lead_id`, `interesse`, `empreendimento` |
| Google Ads | `ads` + `adsSendTo` | `AW-123…` e `AW-123…/rótulo` | `conversion` com `transaction_id = lead_id` |
| Microsoft Clarity | `clarity` | id curto (ex.: `z9exl28d97`) | `clarity('event','lead')`, `clarity('set','interesse',…)`, `clarity('upgrade','lead')` |

## Requisitos
- **MED-01 DEVE** Pixel e Google pela linha do CRM (IDs no cadastro do site); Tag Manager e Clarity, se houver, no HTML, assíncronos.
- **MED-02 DEVERIA** eventos auxiliares no GA4: `som_ligado`/`som_desligado`, `video_aberto` (modal), `rota_calculada`, `unidade_aberta` (inventário), `whatsapp_clique`. Nome em minúsculas com sublinhado.
- **MED-03 DEVE** a política de privacidade cita Pixel, Google, Clarity, `localStorage` e o envio ao CRM.
- **MED-04 DEVE** depois de publicar no domínio final: verificar o domínio na Meta (TXT `facebook-domain-verification=…`), propriedade no Search Console (TXT `google-site-verification=…`), fluxo de dados do GA4 com a URL nova, e o Clarity com o domínio. Quem cria os TXT é o usuário no painel do domínio; a skill dá o passo a passo.

## Padrão de UTMs para os anúncios (passe ao gestor de tráfego)
- `utm_campaign`: minúsculas e hífens, `<slug>-<objetivo>-<aaaamm>` (ex.: `estancia-da-lapa-captacao-202611`).
- **Meta** (Parâmetros de URL de **todos** os anúncios; o mesmo texto do botão "Mensagem para o gestor" do CRM):
  `utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}`
- **Google** (codificação automática ligada + sufixo):
  `utm_source=google&utm_medium=cpc&utm_campaign=<slug>-captacao-AAAAMM&utm_content={creative}&utm_term={keyword}&campaign_id={campaignid}&adset_id={adgroupid}&ad_id={creative}`
