#!/usr/bin/env python3
"""Gera as versões WebP do site a partir das fotos originais (spec 08 · MID-F03).

Para cada imagem da pasta de origem cria, na pasta de destino:
  <nome>.webp     largura máxima 1800 px (galeria/seções)  ou 1600 px no modo --topo
  <nome>-sm.webp  largura máxima 900 px                     ou 1100 px no modo --topo
O nome sai do arquivo original em minúsculas, sem acentos e com hífens.
Não aumenta imagens pequenas. Corrige a rotação do celular (EXIF).

Uso:
  python3 scripts/otimizar_imagens.py fotos-originais/ public_html/assets/galeria/
  python3 scripts/otimizar_imagens.py fotos-topo/ public_html/assets/img/ --topo
  python3 scripts/otimizar_imagens.py planta/ public_html/assets/planta/ --grande 3600 --pequena 1400 --qualidade 85
"""
import argparse, os, re, sys, unicodedata
from PIL import Image, ImageOps

EXT = ('.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.heic')


def slug(nome):
    s = unicodedata.normalize('NFKD', nome).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-') or 'imagem'


def salvar(im, largura, destino, qualidade):
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    im.save(destino, 'WEBP', quality=qualidade, method=6)
    return im.size, os.path.getsize(destino) // 1024


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('origem'); ap.add_argument('destino')
    ap.add_argument('--topo', action='store_true', help='tamanhos da foto do topo (1600 e 1100 px)')
    ap.add_argument('--grande', type=int); ap.add_argument('--pequena', type=int)
    ap.add_argument('--qualidade', type=int, default=82)
    a = ap.parse_args()
    grande = a.grande or (1600 if a.topo else 1800)
    pequena = a.pequena or (1100 if a.topo else 900)
    sufixo = '-1100' if a.topo and not a.pequena else '-sm'
    os.makedirs(a.destino, exist_ok=True)
    arquivos = sorted(f for f in os.listdir(a.origem) if f.lower().endswith(EXT))
    if not arquivos:
        sys.exit('Nenhuma imagem encontrada em ' + a.origem)
    for f in arquivos:
        try:
            im = ImageOps.exif_transpose(Image.open(os.path.join(a.origem, f))).convert('RGB')
        except Exception as e:
            print(f'  ! {f}: não abriu ({e})'); continue
        base = slug(os.path.splitext(f)[0])
        g = salvar(im, grande, os.path.join(a.destino, base + '.webp'), a.qualidade)
        p = salvar(im, pequena, os.path.join(a.destino, base + sufixo + '.webp'), a.qualidade)
        print(f'  {base}.webp {g[0][0]}x{g[0][1]} {g[1]} KB · {base}{sufixo}.webp {p[0][0]}x{p[0][1]} {p[1]} KB')


if __name__ == '__main__':
    main()
