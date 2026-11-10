# Lancheiras & Papinhas: backup e como voltar atrás (feito em 10/11/2026)

Guarde este arquivo. Se algo der errado depois do redesign, é só seguir o caso que se aplica. Cada caso leva poucos minutos.

## O que foi guardado

| Parte | Onde está o ponto de volta |
|---|---|
| **Dados do app** (21 tabelas, 469 linhas: contas, filhos, conversas, comunidade, parceiros, assinaturas) | Cópia dentro do próprio Supabase, no esquema `backup_20261110`, projeto `xuobyewpicaziculoife`. Conferido: as 21 tabelas têm exatamente a mesma contagem de linhas do original. Também guarda as regras de acesso, as funções e os gatilhos (`_politicas`, `_funcoes`, `_gatilhos`). O acesso pela internet (anon) está bloqueado nessa cópia. |
| **App** (`app.lancheirasepapinhas.com.br`) | Projeto Vercel `lancheiras-app-v6`. Versão no ar até agora: `dpl_Cfh9brkWTctgzxz4EkydQJjDdKTU` (publicada em 04/11/2026 17:07). A anterior, também guardada: `dpl_pvUUGMAedLNoTVDgxzNkgZ8v2zSd` (03/11/2026 17:19). |
| **Site** (`lancheirasepapinhas.com.br`) | Projeto Vercel `site-lancheirasepapinhas`, repositório privado `adailton-machado/site-lancheirasepapinhas`. Versão no ar até agora: commit `24e6740334eb6623499464f8af097bcdead2be03` (04/11/2026 22:02, implantação `dpl_CC7gDbMvPia5t1ox5cMBgwcz488b`). |

## Caso 1: o app ou o site ficou feio ou quebrou (o mais comum, 2 minutos)

A Vercel guarda todas as versões antigas. Voltar é só reativar a antiga.

1. Entre em vercel.com (conta `voryya-ia`) e abra o projeto: `lancheiras-app-v6` para o app, `site-lancheirasepapinhas` para o site.
2. Clique em **Deployments**.
3. Ache a versão da tabela acima, clique nos três pontinhos dela e escolha **Instant Rollback** (ou **Promote to Production**).
4. Confirme. Em cerca de 1 minuto o endereço volta ao visual de antes. Os dados dos usuários não mudam, porque o banco é separado.

Se preferir, peça ao Claude: "volte o app para a versão `dpl_Cfh9brkWTctgzxz4EkydQJjDdKTU`".

## Caso 2: sumiram ou ficaram errados dados no banco

Isso só acontece se alguém mexer no banco. O redesign visual não deveria tocar nele. Abra o Supabase do projeto, **SQL Editor**, e use um dos dois modos. Troque `NOME_DA_TABELA` pelo nome real (por exemplo `children`).

**Modo A: recuperar só o que sumiu** (não mexe no que está lá, só devolve linhas apagadas):

```sql
insert into public.NOME_DA_TABELA overriding system value
select * from backup_20261110.NOME_DA_TABELA
except
select * from public.NOME_DA_TABELA
on conflict do nothing;
```

**Modo B: voltar a tabela exatamente como estava no backup** (apaga o que foi criado depois; as mensagens, as contas novas e as assinaturas que entraram depois do backup desta tabela se perdem):

```sql
begin;
delete from public.NOME_DA_TABELA;
insert into public.NOME_DA_TABELA overriding system value
select * from backup_20261110.NOME_DA_TABELA;
commit;
```

Se a tabela tiver outras tabelas ligadas a ela (por exemplo `children` com `chat_messages`), o Supabase vai recusar o `delete` com uma mensagem de "foreign key". Nesse caso restaure as duas na ordem certa dentro do mesmo `begin ... commit`: apague primeiro as tabelas filhas, depois a mãe, e insira primeiro a mãe, depois as filhas. Peça ao Claude para montar esse bloco.

Os dois modos foram testados num banco de ensaio com as mesmas características (colunas de identidade, `uuid`, listas, `jsonb`) e funcionaram.

## Caso 3: perdi o projeto inteiro no Supabase (raro)

A cópia `backup_20261110` fica dentro do mesmo projeto, então ela **não protege** contra apagar o projeto ou contra a pausa por inatividade do plano gratuito. Para isso, peça ao Claude Code do seu computador: "baixe um backup completo do Supabase `xuobyewpicaziculoife` em arquivo e guarde na pasta `backups`". Ele precisa da senha do banco, que você digita no seu computador (nunca no chat). Esse arquivo restaura em qualquer projeto novo.

## O que este backup NÃO cobre

- **Contas de login** (a tabela interna do Supabase `auth.users`, com e-mails e senhas). Ela não é copiada aqui. Os perfis (`profiles`) e tudo o que depende deles estão copiados.
- **Fotos da comunidade** (arquivos no armazenamento `community`). A cópia guarda só o caminho de cada foto, não o arquivo.
- **Arquivos do computador onde o app foi feito.** O app não tem repositório no GitHub. O ponto de volta dele é a versão guardada na Vercel; o redesign cria o repositório (veja o prompt, Etapa 0).
- O plano gratuito do Supabase não faz backup automático. Antes de abrir o app para muita gente, considere o plano Pro.

## Quando refazer o backup

Refaça antes de qualquer mudança que mexa no banco. Peça ao Claude: "refaça o backup do Supabase do Lancheiras com a data de hoje".

## Redesign publicado em 10/11/2026 (redesign-v1)

| Parte | Versão nova no ar | Para voltar ao visual antigo |
|---|---|---|
| **App** (`lancheiras-app-v6`) | `dpl_CjGi548TPiPF96tCNyzqQxGQX4C5` (commit `88ca911`, com "Entrar com Google") | `dpl_Cfh9brkWTctgzxz4EkydQJjDdKTU` (Caso 1) |
| **Site** (`site-lancheirasepapinhas`) | `dpl_2aeGY1rmkDnjkSiPshbSqbDnA9gi` (commit `1816a08`) | `dpl_CC7gDbMvPia5t1ox5cMBgwcz488b` (Caso 1) |

No GitHub, o estado publicado está na branch `backup/redesign-v1` de cada repositório, e o estado anterior em `backup/antes-do-redesign`.

**Entrar com Google:** ligado no Supabase (Authentication > Providers > Google). Para desligar, basta desativar o Google lá: o botão some sozinho do app, sem precisar publicar nada.
