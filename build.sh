#!/bin/sh
# Build do site estático: copia os arquivos para out/ e gera as imagens WebP + og-image.
# Ordem de origem de cada imagem:
#   1) assets/img/src/<nome>.jpg ou .webp (original guardado no repositório)
#   2) URL de download (variável de ambiente IMG_HERO, IMG_CRIANCAS, IMG_BEBE)
#   3) placeholder do mesmo tamanho (o site nunca quebra)
set -e
rm -rf out && mkdir -p out/assets/img
cp index.html privacidade.html styles.css app.js favicon.svg apple-touch-icon.png out/
cp -r assets/img/ingredientes out/assets/img/

URL_HERO="${IMG_HERO:-}"
URL_CRIANCAS="${IMG_CRIANCAS:-}"
URL_BEBE="${IMG_BEBE:-}"

TMP=$(mktemp -d)
img() { # nome url largura altura largura_pequena
  n=$1; u=$2; w=$3; h=$4; s=$5; src="$TMP/$n.jpg"
  if [ -f "assets/img/src/$n.jpg" ]; then cp "assets/img/src/$n.jpg" "$src"; echo "IMG $n: repositorio (jpg)"
  elif [ -f "assets/img/src/$n.webp" ]; then convert "assets/img/src/$n.webp" -quality 95 "$src"; echo "IMG $n: repositorio (webp)"
  elif [ -n "$u" ] && curl -fsSL --retry 2 -o "$src" "$u"; then echo "IMG $n: download ok ($(wc -c < "$src") bytes)"
  else echo "AVISO IMG $n: sem arquivo, usando placeholder"; convert -size "${w}x${h}" gradient:'#F3DCD4-#E5EBCB' "$src"; fi
  convert "$src" -resize "${w}x${h}^" -gravity center -extent "${w}x${h}" -strip -quality 78 "out/assets/img/$n.webp"
  convert "$src" -resize "${s}x" -strip -quality 74 "out/assets/img/$n-$s.webp"
  cp "$src" "$TMP/$n.src.jpg"
}
img hero-explosao-alimentos "$URL_HERO" 1680 944 900
img criancas-felizes-lancheira "$URL_CRIANCAS" 1456 1088 720
img bebe-papinha "$URL_BEBE" 1264 1264 640
# Imagem de compartilhamento (WhatsApp/Instagram/Facebook): 1200x630
convert "$TMP/hero-explosao-alimentos.src.jpg" -resize 1200x630^ -gravity center -extent 1200x630 -strip -quality 82 out/og-image.jpg
ls -la out out/assets/img
