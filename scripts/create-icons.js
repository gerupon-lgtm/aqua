// アプリのアイコン（PNG）を作る。前作 prism の scripts/create-icons.cjs と同じ形：地の色の上にロゴの文字だけを置く（2026-11-03 発案者）。
// 色はアプリの中のロゴ（style.css の .logo）に合わせ、明るい地に「AQUA」を深い青、「NOTES」を水色で描く。
// 文字は同梱の Montserrat を使い、通信しない。描画には端末の Chrome を使う（前作の Playwright の代わり。追加のライブラリなし）
// 使い方：node scripts/create-icons.js [Chrome の場所]
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chromePath = process.argv[2] ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const font = weight => readFileSync(join(root, 'public/fonts', `montserrat-${weight}.ttf`)).toString('base64');
const BG = '#eef5fb', AQUA = '#1d4f88', NOTES = '#4b9ad8';

// 寸法の比は前作と同じ（文字の大きさ＝一辺の0.16倍）
const page = size => {
  const base = size * .16;
  return `<!doctype html><style>@font-face{font-family:Montserrat;src:url(data:font/ttf;base64,${font(600)});font-weight:600}@font-face{font-family:Montserrat;src:url(data:font/ttf;base64,${font(500)});font-weight:500}html,body{margin:0}body{background:${BG};display:grid;place-items:center;width:${size}px;height:${size}px}.logo{display:flex;flex-direction:column;align-items:center}.aqua{font:600 ${base}px Montserrat;color:${AQUA};letter-spacing:${base / 12}px;margin-right:${-base / 12}px}.notes{font:500 ${base * .375}px Montserrat;color:${NOTES};letter-spacing:${base * .2291666667}px;margin-right:${-base * .2291666667}px;margin-top:${base / 12}px}</style><div class="logo"><div class="aqua">AQUA</div><div class="notes">NOTES</div></div>`;
};

const profile = mkdtempSync(join(tmpdir(), 'aqua-icons-'));
const port = 9300 + Math.floor(Math.random() * 400);
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank']);
const sleep = ms => new Promise(r => setTimeout(r, ms));
try {
  let tabs = null;
  for (let i = 0; i < 50 && !tabs; i++) { await sleep(200); tabs = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json()).catch(() => null); }
  if (!tabs) throw new Error('Chrome に接続できませんでした。');
  const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((ok, ng) => { ws.onopen = ok; ws.onerror = ng; });
  let id = 0; const waiting = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); waiting.get(m.id)?.(m); waiting.delete(m.id); };
  const send = (method, params = {}) => new Promise((ok, ng) => { const n = ++id; waiting.set(n, m => (m.error ? ng(new Error(m.error.message)) : ok(m.result))); ws.send(JSON.stringify({ id: n, method, params })); });
  for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: size, height: size, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `data:text/html;base64,${Buffer.from(page(size)).toString('base64')}` });
    await sleep(300);
    await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => document.fonts.size)', awaitPromise: true });
    const { data } = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: size, height: size, scale: 1 } });
    writeFileSync(join(root, 'public', name), Buffer.from(data, 'base64'));
    console.log(`public/${name}（${size}×${size}）`);
  }
  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
}
