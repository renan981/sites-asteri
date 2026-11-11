# Especificação — Landing page de empreendimento imobiliário

Versão 1.0 · extraída do site da Estância da Lapa (https://estanciadalapa.com), em novembro de 2026.

## O que é esta spec
É o contrato do site: o que ele **precisa** ter e fazer, e como se confere que está pronto.
O código é consequência da spec. Se o código e a spec discordarem, vale a spec. Se a spec estiver errada, corrija primeiro a spec e depois o código.

## Palavras de obrigação
- **DEVE**: obrigatório. O site não vai ao ar sem isso.
- **DEVERIA**: recomendado. Só fica de fora com motivo registrado no briefing (`site.excecoes`).
- **PODE**: opcional, depende do produto.

Cada requisito tem um código (`HERO-03`, `LEAD-07`...). Use o código em commits e na lista de aceite.

## Mapa da spec
| Arquivo | Assunto | Quando ler |
|---|---|---|
| `01-objetivo-e-funil.md` | Para que serve o site, públicos, funil, métricas | Fase 2 |
| `02-arquitetura.md` | Arquivos, `config.js`, regras de código, navegadores | Fase 4 |
| `03-design-system.md` | Cores, fontes, componentes, movimento, texto | Fases 3 e 4 |
| `04-secoes.md` | Catálogo de seções com requisitos e variações por tipo | Fases 3 e 4 |
| `05-leads-e-conversao.md` | Formulários, WhatsApp, payload do CRM, fila, testes | Fase 4 |
| `06-medicao.md` | Pixel, GA4, Google Ads, Clarity, UTMs | Fase 4 |
| `07-inventario-dinamico.md` | Mapa de unidades com dados da planilha | Fase 4 (se houver) |
| `08-midia.md` | Fotos, vídeo do topo, trilha, imagem de compartilhamento, ícones | Fase 4 |
| `09-seo-performance-a11y.md` | Metadados, velocidade, acessibilidade | Fases 4 e 5 |
| `10-deploy.md` | GitHub, Hostinger, domínio, verificações | Fase 6 |
| `11-aceite-qa.md` | Lista de aceite final | Fase 5 |
| `12-licoes-aprendidas.md` | Problemas reais e como evitá-los | Fase 0 |

## Princípios do produto (valem para todo o site)
1. **Clareza antes de beleza.** Em 5 segundos, quem chega entende *o que é* (tipo de produto), *quanto mede*, *onde fica* e *o que fazer* (botão).
2. **Prova real.** Fotos e vídeos do empreendimento, números conferidos, mapa verdadeiro. Nada de imagem de banco passando por real.
3. **Um passo de cada vez.** Formulários em 2 etapas: primeiro nome e WhatsApp, depois o resto é opcional.
4. **O lead nunca se perde.** O envio ao CRM acontece antes de abrir o WhatsApp, com fila de reenvio.
5. **Alto padrão sem peso.** Visual sofisticado (tipografia leve, bastante respiro, movimento suave), carregando rápido no celular 4G.
6. **Dados em um lugar só.** Números e IDs saem do briefing e do `config.js`. Inventário vem da planilha comercial.

## Glossário
- **Unidade**: o que se vende (gleba, lote, casa, apartamento, sala).
- **Briefing**: `briefing/produto.yaml`, preenchido na entrevista.
- **Implementação de referência**: `public_html/index.html` do repositório `renan981/estancia-da-lapa`.
- **Lead**: contato capturado por formulário e enviado ao CRM pela linha do CRM (Sites conectados).
- **Script** (estilo): palavra final do título em fonte manuscrita, em dourado.
