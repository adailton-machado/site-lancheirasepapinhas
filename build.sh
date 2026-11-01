#!/bin/sh
# Build do site estático: copia os arquivos para out/ e gera as imagens WebP + og-image.
# Ordem de origem de cada imagem:
#   1) assets/img/src/<nome>.jpg (se existir no repositório)
#   2) URL de download (variável IMG_<NOME> ou URL padrão abaixo, temporária)
#   3) placeholder do mesmo tamanho (o site nunca quebra)
set -e
rm -rf out && mkdir -p out/assets/img
cp index.html privacidade.html styles.css app.js favicon.svg apple-touch-icon.png out/
cp -r assets/img/ingredientes out/assets/img/
mkdir -p out/assets/video && cp assets/video/* out/assets/video/ 2>/dev/null || true
rm -f out/assets/video/LEIA-ME.md
# Liga os vídeos automaticamente quando os arquivos existem
[ -f assets/video/hero.mp4 ] && sed -i 's/class="hero-video" data-video="off"/class="hero-video" data-video="on"/' out/index.html
[ -f assets/video/passo-a-passo.mp4 ] && sed -i 's/data-video-slot data-video="off"/data-video-slot data-video="on"/' out/index.html
true

URL_HERO="${IMG_HERO:-https://export-download.canva.com/PLcOU/DAHZr3PLcOU/-1/0/0002-7662269688555797812.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261101%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261101T070755Z&X-Amz-Expires=34168&X-Amz-Signature=159bd9ca53eb461f09a7c336c05bf581c07ad2738dc6f6c44bf9df44e2424f3b&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Sun%2C%2001%20Nov%202026%2016%3A37%3A23%20GMT}"
URL_CRIANCAS="${IMG_CRIANCAS:-https://export-download.canva.com/PLcOU/DAHZr3PLcOU/-1/0/0003-7662269688555797812.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261101%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261101T072157Z&X-Amz-Expires=34764&X-Amz-Signature=a46f096519fb37b8bb5bf34c95211777a61096132c4e078d3099a184c749aabd&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Sun%2C%2001%20Nov%202026%2017%3A01%3A21%20GMT}"
URL_BEBE="${IMG_BEBE:-https://export-download.canva.com/PLcOU/DAHZr3PLcOU/-1/0/0004-7662269688555797812.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261031%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261031T155924Z&X-Amz-Expires=91226&X-Amz-Signature=fbd6e810dc3418eacdc38c20e92a4cc42c86e610c8e95b971f4358932a42783e&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Sun%2C%2001%20Nov%202026%2017%3A19%3A50%20GMT}"

TMP=$(mktemp -d)
img() { # nome url largura altura largura_pequena
  n=$1; u=$2; w=$3; h=$4; s=$5; src="$TMP/$n.jpg"
  if [ -f "assets/img/src/$n.jpg" ]; then cp "assets/img/src/$n.jpg" "$src"; echo "IMG $n: repositorio"
  elif curl -fsSL --retry 2 -o "$src" "$u"; then echo "IMG $n: download ok ($(wc -c < "$src") bytes)"
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
