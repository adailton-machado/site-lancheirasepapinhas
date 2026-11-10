#!/usr/bin/env node
// Verificação de segredos antes de cada commit (Lancheiras & Papinhas).
// Recusa: service_role, sb_secret_, SUPABASE_SERVICE, chaves privadas (-----BEGIN),
// JWT com "role":"service_role" e senha/token escritos com valor literal.
// A chave pública (anon) do Supabase é permitida.
// Uso: node tools/checar-segredos.js            -> confere os arquivos preparados (git add)
//      node tools/checar-segredos.js arq1 arq2  -> confere os arquivos indicados
'use strict';
const fs = require('fs');
const { execSync } = require('child_process');

const REGRAS = [
  { nome: 'service_role', re: /service_role/ },
  { nome: 'chave secreta do Supabase (sb_secret_)', re: /sb_secret_/ },
  { nome: 'SUPABASE_SERVICE', re: /SUPABASE_SERVICE/ },
  { nome: 'chave privada (-----BEGIN)', re: /-----BEGIN [A-Z ]*(PRIVATE KEY|CERTIFICATE|OPENSSH)/ },
  { nome: 'senha/token com valor literal', re: /\b(password|passwd|senha|secret|api[_-]?key|access[_-]?token|auth[_-]?token|token)\b["']?\s*[:=]\s*["'](?!(?:new|current)-password["'])[^"'\s]{12,}["']/i },
  { nome: 'token do GitHub', re: /\b(ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}/ },
  { nome: 'token da Vercel', re: /\bvercel_[A-Za-z0-9]{20,}|\bVERCEL_TOKEN\s*=\s*\S+/ },
];
const JWT = /eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g;
const IGNORAR = [/^_backup\//, /^node_modules\//, /\.(png|jpe?g|webp|gif|ico|woff2?)$/i, /^tools\/checar-segredos\.js$/, /^testes\/checar-segredos\.test\.js$/, /^docs\/PROMPT-LANCHEIRAS-REDESIGN\.md$/];

function decodeJwt(t) {
  try { return JSON.parse(Buffer.from(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')); } catch (e) { return null; }
}

function checar(nome, texto) {
  const achados = [];
  const linhas = texto.split('\n');
  linhas.forEach((l, i) => {
    for (const r of REGRAS) if (r.re.test(l)) achados.push(`${nome}:${i + 1}: ${r.nome}`);
    for (const m of l.match(JWT) || []) {
      const p = decodeJwt(m);
      if (p && p.role && p.role !== 'anon') achados.push(`${nome}:${i + 1}: JWT com role "${p.role}"`);
    }
  });
  return achados;
}

function arquivos() {
  const a = process.argv.slice(2);
  if (a.length) return a;
  return execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' }).split('\n').filter(Boolean);
}

function conteudo(f, preparado) {
  if (preparado) { try { return execSync(`git show ":${f}"`, { encoding: 'utf8', maxBuffer: 64 << 20 }); } catch (e) { return ''; } }
  return fs.readFileSync(f, 'utf8');
}

if (require.main === module) {
  const preparado = process.argv.length <= 2;
  let tudo = [];
  for (const f of arquivos()) {
    if (IGNORAR.some(r => r.test(f))) continue;
    tudo = tudo.concat(checar(f, conteudo(f, preparado)));
  }
  if (tudo.length) {
    console.error('COMMIT BARRADO: possível segredo encontrado:\n  ' + tudo.join('\n  '));
    process.exit(1);
  }
  console.log('checar-segredos: ok');
}
module.exports = { checar };
