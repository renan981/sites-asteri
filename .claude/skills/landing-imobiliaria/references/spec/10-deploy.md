# 10 · Publicação (GitHub + Hostinger)

## Fluxo
```
editar public_html/ ─► push na main ─► GitHub Actions (deploy.yml)
     ─► branch deploy/hostinger recebe só o conteúdo de public_html/ (mesmo tree)
     ─► integração Git da Hostinger puxa a branch para o public_html do servidor (1–2 min)
```

## Requisitos
- **DEP-01 DEVE** um repositório por empreendimento (`<conta>/<slug>`), privado. O Claude não tem permissão para criar repositório: o usuário cria em github.com/new (privado, nome = slug) e a sessão adiciona o repositório; o site é construído e enviado para lá.
- **DEP-02 DEVE** `.github/workflows/deploy.yml` igual a `templates/deploy.yml`: roda em push na `main` que mude `public_html/**` e manualmente; valida que existe `index.html`; recusa `.env`, `.env.*`, `config.php` e `*.sql`; publica o tree de `public_html/` na raiz de `deploy/hostinger`, sem commit se nada mudou.
- **DEP-03 DEVE** `README.md`, `docs/`, `briefing/`, `tools/`, `.github/` e `.claude/` não são publicados.
- **DEP-04 DEVE** na Hostinger: hPanel › site › Avançado › GIT › Continue com GitHub › repositório + branch `deploy/hostinger` › diretório `public_html` › Implantar › manter Implantação automática. Quem faz é o usuário; a skill dá o passo a passo e confere depois.
- **DEP-05 DEVE** `public_html/.htaccess` a partir de `templates/htaccess.txt`: `DirectoryIndex index.html`; 301 do `www` e do endereço provisório da Hostinger para o domínio oficial (mantendo caminho e parâmetros); rota desconhecida → `index.html`; `no-cache` para `.html/.js/.css`; compressão; cache de 30 dias para imagens, vídeo e ícones.
- **DEP-06 DEVE** depois de cada publicação: conferir o workflow verde, a branch `deploy/hostinger` com o mesmo tree, e o **site no ar** (abrir a URL pública no navegador headless, celular e computador, sem erros no console).
- **DEP-07 DEVE** troca de domínio: atualizar `canonical`, `og:url`, `og:image`, `sitemap.xml`, `robots.txt` e o 301 do `.htaccess`; depois verificações da Meta, Search Console, GA4 e Clarity (ver `06-medicao.md` MED-04).
- **DEP-08 DEVE** nunca alterar a branch `deploy/*` à mão; nunca colocar segredo em `public_html/`.
- **DEP-09 DEVE** conectar o site no CRM antes da primeira publicação com a linha (LEAD-09): CRM › Captação › Sites conectados › Conectar site, com endereço, empreendimento, Pixel, Google Analytics e conversão do Google Ads (os dois últimos opcionais) e as duas opções desmarcadas quando o site usa `contato.js`. Conferir `<CRM>/api/site/script.js?s=<código>`. Depois de publicar: **Conferir agora** verde e um lead "Teste Site".

## Documentação que o repositório novo DEVE ter
- `README.md`: o que é, onde está o site, como publicar.
- `docs/deploy.md`: fluxo acima + configuração feita no hPanel (data) + prompt para alterações futuras.
- `docs/captura-de-leads.md`: código do site no CRM, campos, pontos de captura, IDs de medição cadastrados no CRM, padrão de UTMs.
