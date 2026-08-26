import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w, h] of [[1440,900],[1280,800],[1024,768],[768,1024],[390,844],[360,740]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('favicon') && !r.url().includes('fonts.g')) errs.push(r.status()+' '+r.url()); });
  await p.goto('http://localhost:4190/index.html', { waitUntil: 'load' });
  await p.waitForTimeout(3500);
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  let peor = 0, quien = [];
  for (const f of [0,0.15,0.3,0.45,0.6,0.8,1]) {
    await p.evaluate((y) => window.scrollTo(0, y), Math.round((total-h)*f));
    await p.waitForTimeout(700);
    const r = await p.evaluate(() => {
      const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth, d = [];
      if (sw > cw) for (const el of document.querySelectorAll('*')) {
        const b = el.getBoundingClientRect();
        if (b.right > cw+1 && b.width > 0) d.push(el.className || el.tagName);
      }
      return { e: sw-cw, d: d.slice(0,4) };
    });
    if (r.e > peor) { peor = r.e; quien = r.d; }
  }
  const fin = await p.evaluate(() => ({
    filas: document.querySelectorAll('.scheda-tabla tbody tr').length,
    cotas: document.querySelectorAll('.q-texto').length,
    lienzo: (() => { const c = document.querySelector('.mont-lienzo canvas'); return c ? c.width+'x'+c.height : 'NO'; })(),
  }));
  console.log(w+'x'+h, 'desborde:'+peor, JSON.stringify(quien), JSON.stringify(fin), errs.length ? 'FALLOS '+errs.join(' | ') : 'ok');
  await p.close();
}
await b.close();
