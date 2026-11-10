// Capturas do site por seção. Uso: node testes/capturas-site.mjs <url> <pasta>
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import fs from 'fs';
const URL = process.argv[2] || 'https://lancheirasepapinhas.com.br/';
const OUT = process.argv[3] || 'docs/capturas/antes/site';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(); const erros = [];
for (const w of [390, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') erros.push(`[${w}] ${m.text()}`); });
  p.on('pageerror', e => erros.push(`[${w}] ${e.message}`));
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/${w}-pagina-inteira.png`, fullPage: true });
  const secs = await p.$$eval('section[id], header[id]', els => els.map(e => e.id));
  for (const id of secs) { const el = await p.$('#' + id); try { await el.screenshot({ path: `${OUT}/${w}-${id}.png` }); } catch (e) {} }
  const hscroll = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (hscroll) erros.push(`[${w}] rolagem horizontal`);
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${OUT}/erros-console.txt`, erros.join('\n') || 'nenhum');
console.log('ok', OUT, 'erros:', erros.length);
