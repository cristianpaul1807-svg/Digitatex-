import { chromium } from 'playwright';
const [w, h, pref, ...fracs] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:4190/index.html', { waitUntil: 'load' });
await p.waitForTimeout(4000);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (const f of fracs.map(Number)) {
  await p.evaluate((y) => window.scrollTo(0, y), Math.round((total - +h) * f));
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `/tmp/q/${pref}${i++}.png` });
}
console.log('alto', total, errs.length ? 'PROBLEMAS ' + errs.join(' | ') : 'sin errores');
await b.close();
