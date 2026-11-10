# Limites conhecidos e o que não sabemos (atualizar ao longo do redesign)

Atualizado em 10/11/2026 (Etapa 0).

## Código
- **Código do app:** não havia repositório. A base do redesign é a versão no ar (`dpl_Cfh9brkWTctgzxz4EkydQJjDdKTU`), baixada de `https://app.lancheirasepapinhas.com.br/`. Conferida arquivo a arquivo pela assinatura SHA-1 da Vercel: **idêntica**. Cópia congelada em `_backup/app-2026-11-10/`.
- A versão no ar foi publicada "pré-montada" (`.vercel/output`) com 3 regras de endereço (URLs limpas). O `vercel.json` deste repositório (`cleanUrls` + `trailingSlash:false`) reproduz as mesmas regras.
- **Funções do Supabase** (`nutri-ia`, `gerar-receita`, `enviar-aviso`): fora do escopo, não lidas.
- **Service worker** (`sw.js`): cache `lp-v22`, estratégia "cache primeiro, atualiza em segundo plano". Quem já instalou só verá o visual novo se a versão do cache subir (`lp-v23`…). Notificações (`push`/`notificationclick`): não alterar.

## Ambiente de trabalho (sessão na nuvem do Claude Code)
- **Tags do git não podem ser enviadas** ao GitHub por esta sessão (o proxy recusa). Pontos de volta no GitHub viram **branches** `backup/<nome>` (mesmo efeito). As tags existem no repositório local.
- **Criar repositório novo no GitHub** precisa de autorização do dono (ver Etapa 0).
- Publicação na Vercel feita pela integração Vercel (sem `vercel login`). Previews não são produção.
- Links de preview exigem login na Vercel (o dono está logado no navegador).

## Supabase (plano gratuito)
- 500 MB de banco, 1 GB de fotos, pausa após 7 dias sem uso, **sem backup automático**.
- O redesign não sobe imagens ao Supabase. Testes automáticos bloqueiam toda escrita no Supabase (só leitura).

## Não vistos por dentro
- Painel admin, fluxo de pagamento (Asaas), envio de foto na comunidade, Guia da mãe: ler o código antes de mexer.
