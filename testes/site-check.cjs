// Teste do site (Etapa 8): sem rolagem lateral, botões para o app, inclinação, parallax e movimento reduzido.
// Uso: node testes/site-check.cjs [url]   (padrão http://localhost:8081/)
const BASE = process.argv[2] || 'http://localhost:8081/';
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); let f = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FALHA ') + m); if (!c) f++; };
  for (const w of [375, 390, 768, 1280]) {
    const p = await b.newPage({ viewport: { width: w, height: 850 } }); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    await p.goto(BASE, { waitUntil: 'networkidle' });
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), w + 'px sem rolagem lateral');
    const links = await p.$$eval('a[data-app]', as => as.every(a => a.href.startsWith('https://app.lancheirasepapinhas.com.br/')));
    ok(links, w + 'px todos os botões levam ao app');
    ok(errs.length === 0, w + 'px sem erro no console ' + errs.join('|'));
    if (w === 1280) {
      await p.locator('#planos .price-card').first().scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
      const card = p.locator('#planos .price-card').first(); const bb = await card.boundingBox();
      await p.mouse.move(bb.x + bb.width * .9, bb.y + bb.height * .1); await p.waitForTimeout(200);
      const t = await card.evaluate(e => e.style.transform);
      ok(/rotateY\(2\.\d+deg\)/.test(t) || /rotateY\(2\.[0-9]+deg\)/.test(t) || /rotateY\((\d\.\d+)deg\)/.test(t), 'cartão inclina com o mouse: ' + t);
      const m = t.match(/rotate[XY]\((-?[\d.]+)deg\)/g).map(x => Math.abs(parseFloat(x.replace(/[^\d.-]/g, ''))));
      ok(Math.max(...m) <= 6, 'inclinação no máximo 6 graus');
      await p.mouse.move(5, 5); await p.waitForTimeout(100);
      ok(await card.evaluate(e => e.style.transform === ''), 'cartão volta ao normal');
      await p.evaluate(() => scrollTo(0, 400)); await p.waitForTimeout(200);
      const sy = await p.$eval('[data-parallax]', e => e.style.getPropertyValue('--sy'));
      ok(sy === '400', 'parallax de rolagem ativo (--sy=' + sy + ')');
    }
    await p.close();
  }
  const r = await b.newPage({ viewport: { width: 1280, height: 850 }, reducedMotion: 'reduce' });
  await r.goto(BASE, { waitUntil: 'networkidle' });
  ok(!(await r.evaluate(() => document.documentElement.classList.contains('motion'))), 'movimento reduzido: sem animações');
  await r.evaluate(() => scrollTo(0, 400)); await r.waitForTimeout(200);
  ok(await r.$eval('[data-parallax]', e => e.style.getPropertyValue('--sy') === ''), 'movimento reduzido: sem parallax');
  const card = r.locator('#planos .price-card').first(); await card.scrollIntoViewIfNeeded(); const bb = await card.boundingBox();
  await r.mouse.move(bb.x + 20, bb.y + 20); await r.waitForTimeout(150);
  ok(await card.evaluate(e => e.style.transform === ''), 'movimento reduzido: cartão não inclina');
  ok(await r.$eval('#nutri-ia .scene .bubble', e => getComputedStyle(e).opacity === '1'), 'movimento reduzido: balões visíveis');
  await b.close(); console.log(f ? f + ' FALHA(S)' : 'TUDO OK');
})();
