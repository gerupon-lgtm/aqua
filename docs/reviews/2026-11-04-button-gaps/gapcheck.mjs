// ボタン同士が触れていないか（すき間 6px 以上）を、画面の幅ごとに測る。
// 対象：タイトル、面の一覧（全ページ）、プレイ画面、ポンプ・排水口の窓
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, statSync, mkdtempSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';
const [,, dist, out, url = 'http://127.0.0.1:8795/'] = process.argv;
const MIN_GAP = 6;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const f = join(dist, p === '/' ? 'index.html' : p);
  if (!existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': types[extname(f)] ?? 'application/octet-stream' }); res.end(readFileSync(f));
});
await new Promise(r => server.listen(8795, '127.0.0.1', r));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9365', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'aqg-'))}`, '--window-size=390,844', 'about:blank']);
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(1500);
const tabs = await (await fetch('http://127.0.0.1:9365/json')).json();
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => { ws.onopen = r; });
let id = 0; const pend = new Map(); const errors = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text); if (pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.value;
await send('Runtime.enable');
// 見えているボタンの組で、すき間が MIN_GAP 未満のもの（重なりは負の値）
const gaps = scope => ev(`(()=>{
  const root = document.querySelector(${JSON.stringify(scope)}) ?? document;
  const bs = [...root.querySelectorAll('button')].filter(b => b.offsetParent && getComputedStyle(b).visibility !== 'hidden').map(b => ({ t: (b.innerText || b.getAttribute('aria-label') || '').trim().replace(/\\s+/g,' ').slice(0, 16), r: b.getBoundingClientRect() }));
  const bad = [];
  for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
    const a = bs[i].r, b = bs[j].r;
    if (a.width === 0 || b.width === 0) continue;
    const dx = Math.max(b.left - a.right, a.left - b.right), dy = Math.max(b.top - a.bottom, a.top - b.bottom);
    const gap = Math.max(dx, dy);
    if (gap < ${MIN_GAP}) bad.push(bs[i].t + ' / ' + bs[j].t + ' : ' + gap.toFixed(1));
  }
  return bad;
})()`);
const report = [];
const click = async (x, y) => { for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 }); await sleep(200); };
const at = async sel => { const r = await ev(`(()=>{const e=${sel};if(!e)return null;e.scrollIntoView({block:'center'});const q=e.getBoundingClientRect();return [q.x+q.width/2,q.y+q.height/2]})()`); if (!r) return false; await click(...r); return true; };
for (const [w, h] of [[320, 640], [390, 844], [844, 390], [1280, 800]]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url }); await sleep(1800);
  await ev(`localStorage.setItem('aqua-tutorial-v1', JSON.stringify({done:{P0:true},skipped:true,parts:{gate:true,adjustable:true,height:true,siphon:true}})); location.reload()`); await sleep(1800);
  const size = `${w}×${h}`;
  report.push({ size, screen: 'タイトル', bad: await gaps('#title') });
  await at(`document.querySelector('[data-title="select"]')`); await sleep(700);
  for (let page = 0; page < 8; page++) {
    report.push({ size, screen: `面の一覧 ${await ev(`document.querySelector('#sheet .pager span')?.innerText`)}`, bad: await gaps('#sheet') });
    if (page === 0) writeFileSync(join(out, `gap-list-${w}.png`), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
    const next = await ev(`!document.querySelector('#sheet [data-list-page]:last-of-type')?.disabled`);
    if (!next) break;
    await at(`[...document.querySelectorAll('#sheet [data-list-page]')].at(-1)`); await sleep(300);
  }
  // 32面（ポンプ）と37面（排水口）を開いて、プレイ画面と窓を測る
  await at(`[...document.querySelectorAll('#sheet [data-pick]')].find(b=>b.querySelector('.no')?.innerText==='37')`); await sleep(2200);
  report.push({ size, screen: 'プレイ画面（37面）', bad: await gaps('#app') });
  if (await at(`document.querySelector('[data-drain]')`)) { await sleep(400); report.push({ size, screen: '排水口の窓', bad: await gaps('#toast') }); await at(`[...document.querySelectorAll('#toast button')].find(b=>b.innerText.trim()==='閉じる')`); await sleep(300); }
  for (let k = 0; k < 5; k++) { await at(`document.getElementById('stage-prev')`); await sleep(250); }
  await sleep(2000);
  for (const pid of ['SA', 'ABs']) { await at(`[...document.querySelectorAll('[data-pipe-label]')].find(e=>e.dataset.pipeLabel===${JSON.stringify(pid)})`); await sleep(300); }
  report.push({ size, screen: 'ポンプの窓（32面）', bad: await gaps('#toast') });
}
const bad = report.filter(r => r.bad.length);
writeFileSync(join(out, 'gap-report.json'), JSON.stringify({ minGap: MIN_GAP, report, errors }, null, 2));
console.log(`測った画面 ${report.length}、ボタンが近すぎる画面 ${bad.length}、エラー ${errors.length}`);
for (const r of bad) console.log(r.size, r.screen, JSON.stringify(r.bad));
chrome.kill(); server.close(); process.exit(0);
