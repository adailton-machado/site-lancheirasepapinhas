# Vídeos do site

O site já tem o encaixe pronto. Basta colocar os arquivos nesta pasta com estes nomes e publicar.
Se um arquivo não existir, o site mostra a imagem/animação no lugar, sem quebrar.

## 1. Vídeo do hero (fundo do topo)
- `hero.mp4` (H.264) e `hero.webm` (VP9). O mp4 é obrigatório; o webm é opcional, mas deixa mais leve.
- 6 a 10 segundos, em loop perfeito (o último quadro emenda no primeiro).
- Sem áudio (a faixa de áudio deve ser removida, não só silenciada).
- 1280x720 (16:9), 24 ou 30 fps, máx. 3 MB cada.
- Comida "explodindo" da lancheira, fundo terracota/creme, com espaço limpo à esquerda.
- Exemplo de conversão:
  `ffmpeg -i original.mov -an -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 26 -preset slow -movflags +faststart hero.mp4`
  `ffmpeg -i original.mov -an -vf "scale=1280:-2,fps=30" -c:v libvpx-vp9 -crf 36 -b:v 0 hero.webm`

## 2. Vídeo "Veja o app em 30 segundos"
- `passo-a-passo.mp4` (H.264), vertical 1080x1920 ou horizontal 1920x1080, até 30-45 s, máx. 8 MB.
- Pode ter áudio (a mãe aperta play). Legendas queimadas no vídeo ajudam, porque muita gente assiste sem som.
- Mostrar: pedir acesso → abrir o link → salvar na tela inicial → aba Geladeira → Nutri IA.

Quando o `passo-a-passo.mp4` existir, troque no `index.html` a frase do passo 3 de "Como entrar no teste".
