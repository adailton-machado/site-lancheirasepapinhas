# PROMPT PARA O CLAUDE CODE: redesign do app e do site Lancheiras & Papinhas

> Cole **tudo** isto no Claude Code, aberto na pasta onde está o código do app (se não souber qual é, abra em qualquer pasta: ele procura). Preparado em 10/11/2026 a partir da leitura do site, do app no ar, do Supabase e da Vercel.

## ANTES DE COMEÇAR: o que já está pronto e o que falta (só 3 coisas suas)

**Já feito (não refazer):**
- **Backup dos dados:** cópia das 21 tabelas no Supabase, esquema `backup_20261110`, conferida linha a linha (469 linhas, tudo igual).
- **Pontos de volta do código:** versões atuais do app e do site guardadas na Vercel e anotadas na seção 0.
- **Guia de como voltar atrás:** arquivo `BACKUP-E-VOLTAR-ATRAS-LANCHEIRAS.md` (entregue junto com este prompt; o Claude Code deve copiá-lo para `docs/` do projeto).

**Falta você fazer (uns 5 minutos, o Claude Code te guia):**
1. **Login da Vercel no computador:** no terminal, `vercel login`, com a conta que tem o time "Lancheiras e Papinhas" (usuário `lancheirasepapinhas`).
2. **Login do GitHub no computador:** `gh auth login` (GitHub.com, HTTPS, entrar pelo navegador) com a conta `adailton-machado`.
3. **Aprovar cada etapa** olhando o link de teste que o Claude Code mandar, e dizer "aprovado" ou o que mudar. **Nada vai para o ar sem o seu "aprovado".**

Você **não** precisa dar nenhuma chave nem senha do Supabase ao Claude Code. O redesign é visual e não mexe no banco.

---

## COMO USAR (para o Claude Code)

Você vai redesenhar o app e o site, mantendo a identidade, as cores e **todas as funções**. O dono, Adailton, **não é programador**. Fale em português simples e curto, explique um passo por vez e **nunca peça que ele rode comandos ou edite arquivos**: você faz tudo. Pergunte só o que for indispensável e, nas decisões de rotina, decida e avise.

Regras que valem sempre:
1. **Não quebrar o que funciona.** Conta, login, Nutri IA (texto e áudio), receitas, Premium, Comunidade, Parceiros, lembretes e painel admin devem funcionar igual ao final de cada etapa.
2. **Nada vai para o ar (produção) sem "aprovado" do dono.** Toda etapa publica só em **preview** (link de teste). Em produção, só a Etapa 9, depois do aprovado final.
3. **Backup antes de tudo** (Etapa 0). Cada etapa termina com commit, tag e um jeito de voltar.
4. **Não tocar no banco nem nos servidores:** não altere tabelas, regras de acesso, funções do Supabase (`nutri-ia`, `gerar-receita`, `enviar-aviso`), links de pagamento do Asaas, nem dados de parceiros. Se achar que precisa, pare e avise o dono com o motivo.
5. **Segredos:** a chave pública (anon) do Supabase que já está no app pode ficar; **nunca** use ou escreva `service_role`, senha do banco, tokens da Vercel/GitHub. Existe verificação automática antes de cada commit (Etapa 0).
6. **Teste sem sujar a produção:** ao testar o app, use "Continuar sem conta, só neste aparelho". Não crie contas reais, não poste na comunidade, não gaste a cota da Nutri IA de ninguém. Para testar telas que exigem login, peça ao dono para criar uma conta de teste e passe o e-mail dela para você.
7. **Sem inventar conteúdo:** nada de depoimentos falsos, números de usuários, selos ou alegações de saúde. Imagens de crianças e alimentos são **ilustrativas** (a página já avisa). Nunca foto de rosto de criança.
8. Siga a ordem das etapas (seção 9). Ao final de cada uma: o que mudou (3 linhas), link de preview, o que o dono deve olhar.

---

## 0. AMBIENTE JÁ PREPARADO (não recriar)

| Item | Valor |
|---|---|
| App no ar | `https://app.lancheirasepapinhas.com.br/` (projeto Vercel `lancheiras-app-v6`, time `voryya-ia`) |
| Site no ar | `https://lancheirasepapinhas.com.br/` (projeto Vercel `site-lancheirasepapinhas`, time `voryya-ia`) |
| Repositório do site | `adailton-machado/site-lancheirasepapinhas` (privado, publica sozinho a cada commit na `main`) |
| Repositório do app | **não existe** (o app foi publicado pela linha de comando) |
| Versão do app no ar hoje | `dpl_Cfh9brkWTctgzxz4EkydQJjDdKTU` (04/11/2026 17:07). Anterior: `dpl_pvUUGMAedLNoTVDgxzNkgZ8v2zSd` |
| Versão do site no ar hoje | commit `24e6740334eb6623499464f8af097bcdead2be03`, implantação `dpl_CC7gDbMvPia5t1ox5cMBgwcz488b` |
| Supabase | projeto `xuobyewpicaziculoife`, URL `https://xuobyewpicaziculoife.supabase.co`, plano gratuito |
| Backup dos dados | esquema `backup_20261110` no mesmo projeto, 21 tabelas, 469 linhas, conferido |
| Pagamento | links do Asaas dentro do app (Premium mensal R$ 29,90 e anual R$ 159,90) |
| Outros projetos na Vercel | `lancheiras-app`, `-v2` a `-v5`, `lancheiras-papinhas`, `lancheiras-papinhas-app`, `saas-agentes-ia-clinicas`, `charles-esquadrias`. **Ignore e não apague nenhum.** Só `lancheiras-app-v6` e `site-lancheirasepapinhas` fazem parte deste trabalho. |

**O app é um arquivo único** (HTML com cerca de 326 mil caracteres, CSS e JavaScript dentro dele, sem framework e sem etapa de build; a Vercel serve o arquivo como está). O site é HTML, CSS e `app.js` simples, com imagens em `/img` e ilustrações SVG em `/ingredientes`.

---

## 1. O QUE O PRODUTO É (leitura feita em 10/11/2026; confira no código antes de confiar)

App de alimentação infantil para mães, de 6 meses a 12 anos, criado pela Cris (@lancheirasepapinhas). Funciona no celular como PWA (instala na tela inicial). Frase de marca: "Sua parceira de cozinha no celular, com receitas certas para a idade. Com segurança e sem estresse."

**Telas e funções do app (barra de baixo com 5 abas):**
- **Hoje:** saudação ("Bom dia, Adailton"), cartão "Veja as ideias de hoje para [filho]" com idade e fase; **"Esta semana"** (4 toques: Frutas, Vegetais, Proteínas, Carboidratos, zera toda segunda); dica para instalar o app; **Sugestão do dia**; **Combinação do dia** (lanche principal, para completar, para acompanhar, com "Trocar" e "Gerar outra combinação"; parte é Premium); Radar da semana (alertas e regras da escola); **cartão de Parceiro** (hoje: VORYYA IA); **sequência de dias** com recorde; avisos (lembrete de no máximo 2 por semana); atalhos para Comunidade, Guia da mãe, Geladeira e Nutri IA; rodapé com avisos legais.
- **Receitas** (3 sub-abas: Receitas, Geladeira, Guia): filtro por fase (6 meses, 7 a 8, 9, 10 a 12 meses, Pré-escola 4 a 6 anos, 7 a 12 anos), busca por receita ou ingrediente, cartão "Criar receita com IA" (Premium), lista de receitas com ícone, tempo e modo; Geladeira (o que tem em casa vira receitas que dão certo); Guia da mãe (6 capítulos).
- **Nutri IA:** chat de texto e **áudio** (microfone, até 1 minuto), no tom de amiga, com memória da conversa, perfil e alergias do filho; cota grátis de 2 perguntas por dia (Premium tem muito mais); tem "modo guiado" quando a IA não está disponível.
- **Comunidade ("Cantinho das mães"):** salas (Lancheira da semana, Papo de mãe, Dúvidas e outras), tema da semana, enviar foto da lancheira (sem rosto de criança), curtidas, comentários, denúncia, bloqueio, regras da casa, medalhas.
- **Parceiros ("Clube de parceiros"):** indicações de empresas locais sempre com o selo "Parceiro"; cartão com WhatsApp, Ligar e Ver site.
- **Conta:** e-mail e senha, criar conta, esqueci a senha, **continuar sem conta (só neste aparelho)** com código de backup local. Perfis de várias crianças (Premium). Painel **admin** para a equipe (não mexer).
- **Premium:** pago pelo Asaas (cartão ou boleto), liberado automaticamente.

**Banco (Supabase, não alterar):** `profiles`, `children`, `chat_messages`, `ai_usage`, `ai_recipes`, `guide_progress`, `weekly_tracker`, `partners`, `partner_events`, `app_events`, `community_posts/comments/likes/reports/blocks/bans/settings`, `push_subs`, `push_cfg`, `premium_events`, `premium_pending`. Funções: `nutri-ia`, `gerar-receita`, `enviar-aviso`. Armazenamento `community` (fotos).

**Site:** seções `topo`, `nutri-ia` (3 cenas de conversa), `recursos` (10 itens), `receitas` (por fase), `planos` (Grátis x Premium), `quem` (Oi, eu sou a Cris), `duvidas` (FAQ) e chamada final. Todos os botões levam ao app. Já existe regra para `prefers-reduced-motion`.

---

## 2. DIAGNÓSTICO VISUAL (o que eu vi; o dono quer "legal, bonito, 3D e 4D, intuitivo, mantendo cores e visual")

**O que está bom e deve ser mantido:** a ideia do morango como marca; o tom acolhedor; o hero do site (foto de explosão de alimentos numa lancheira laranja, com frutinhas flutuando e o áudio da Nutri IA); os balões de conversa; a paleta suave; a clareza dos textos.

**O que pode melhorar:**
1. **O site e o app parecem de marcas diferentes.** Site: tons de vinho e verde (`--berry #7A3A2C`, `--leaf #4E7035`), fontes Fraunces (serifada) e DM Sans. App: azul-marinho e terracota (`--ink #393B5A`, `--accent #B5654D`), fontes Fredoka e Nunito. **Manter as cores de cada um, mas unir as duas famílias em um só conjunto de variáveis** (seção 3), para que o app e o site compartilhem fundo, sombras, bordas e raios.
2. **O app é plano e "só texto".** Cartões brancos e bege sem profundidade, ícones são emojis (mudam de aparência em cada celular, ficam pequenos), sem ilustrações, sem personagem, vazios sem graça (Comunidade vazia, Parceiros com um cartão só).
3. **Não há 3D hoje, nem no app nem no site.** Nenhum dos dois usa perspectiva nem profundidade. Movimento: o app tem uma única animação (`up`, entrada) e cerca de 13 KB de CSS; o site tem `float`, `pulse`, `burst`, `carousel` e `wv`. Os dois já têm regra para `prefers-reduced-motion`. O site tem boa matéria-prima (SVGs de ingredientes: morango, cenoura, banana, mirtilo, queijo, tomate, aveia, folha) que pode virar o "kit 3D".
4. **Contraste.** Medido por mim: botão principal do app (branco sobre `#B5654D`) dá 4,26:1 (o mínimo para texto normal é 4,5); links e rótulos em terracota sobre o fundo dão 3,91:1. Trocar o `--accent` do app por **`#A65840`** (mesma cor, um tom mais fechado: 5,13:1 com branco e 4,72:1 sobre o fundo). Site: contrastes ok (mínimo medido 5,40).
5. **No computador, o app é uma coluna estreita** no meio de uma página vazia.
6. **Tela de login simples** (caixa branca, sem a cara da marca).
7. **Navegação:** a barra de baixo é boa, mas o ícone e o texto são pequenos; o caminho "Hoje" para "perguntar à Nutri IA" é longo; não há ligação visual forte entre o cartão da Nutri IA e o microfone.

---

## 3. SISTEMA DE DESIGN (manter as cores; criar variáveis compartilhadas)

**Cores: manter exatamente as existentes.** Reunir em um bloco de variáveis comum, com os nomes antigos preservados (para não quebrar nada):

```css
:root{
  /* APP (manter) */
  --bg:#F8F5EF; --surface:#FFFFFF; --peach:#F8E4DB; --butter:#FAF2DA; --mint:#E8F0E8; --tag:#DDE8F4;
  --ink:#393B5A; --ink2:#64667F; --accent:#A65840; /* era #B5654D: ajustado só para contraste */
  --accent-ink:#FFFFFF; --line:#EADFD3; --warn-bg:#FCE6E0; --warn-ink:#8A3A28;
  /* SITE (manter) */
  --cream:#F4EAE7; --paper:#FBF6F3; --berry:#7A3A2C; --berry-deep:#3A1F18; --leaf:#4E7035; --leaf-deep:#2F4A1E;
  --blush:#F3DCD4; --sage:#B9CBAE; --sage-soft:#DCE6D3; --mint-site:#E5EBCB; --text:#3A1F18; --muted:#5A3B33;
  /* PROFUNDIDADE (novo) */
  --sombra-1:0 2px 6px rgba(90,40,30,.08);
  --sombra-2:0 10px 24px rgba(90,40,30,.12);
  --sombra-3:0 22px 48px rgba(90,40,30,.18);
  --brilho:inset 0 1px 0 rgba(255,255,255,.7);
  --raio-s:12px; --raio-m:20px; --raio-g:28px; --raio-pilula:999px;
  --mola:cubic-bezier(.34,1.56,.64,1); --suave:cubic-bezier(.22,1,.36,1);
}
```

**Fontes:** manter Fredoka e Nunito no app e Fraunces e DM Sans no site (são a personalidade de cada um). Carregar com `font-display:swap` e só os pesos usados.

**Texto:** mínimo 16 px no corpo, 14 px em legendas; títulos curtos; nunca texto cinza claro sobre bege.

**Toque:** alvos de pelo menos 48 x 48 px; espaço de 8 px entre alvos; um botão principal por tela (o mais forte); botões secundários em contorno.

**Ícones:** dois conjuntos.
- **Interface** (barra de baixo, cabeçalho, ações): SVG inline próprios, traço de 2 px, cantos arredondados, 24 px, cor `currentColor`. Substituem os emojis da interface.
- **Comida** (receitas, rastreador, estados vazios): **kit "adesivo 3D"**, feito em SVG com degradê, brilho e sombra, partindo dos 8 SVGs que já existem no site e acrescentando pelo menos: maçã, brócolis, frango, arroz, pão, ovo, iogurte, feijão, abacate, uva, laranja, leite. Todos com a mesma luz (vinda do canto superior esquerdo), mesma sombra e contorno suave. Salvar em `assets/comida/*.svg` e reaproveitar no site.

**Mascote:** o morango da marca (já é o logo), versão ilustrada original com rosto simpático e **estados animados**: parado (respira), pensando (Nutri IA), comemorando (semana completa), dormindo (sem conexão). Em SVG com CSS, menos de 6 KB cada. Aparece na Nutri IA, nos estados vazios, no login e na sequência de dias. É criação própria do projeto: não copie personagens existentes.

---

## 4. 3D E 4D: O QUE SIGNIFICA AQUI (e os limites)

- **3D** = **profundidade**: camadas, sombras em vários níveis, ilustrações com volume, cartões que inclinam, elementos que "saem" da tela. **Sem WebGL pesado, sem Three.js.** Técnicas: CSS (`perspective`, `transform: rotateX/rotateY/translateZ`, `box-shadow` em camadas), SVG com degradês, `backdrop-filter` com cuidado.
- **4D** = **profundidade + tempo**: movimento com significado. Parallax leve no scroll, entrada em cascata das listas, mola nos toques, transição entre abas, confete de frutinhas ao completar a semana, onda no áudio, esqueleto de carregamento.

**Onde aplicar (obrigatório):**
1. **Site, topo:** a foto da explosão de alimentos com **3 camadas** de frutinhas (perto, meio, longe) com parallax no scroll e inclinação suave com o mouse no computador; flutuar parado no celular. A foto continua sendo a estrela.
2. **Site, Nutri IA:** os balões entram em sequência, com o microfone pulsando; o cartão de áudio com onda animada.
3. **Cartões de receita e de plano:** inclinam até 6 graus seguindo o ponteiro (só onde há mouse); no celular, "afundam" 2 px ao toque.
4. **App, Hoje:** o cartão principal com ilustração do morango; **rastreador semanal**: ao tocar em Frutas, Vegetais, Proteínas ou Carboidratos, o ícone 3D "pula" (animação de mola), solta frutinhas (reaproveitar o `@keyframes burst`) e vibra 10 ms onde o aparelho permitir; **com os 4 completos na semana**, o mascote comemora.
5. **App, transição entre abas:** deslize e fade de 200 ms (`document.startViewTransition` quando existir; senão CSS).
6. **App, Nutri IA:** avatar do morango, "digitando" com 3 pontinhos que saltam, onda de áudio ao vivo enquanto grava.
7. **Barra de baixo:** pílula flutuante com sombra; o item ativo ganha uma "bolha" que desliza até ele.
8. **Carregamento:** esqueletos com brilho em vez de telas vazias.

**Limites (inegociáveis):**
- **Desempenho:** 60 quadros por segundo em celular Android simples. Animar só `transform` e `opacity`. Nada de animar `box-shadow`, `filter` ou `width`. Máximo de 12 elementos animados ao mesmo tempo na tela. `will-change` só durante a animação.
- **Peso:** no total, no máximo +25 KB de CSS e +15 KB de JavaScript comprimidos, sem bibliotecas novas. Imagens em WebP ou SVG. Nada de vídeo novo no topo.
- **Acessibilidade:** respeitar `prefers-reduced-motion` (sem parallax, sem inclinação, sem confete; só troca de estado). Nenhuma informação só por movimento. Nada pisca mais de 3 vezes por segundo.
- **Fallback:** se o navegador não suportar algo, a tela fica estática e correta.
- **Meta de medição (site, celular, Lighthouse):** Desempenho 90 ou mais, Acessibilidade 95 ou mais, LCP abaixo de 2,5 s, CLS abaixo de 0,1. App: sem erro no console em nenhuma aba.

---

## 5. UX INTUITIVA: MELHORIAS OBRIGATÓRIAS

Para uma mãe cansada, com bebê no colo, usando com uma mão.

1. **Hoje em ordem de importância:** (1) cartão do dia com a pergunta "o que vai na lancheira hoje?", (2) botão grande **"Perguntar à Nutri IA"** com microfone ao lado (no máximo **2 toques** da tela inicial até gravar), (3) combinação do dia, (4) rastreador da semana, (5) o resto. O que for aviso ou propaganda vai para baixo.
2. **Cota da Nutri IA visível** ("Restam 2 perguntas hoje"), com convite gentil ao Premium só quando a cota acaba (sem bloquear com tela cheia).
3. **Cartões de receita** com ícone 3D de comida, tempo, fase e um selo de alergia ("sem ovo" ou "tem ovo, atenção"). Alerta de alergia sempre em `--warn-bg`/`--warn-ink`, nunca só por cor: acompanhar de ícone e texto.
4. **Estados vazios com personalidade:** Comunidade vazia ("Seja a primeira a mostrar uma lancheira"), Receitas sem resultado, Geladeira vazia, Parceiros sem parceiro na cidade, cada um com mascote e uma ação clara.
5. **Instalar o app:** cartão discreto e fechável, que não volte a cada visita (lembrar a escolha por 14 dias). Instruções diferentes para iPhone e Android, com os passos desenhados.
6. **Tela de login e primeiro uso:** com a cara da marca (mascote, 3 benefícios curtos, botões grandes). Primeiro uso em até 3 passos: nome do filho, data de nascimento, alergias. Se o app já tem isso, só embeleze e encurte.
7. **Computador:** a partir de 900 px de largura, mostrar o app dentro de uma **moldura de celular** centralizada, com fundo de ilustração e um convite "Abra no celular" com o endereço (sem pedir dados).
8. **Mensagens de erro humanas:** "Sem internet agora. Seus dados estão salvos, tentamos de novo daqui a pouco." Nunca códigos.
9. **Consistência:** mesmo botão, mesmo raio, mesma sombra, mesmo espaçamento em todas as telas. Um único jeito de voltar.
10. **Premium:** mostrar o valor (receitas extras, gerador por IA, mais perguntas), preço claro (R$ 29,90 por mês ou R$ 159,90 por ano, "menos de R$ 13,33 por mês") e cancelamento fácil. Sem contagem regressiva falsa, sem pressão.

---

## 6. REGRAS TÉCNICAS

- **Não reescrever do zero.** O app tem 175 funções que funcionam. Trabalhe **por camadas**: (1) variáveis e CSS global, (2) componentes visuais, (3) tela por tela, (4) camada de movimento. Mantenha nomes de funções e de elementos usados pela lógica (por exemplo ids como `app`, `layer`). Antes de mudar uma função de tela (`viewHoje`, `viewReceitas`, `viewLista`, `viewFridge`, `viewIA`, `viewCom`, `viewGuia`), entenda quem a chama.
- **Quando fizer sentido, separar** o CSS novo em um bloco claramente comentado no próprio arquivo (`/* === REDESIGN: ... === */`) para ser fácil de remover. O app continua publicável como arquivo único; o kit de ícones pode ser embutido.
- **PWA:** o app **tem** `service worker` (`/sw.js`) e manifesto (`/manifest.webmanifest`), e registra o worker no código. Mantenha a instalação, o manifesto, os ícones e as notificações (`push_save`/`push_remove`). **Atenção ao cache:** se o `sw.js` guarda o arquivo antigo, o redesign pode não aparecer para quem já instalou. Leia o `sw.js` e, se precisar, aumente a versão do cache para as pessoas receberem o visual novo (e teste que o app abre offline sem tela quebrada).
- **Deploy:** projeto Vercel `lancheiras-app-v6`, time `voryya-ia`. Se a pasta não estiver ligada: `vercel link --project lancheiras-app-v6 --scope voryya-ia`. Preview com `vercel` (sem `--prod`). **`--prod` só na Etapa 9, com aprovado.** Os links de preview exigem login na Vercel; o dono está logado no navegador.
- **Site:** commits na `main` publicam em produção sozinhos. **Por isso trabalhe em uma branch** (`redesign`), use o preview da Vercel dessa branch e só faça merge na `main` na Etapa 9.
- **Testes obrigatórios** (Playwright, arquivo `testes/smoke.mjs`, rodando no preview, modo "sem conta", telas de 375, 390, 768 e 1280 px): cada aba abre sem erro no console; busca de receita funciona; abrir uma receita e voltar; botão da Nutri IA abre o chat; rastreador marca e desmarca; barra de baixo navega; cartão de instalar fecha e não volta; nada vaza para fora da tela na horizontal. Guarde **capturas de tela antes e depois** em `docs/capturas/` para o dono comparar.
- **Acessibilidade:** foco visível, ordem de tabulação lógica, `alt` ou `aria-label` em ícones, contraste conferido por script (os pares principais devem dar 4,5:1 ou mais), tamanho de fonte respeitando o zoom do sistema.

---

## 7. LIMITES CONHECIDOS E O QUE EU NÃO SEI

Registre isto em `docs/LIMITES.md` e atualize ao longo do trabalho:
- **Onde está o código-fonte do app no computador do dono:** não sei. Procure uma pasta com um `index.html` grande contendo "Nutri IA" e "Lancheiras". Se não achar, **baixe a versão em produção** (`https://app.lancheirasepapinhas.com.br/`, é o próprio código) e use como base, e avise o dono.
- **Código das funções do Supabase** (`nutri-ia` etc.): não sei onde está e **não faz parte do trabalho**.
- **Como funciona o cache do `sw.js`** e o envio de notificações (`enviar-aviso`): leia antes de mexer; não alterar a lógica de notificações.
- **Plano gratuito do Supabase:** 500 MB de banco, 1 GB de fotos, pausa após 7 dias sem uso e **sem backup automático**. Cuidado ao subir imagens novas grandes: o redesign não deve acrescentar fotos ao Supabase.
- **Fotos e ilustrações novas são do app/site**, não do banco. Use WebP/SVG leves.
- Eu li as telas **Hoje, Receitas, Nutri IA, Comunidade e Parceiros** de uma conta real (somente leitura). **Não vi** o painel admin, o fluxo de pagamento, o envio de foto na comunidade nem o Guia da mãe por dentro: leia o código antes de mexer nessas partes.

---

## 8. ETAPA 0: BACKUP E PREPARO (obrigatória, antes de qualquer mudança)

1. Confirme com `vercel whoami` e `gh auth status` os dois logins. Se faltar, **guie o dono** passo a passo (os dois do início deste prompt).
2. Localize o código do app (seção 7). Copie a pasta inteira para `_backup/app-2026-11-10/` (cópia congelada, **nunca editar**).
3. **App sem repositório:** `git init -b main`, `.gitignore` (inclua `.env*`, `node_modules`, `_backup/` se não quiser subir a cópia, capturas pesadas), primeiro commit "Estado antes do redesign", `git tag antes-do-redesign`, criar repositório **privado** `adailton-machado/lancheiras-app` e `git push -u origin main --tags`. Se o nome existir, use `lancheiras-app-redesign`.
4. **Site:** `git clone` de `adailton-machado/site-lancheirasepapinhas`, `git tag antes-do-redesign 24e6740334eb6623499464f8af097bcdead2be03` e `git push origin antes-do-redesign`. Crie a branch `redesign`.
5. **Verificação de segredos antes de cada commit:** crie `tools/checar-segredos.js` e o gancho `pre-commit` que recusam `service_role`, `sb_secret_`, `SUPABASE_SERVICE`, `-----BEGIN`, JWT cujo conteúdo decodificado tenha `"role":"service_role"` e atribuições de senha ou token com valor literal. Escreva um teste que cria um arquivo falso e confirma que o commit é barrado. (A chave anon pública do app **não** deve ser barrada.)
6. Copie `BACKUP-E-VOLTAR-ATRAS-LANCHEIRAS.md` para `docs/`. **Teste de verdade** o caminho de volta do app em preview: publique a versão atual em um preview e abra, para ter certeza de que o ponto de volta funciona.
7. Tire as capturas "antes" (seção 6) de todas as abas do app (modo sem conta) e de todas as seções do site, em 390 e 1280 px, em `docs/capturas/antes/`.
8. **Entregue ao dono:** onde está tudo guardado e a frase "Se algo ficar feio, é só me dizer: volte para a versão antiga" (você sabe como).

**Critério de pronto:** repositórios criados com tag `antes-do-redesign`, cópia congelada, teste de segredos passando, capturas "antes" salvas, preview da versão atual abrindo.

---

## 9. ETAPAS (cada uma termina em preview, commit, tag `etapa-N` e aprovação do dono)

| Etapa | O que fazer | Critério de pronto |
|---|---|---|
| **0. Backup e preparo** | Seção 8 | Itens da seção 8 |
| **1. Fundação visual** | Variáveis unificadas (seção 3), `--accent` ajustado, fontes com `font-display:swap`, sombras e raios, utilitários de movimento com `prefers-reduced-motion`, script de contraste. App **e** site | Telas idênticas em função; contraste dos pares principais ≥ 4,5:1; sem erro no console |
| **2. Ícones e mascote** | Ícones de interface em SVG, kit "adesivo 3D" de comida (12+ novos), mascote morango com 4 estados | Todos os emojis de interface trocados; kit em `assets/comida/`; pesos dentro do limite |
| **3. App: Hoje e navegação** | Nova ordem da tela Hoje (seção 5.1), cartão do dia ilustrado, rastreador com animação de mola, barra de baixo flutuante com bolha, transição entre abas | Teste de fumaça passa; 2 toques até a Nutri IA; 60 fps no celular de teste |
| **4. App: Receitas, Geladeira, Guia** | Cartões de receita com ícone 3D e selo de alergia, filtros de fase claros, detalhe da receita bonito, estados vazios, esqueletos | Busca e filtros funcionam; alertas de alergia com ícone e texto |
| **5. App: Nutri IA** | Avatar, balões, "digitando", onda de áudio ao gravar, cota visível, atalhos de perguntas | Texto e áudio funcionam como antes; modo guiado intacto |
| **6. App: Comunidade, Parceiros, Premium, perfil** | Estados vazios com mascote, cartões e salas redesenhados, tela Premium clara, troca de filho | Nenhuma função de moderação perdida; links do Asaas **iguais** aos de antes |
| **7. App: login, primeiro uso, computador, instalar** | Login com a cara da marca, primeiro uso em até 3 passos, moldura de celular a partir de 900 px, cartão de instalar discreto | Todos os caminhos de login funcionam (inclusive sem conta e recuperar senha) |
| **8. Site** | Topo com 3 camadas de parallax, Nutri IA com balões em cascata, cartões que inclinam, planos e FAQ polidos, tudo reaproveitando o kit 3D | Lighthouse (celular) com Desempenho ≥ 90 e Acessibilidade ≥ 95; botões levam ao app |
| **9. Revisão final e publicação** | Todos os testes, capturas "depois", comparativo antes/depois, medição de desempenho, revisão de contraste, teste em celular de verdade se possível; **só com aprovado final do dono:** app `vercel --prod` e site merge da `redesign` na `main`; tag `redesign-v1` | Dono aprova; produção funcionando; `BACKUP-E-VOLTAR-ATRAS-LANCHEIRAS.md` atualizado com os novos pontos de volta |

---

## 10. COMO O CLAUDE CODE CONVERSA COM O DONO

- Comece pela Etapa 0 e diga em 3 linhas o que vai fazer.
- Peça só os dois logins (Vercel e GitHub), um de cada vez, e **espere o "pronto"**.
- A cada etapa: "Mudei X, Y e Z. Veja aqui: [link do preview]. Olhe principalmente [tela]. Responda **aprovado** ou me diga o que não gostou."
- Se o dono pedir "voltar", reverta na hora (Vercel: promover a versão anterior; site: `git revert` ou reativar a implantação), confirme que voltou e só então pergunte o que mudar.
- **Nunca** diga "pronto" sem ter rodado os testes e olhado as capturas. Se algo falhou, diga o que falhou.
- No fim, entregue um resumo curto: o que ficou diferente, o que não mexi de propósito, o que ficou pendente e os novos pontos de volta.

---

## 11. CHECKLIST DE AUTOAVALIAÇÃO (rode antes de pedir o aprovado final)

1. As cores continuam as da marca (só o `--accent` do app ajustado por contraste)?
2. Alguma função do app foi removida ou mudou de lugar sem eu avisar?
3. Os links do Asaas, do Instagram, do WhatsApp e as regras do Premium estão **idênticos**?
4. Algum segredo apareceu em arquivo, commit ou log?
5. Existe foto de rosto de criança, depoimento inventado ou alegação de saúde nova?
6. `prefers-reduced-motion` desliga todo parallax, inclinação e confete?
7. Os limites de peso e de desempenho (seção 4) foram medidos e anotados?
8. O caminho de volta (app e site) foi **testado** e está no arquivo de backup?
9. Alguma coisa da produção foi publicada sem o "aprovado" do dono?
10. As capturas "antes" e "depois" estão lado a lado em `docs/capturas/`?
