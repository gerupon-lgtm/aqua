// T-09 の実ブラウザ確認：準備・通信なし起動・遅い入口・遅い資材を含む更新・成績の保持
import http from 'node:http';
import { spawn } from 'node:child_process';
import { cpSync, rmSync, readFileSync, writeFileSync, statSync, renameSync, mkdtempSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
const [,, dist, work, A = '0.17.5', B = '0.17.6', distB = null] = process.argv;
const relA = join(work, 'relA'), relB = join(work, 'relB');
for (const d of [relA, relB]) rmSync(d, { recursive: true, force: true });
cpSync(dist, relA, { recursive: true });
if (distB) cpSync(distB, relB, { recursive: true }); else {
// 合成の次版：版の文字を置き換え、app.js と入口だけ中身が変わる（画像・書体は同じ中身）
cpSync(dist, relB, { recursive: true });
renameSync(join(relB, `v${A}`), join(relB, `v${B}`));
const sub = f => writeFileSync(f, readFileSync(f, 'utf8').replaceAll(A, B));
for (const f of ['index.html', 'build-info.json', `v${B}/src/ui/app.js`]) sub(join(relB, f));
const info = JSON.parse(readFileSync(join(relB, 'build-info.json'), 'utf8'));
for (const a of info.assets) info.hashes[a] = createHash('sha256').update(readFileSync(join(relB, a))).digest('hex');
writeFileSync(join(relB, 'build-info.json'), JSON.stringify(info));
let sw = readFileSync(join(relB, 'sw.js'), 'utf8').replaceAll(A, B);
sw = sw.replace(/const HASHES = \{.*?\};/s, `const HASHES = ${JSON.stringify(info.hashes)};`);
writeFileSync(join(relB, 'sw.js'), sw);
}

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.webmanifest': 'application/manifest+json' };
const srv = { root: relA, offline: false, delay: {}, log: [] };
const sockets = new Set();
const server = http.createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  srv.log.push(path);
  if (srv.offline) { req.socket.destroy(); return; }
  const d = Object.entries(srv.delay).find(([p]) => (p === '/' ? path === '/' : path.endsWith(p)));
  if (d) await new Promise(r => setTimeout(r, d[1]));
  const file = join(srv.root, path === '/' ? 'index.html' : path);
  if (!existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(readFileSync(file));
});
server.on('connection', s => { sockets.add(s); s.on('close', () => sockets.delete(s)); });
await new Promise(r => server.listen(8791, '127.0.0.1', r));
const URL0 = 'http://127.0.0.1:8791/';

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9351', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'aq9-'))}`, '--window-size=390,844', 'about:blank']);
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(1500);
const tabs = await (await fetch('http://127.0.0.1:9351/json')).json();
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => { ws.onopen = r; });
let id = 0; const pend = new Map(); const errors = [];
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
  if (pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
};
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.value;
await send('Runtime.enable');
await send('Network.enable');
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(ok ? 'OK ' : 'NG ', name, detail); };
const waitFor = async (expr, ms = 20000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await ev(expr)) return Date.now() - t; await sleep(200); } return -1; };
const version = () => ev(`document.body.innerText.match(/v\\d+\\.\\d+\\.\\d+/)?.[0]`);
const swStatus = () => ev(`new Promise(r=>{const c=new MessageChannel();c.port1.onmessage=e=>r(e.data);const w=navigator.serviceWorker.controller;if(!w)return r(null);w.postMessage({type:'AQUA_UPDATE_STATUS'},[c.port2]);setTimeout(()=>r('timeout'),3000)})`);
const nav = () => send('Page.navigate', { url: URL0 });
const offline = async on => {
  srv.offline = on; if (on) for (const s of sockets) s.destroy();
  await send('Network.emulateNetworkConditions', { offline: on, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
};
const opened = () => waitFor(`document.readyState==='complete' && !!document.querySelector('[data-title]')`, 15000);

// 1. 初回：準備が終わり、worker が画面を受け持つ
await nav();
const ctl = await waitFor(`!!navigator.serviceWorker.controller`, 30000);
const st1 = await swStatus();
check('初回の準備が終わり、全資材がそろう', ctl >= 0 && st1?.ready === true && st1?.version === A, JSON.stringify(st1));
await ev(`localStorage.setItem('aqua-test-keep','kept')`);
const keepBefore = JSON.parse(await ev(`JSON.stringify(Object.fromEntries(Object.entries(localStorage)))`));

// 2. 入口が遅い（10秒）通信でも、保存した入口ですぐ開く
srv.delay = { '/': 10000, '/index.html': 10000 };
let t = Date.now(); await nav(); const slowOpen = await opened();
check('入口の通信が10秒遅くても、待たずに開く', slowOpen >= 0 && Date.now() - t < 5000, `${Date.now() - t}ms`);
srv.delay = {};

// 3. 通信なしで開き直し、1面で水を流して結果まで進む
await offline(true);
await ev(`localStorage.setItem('aqua-tutorial-v1', JSON.stringify({done:{},skipped:true,parts:{}}))`);
await nav(); await opened();
check('通信なしで起動できる', await version() === `v${A}`, await version());
const click = async (x, y) => { for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 }); await sleep(250); };
const btn = async text => { const r = await ev(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.innerText.trim()===${JSON.stringify(text)}&&b.offsetParent);if(!b)return null;const q=b.getBoundingClientRect();return [q.x+q.width/2,q.y+q.height/2]})()`); if (!r) return false; await click(...r); return true; };
await btn('選択プレイ'); await sleep(2500);
const pipe = await ev(`[...document.querySelectorAll('[data-pipe-label]')].filter(e=>!e.dataset.pipeLabel.startsWith('outlet')&&/太/.test(e.textContent)).map(e=>{const q=e.getBoundingClientRect();return [q.x+q.width/2,q.y+q.height/2]})[0]`);
if (pipe) await click(...pipe);
await btn('水を流す');
const resultMs = await waitFor(`[...document.querySelectorAll('button')].some(b=>b.offsetParent&&/解説/.test(b.innerText))`, 15000);
check('通信なしで1面を流し、結果まで進む', resultMs >= 0, `${resultMs}ms`);
writeFileSync(join(work, 'offline-result.png'), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
await offline(false);

// 4. 次版を公開。app.js の取得を6.5秒遅らせても、更新の準備が終わる。同じ中身の画像・書体は取り直さない
srv.root = relB; srv.delay = { '/src/ui/app.js': 6500 }; srv.log = [];
await nav(); await opened();
check('更新の準備中も、保存した前の版で開く', await version() === `v${A}`, await version());
await ev(`navigator.serviceWorker.getRegistration().then(r=>r.update())`);
const readyMs = await waitFor(`!document.getElementById('update-notice').hidden`, 90000);
check('遅い資材があっても更新の案内が出る', readyMs >= 0, `${readyMs}ms`);
const refetched = srv.log.filter(p => p.startsWith(`/v${B}/`));
const media = refetched.filter(p => /\.(png|webp|ttf|svg)$/.test(p));
check('同じ中身の画像・書体は取り直さない', media.length === 0, `版のフォルダから取得 ${refetched.length}件（画像・書体 ${media.length}件）：${refetched.join(' ')}`);
srv.delay = {};

// 5. 更新すると次版になり、記録が残る
await ev(`document.getElementById('update-apply').click()`);
const applied = await waitFor(`/v${B.replaceAll('.', '\\.')}/.test(document.body.innerText)`, 20000);
check('更新すると次版で開き直す', applied >= 0, await version());
const keepAfter = JSON.parse(await ev(`JSON.stringify(Object.fromEntries(Object.entries(localStorage)))`));
check('更新後も端末の記録が残る', keepAfter['aqua-test-keep'] === 'kept' && Object.keys(keepBefore).every(k => k in keepAfter), Object.keys(keepAfter).join(','));
const names = (await ev(`caches.keys()`)).sort();
check('保存は新しい版と直前の版の2つ', JSON.stringify(names) === JSON.stringify([`aqua-notes-${A}`, `aqua-notes-${B}`]), JSON.stringify(names));

// 6. 次版でも通信なしで起動
await offline(true);
await nav(); await opened();
check('更新後も通信なしで起動できる', await version() === `v${B}`, await version());
check('画面のエラーなし', errors.length === 0, JSON.stringify(errors));
writeFileSync(join(work, 'report.json'), JSON.stringify({ date: new Date().toISOString(), from: A, to: B, results, errors }, null, 2));
chrome.kill(); server.close(); process.exit(results.every(r => r.ok) ? 0 : 1);
