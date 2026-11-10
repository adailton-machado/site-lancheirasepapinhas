// Teste: cria um repositório temporário, tenta commitar segredos falsos e confirma que o gancho barra.
// Também confirma que a chave anon pública NÃO é barrada. Rode: node testes/checar-segredos.test.js
'use strict';
const { execSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const jwt = role => `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ iss: 'supabase', ref: 'teste', role })}.assinaturafalsa123`;

const casos = [
  { nome: 'JWT service_role', txt: `const k = "${jwt('service' + '_role')}";`, barra: true },
  { nome: 'sb_secret_', txt: 'const k = "sb_' + 'secret_abc123def456";', barra: true },
  { nome: 'chave privada', txt: '-----' + 'BEGIN PRIVATE KEY-----\nabc', barra: true },
  { nome: 'senha literal', txt: 'const senha = "MinhaSenhaSuperSecreta123";', barra: true },
  { nome: 'chave anon (permitida)', txt: `const SUPABASE_ANON = "${jwt('anon')}";`, barra: false },
  { nome: 'texto normal', txt: '<input type="password" autocomplete="current-password">', barra: false },
];

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'segredos-'));
const sh = c => execSync(c, { cwd: dir, stdio: 'pipe', encoding: 'utf8' });
sh('git init -q -b main && git config user.email t@t && git config user.name t');
fs.mkdirSync(path.join(dir, 'tools')); fs.mkdirSync(path.join(dir, '.githooks'));
fs.copyFileSync(path.join(raiz, 'tools/checar-segredos.js'), path.join(dir, 'tools/checar-segredos.js'));
fs.copyFileSync(path.join(raiz, '.githooks/pre-commit'), path.join(dir, '.githooks/pre-commit'));
fs.chmodSync(path.join(dir, '.githooks/pre-commit'), 0o755);
sh('git config core.hooksPath .githooks');

let falhas = 0;
casos.forEach((c, i) => {
  const f = `arquivo${i}.js`;
  fs.writeFileSync(path.join(dir, f), c.txt);
  sh(`git add ${f}`);
  let barrado = false;
  try { sh(`git commit -q -m "teste ${i}"`); } catch (e) { barrado = true; sh(`git reset -q ${f}`); fs.unlinkSync(path.join(dir, f)); }
  const ok = barrado === c.barra;
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${c.nome}: ${barrado ? 'barrado' : 'aceito'}`);
});
fs.rmSync(dir, { recursive: true, force: true });
if (falhas) { console.error(`${falhas} caso(s) falharam`); process.exit(1); }
console.log('Todos os casos passaram.');
