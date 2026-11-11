# 08 · Mídia

## Fotos (`MID-F`)
- **MID-F01 DEVE** só fotos reais do empreendimento. Fotos da região (parques, cidade) podem entrar com legenda clara.
- **MID-F02 DEVE** cor natural e viva: corrigir exposição e balanço de branco; proibido céu substituído ou "pintado", degradê colorido sobre a foto e sombra atrás do texto.
- **MID-F03 DEVE** formato WebP em dois tamanhos, com o mesmo nome base:
  | Uso | Grande | Pequena (`-sm`) | Qualidade |
  |---|---|---|---|
  | Galeria e seções | 1800 px de largura (~350 KB) | 900 px (~90 KB) | 82 |
  | Foto do topo | 1600 px (~300 KB) | 1100 px (`-1100`, ~150 KB) | 82 |
  | Planta | `-hd` para zoom + `-sm` 1400 px | — | 85 |
  Gere com `scripts/otimizar_imagens.py <pasta-origem> <pasta-destino>` (`--topo` para a foto do topo).
- **MID-F04 DEVE** nomes em minúsculas, sem acento, por categoria: `portaria-fachada.webp`, `aerea-horizonte-sm.webp`, `infra-energia.webp`, `casas-palmeiras.webp`, `acesso-porteira.webp`.
- **MID-F05 DEVE** `<img>` com `alt` descritivo, `loading="lazy"` e `decoding="async"` (exceto a foto do topo), e `srcset`/`sizes` nas fotos grandes.

## Vídeo do topo (`MID-V`)
Referência: `hero-desktop-v4.mp4` 1920×1080, 30 fps, H.264 High, ~4,7 Mbps, 15,2 s, 8,5 MB · `hero-mobile-v5.mp4` 576×1024, ~1,1 Mbps, 2,1 MB.
- **MID-V01 DEVE** só imagens aéreas do empreendimento, sem texto, sem logo, em loop sem emenda (início e fim combinam ou transição suave).
- **MID-V02 DEVE** duas versões: computador 16:9 (1920×1080, ≤ 9 MB) e celular 9:16 (576×1024, ≤ 2,5 MB), H.264, sem áudio, `+faststart`.
- **MID-V03 DEVE** capa (poster) WebP de cada versão a partir do primeiro quadro: 1600×900 (≤ 200 KB) e 576×1024 (≤ 100 KB).
- **MID-V04 DEVE** nome com versão (`-v1`, `-v2`...). Ao trocar o vídeo, **troque o número** no nome e no código: o cache do navegador e da hospedagem guarda o arquivo antigo.
- **MID-V05 DEVERIA** cortes com transição suave (fusão ou máscara orgânica, como folhas), nunca corte seco; redução de ruído e LUT de cor iguais em todos os trechos.
- Gere com `scripts/video_hero.sh <video-origem> <pasta-destino> <versão> [início] [duração]`.

## Trilha (`MID-A`)
- **MID-A01 PODE** trilha ambiente (natureza, instrumental), AAC `.m4a` 112 kbps estéreo, ~60 s em loop, ≤ 1 MB, com fade nas pontas para o loop não estalar.
- **MID-A02 DEVE** ter licença de uso comercial (registrar a fonte no briefing `midia.trilha.licenca`).

## Vídeos do modal
- **MID-M01 DEVE** vídeos longos (apresentação, institucional) ficam no YouTube e abrem no modal via `data-video-open="yt:<ID>"` (`youtube-nocookie.com`). Nunca hospedar vídeo longo no site.

## Imagem de compartilhamento e ícones (`MID-I`)
- **MID-I01 DEVE** `assets/share-<slug>-vN.jpg` 1200×630, ≤ 150 KB: logo da marca sobre fundo da marca ou foto aérea; usada em `og:image` e `twitter:image`.
- **MID-I02 DEVE** ícones: `favicon.ico` (16/32/48), `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png` 180×180, `app-192.png`, `app-512.png`, `isotipo-512.png`; `site.webmanifest` com `theme_color` = `--brand-dark`.
