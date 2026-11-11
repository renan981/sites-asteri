# Sites Astéri

Onde se criam as landing pages dos empreendimentos da Astéri.

## Criar um site novo
1. Abra uma sessão do Claude Code com **este repositório** (`renan981/sites-asteri`).
2. Peça: `/landing-imobiliaria Quero criar a landing page do empreendimento <nome>` (ou só "crie a landing page do empreendimento <nome>").
3. A skill conduz: materiais e entrevista → briefing (você aprova) → roteiro das seções (você aprova) → **você conecta o site no CRM** (Captação › Sites conectados) → construção e conferência → **você cria o repositório do site** em github.com/new → publicação na Hostinger → "Conferir agora" verde no CRM → lead "Teste Site".

## Padrão único de leads
Todo site usa só a **linha do CRM** (gerada em Captação › Sites conectados): envio direto ao CRM, origem da visita, Pixel e Google. O site não tem código próprio de envio; os formulários chamam `AsteriLead.start(chave, dados)` e `AsteriLead.send(chave, dados)`. Ordem obrigatória: conectar no CRM → conferir o script → publicar.

## O que tem aqui
- `.claude/skills/landing-imobiliaria/`: a skill (SKILL.md), a especificação (`references/spec/`), modelos (`templates/`) e scripts de conferência (`scripts/`).

Cada site fica no **próprio repositório** (ex.: `renan981/estancia-da-lapa`, `renan981/terra-nostra`), publicado na Hostinger pela branch `deploy/hostinger`. A Estância da Lapa é a implementação de referência.
