# Sites Astéri — regras para as sessões

- Fale sempre em português do Brasil, com frases curtas e sem jargão. O usuário não é programador.
- Para criar ou alterar uma landing page, siga a skill `.claude/skills/landing-imobiliaria/SKILL.md` (spec primeiro, depois código, depois conferência).
- Padrão único de leads (spec 05): só a linha do CRM; nenhum webhook, `leads.js`, Pixel ou Google colado à mão; chamadas só `AsteriLead.start(chave, dados)` e `AsteriLead.send(chave, dados)`. Ordem obrigatória: site conectado no CRM e script conferido **antes** de publicar.
- Cada site fica no próprio repositório. O Claude não consegue criar repositório no GitHub: peça ao usuário para criar em github.com/new (privado, nome = slug do empreendimento) e então adicione o repositório à sessão.
- Mudanças vão por branch e PR; o usuário faz o merge. Mudança visual: mostrar prints e pedir aprovação antes do PR.
- Nunca peça senhas ou tokens no chat. Nunca invente dado comercial nem ID de Pixel/Google.
