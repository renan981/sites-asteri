#!/usr/bin/env bash
# Gera o vídeo do topo nas duas versões da spec (08 · MID-V02/V03/V04):
#   hero-desktop-vN.mp4  1920x1080, H.264, sem áudio, ~4,5 Mbps, +faststart
#   hero-mobile-vN.mp4   576x1024 (recorte central 9:16), ~1,1 Mbps
#   poster-desktop-vN.webp 1600x900 · poster-mobile-vN.webp 576x1024 (primeiro quadro)
# Uso: scripts/video_hero.sh <video-origem> <pasta-destino> <versao> [inicio-seg] [duracao-seg]
# Ex.: scripts/video_hero.sh drone-montado.mp4 public_html/assets/video 1 0 16
# A montagem (cortes, transições, cor, redução de ruído) é feita antes; este script só codifica.
set -euo pipefail
SRC=${1:?informe o vídeo de origem}; OUT=${2:?informe a pasta de destino}; V=${3:?informe a versão (1, 2, 3...)}
SS=${4:-0}; T=${5:-}
mkdir -p "$OUT"
DUR=(); [ -n "$T" ] && DUR=(-t "$T")
COMMON=(-an -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -movflags +faststart -r 30)

ffmpeg -v error -y -ss "$SS" "${DUR[@]}" -i "$SRC" \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  "${COMMON[@]}" -b:v 4500k -maxrate 5500k -bufsize 9000k "$OUT/hero-desktop-v$V.mp4"

ffmpeg -v error -y -ss "$SS" "${DUR[@]}" -i "$SRC" \
  -vf "crop=ih*9/16:ih,scale=576:1024" \
  "${COMMON[@]}" -b:v 1100k -maxrate 1400k -bufsize 2200k "$OUT/hero-mobile-v$V.mp4"

ffmpeg -v error -y -i "$OUT/hero-desktop-v$V.mp4" -frames:v 1 -vf "scale=1600:900" -c:v libwebp -quality 70 -compression_level 6 "$OUT/poster-desktop-v$V.webp"
ffmpeg -v error -y -i "$OUT/hero-mobile-v$V.mp4" -frames:v 1 -c:v libwebp -quality 70 -compression_level 6 "$OUT/poster-mobile-v$V.webp"

for f in "$OUT"/hero-*-v"$V".mp4 "$OUT"/poster-*-v"$V".webp; do
  printf '  %-40s %s\n' "$(basename "$f")" "$(du -h "$f" | cut -f1)"
done
echo "Lembre: troque o número da versão no código (assets/js/site.js) para o navegador não usar o vídeo antigo."
