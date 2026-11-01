# Site Lancheiras & Papinhas

Site estático (HTML, CSS e um JS pequeno), publicado na Vercel em https://lancheirasepapinhas.com.br

## Como publicar
A Vercel roda `sh build.sh`, que copia os arquivos para `out/` e gera as imagens WebP e a `og-image.jpg`
a partir dos originais em `assets/img/src/`.

## Onde mexer
- Textos e seções: `index.html`
- Visual: `styles.css`
- Animações, barra fixa e evento de conversão (Lead): `app.js`
- Depoimentos: bloco "PROVA SOCIAL" no `index.html` (oculto até ter depoimentos reais)
- Meta Pixel e GA4: no `<head>` do `index.html`, trocar `ID_AQUI` e descomentar
