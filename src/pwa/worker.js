// 通信なしで遊ぶための仕組み（F-022）。前作 prism の src/pwa/worker.js（0.82.0 の更新タイムアウト対策）に合わせる。
// 版の値・資材の一覧・資材ごとの照合値（SHA-256）はビルドで書き込む。
// - 準備：足りない資材だけを取る。前の版の保存に同じ中身（照合値が一致）があれば通信せずに使う。
//   通信は4件ずつ、1件60秒まで。取った中身も照合し、合わなければ準備失敗（前の版と保存データは残る）
// - 起動：この版の資材がそろっていれば、入口のページも保存した物を使う（遅い通信でも待たない）。
//   そろっていないときだけ通信し、つながらなければ前の版の保存、それもなければ案内のページを出す
// - 切り替え：画面の「新しい版を使う」で、資材がそろっているときだけ切り替える。
//   ほかのタブが前の版を使っていても困らないよう、直前の版の保存は1つ残す
const VERSION = '__AQUA_VERSION__';
const ASSETS = __AQUA_ASSETS__;
const HASHES = __AQUA_HASHES__;
const PREFIX = 'aqua-notes-';
const CACHE = PREFIX + VERSION;
const ASSET_FETCH_TIMEOUT_MS = 60000;
const ASSET_CONCURRENCY = 4;
const base = self.registration?.scope ?? self.location.href;
const cacheURL = path => new URL(path, base).href;

const hex = buffer => Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
const digest = async bytes => hex(await crypto.subtle.digest('SHA-256', bytes));
// 前の版の応答の URL を引き継ぐと、モジュールの相対参照が前の版へ戻るため、中身・形式・状態だけで作り直す
function responseFrom(bytes, response) {
  const headers = new Headers(response.headers);
  headers.delete('content-encoding');
  headers.delete('content-length');
  return new Response(bytes, { status: response.status, statusText: response.statusText, headers });
}

async function download(asset) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ASSET_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(new Request(cacheURL(asset), { cache: 'reload', signal: controller.signal }));
    if (!response.ok) throw new Error(`資材を取得できません：${asset}`);
    const bytes = await response.arrayBuffer();
    if (await digest(bytes) !== HASHES[asset]) throw new Error(`資材の中身が一致しません：${asset}`);
    return responseFrom(bytes, response);
  } finally { clearTimeout(timer); }
}

const versionOf = name => name.slice(PREFIX.length);
const newer = (a, b) => {
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
};
const otherCaches = async () => (await caches.keys())
  .filter(name => name.startsWith(PREFIX) && name !== CACHE && /^\d+\.\d+\.\d+$/.test(versionOf(name)))
  .sort((a, b) => (newer(versionOf(a), versionOf(b)) ? -1 : 1));

// 前の版の保存から、同じ中身の資材を探す（照合して合わなければ使わない）。
// 資材は版のフォルダ（./v版/…）に置くので、前の版の同じ場所を見る。フォルダの外の資材は同じ場所
async function reuse(asset) {
  const folder = `./v${VERSION}/`;
  for (const name of await otherCaches()) {
    try {
      const path = asset.startsWith(folder) ? `./v${versionOf(name)}/${asset.slice(folder.length)}` : asset;
      const hit = await (await caches.open(name)).match(cacheURL(path));
      if (!hit?.ok) continue;
      const bytes = await hit.arrayBuffer();
      if (await digest(bytes) === HASHES[asset]) return responseFrom(bytes, hit);
    } catch { /* 前の版の保存が壊れていても、通信で取り直す */ }
  }
  return null;
}

let preparation = null;
async function prepareMissing() {
  const cache = await caches.open(CACHE);
  const have = new Set((await cache.keys()).map(request => request.url));
  const missing = ASSETS.filter(asset => !have.has(cacheURL(asset)));
  let index = 0, failure = null;
  async function next() {
    while (!failure && index < missing.length) {
      const asset = missing[index++];
      try { await cache.put(cacheURL(asset), (await reuse(asset)) ?? await download(asset)); }
      catch (error) { failure = error; }
    }
  }
  // 始めた取得が終わるまで待ってから失敗を返す（途中の取得を置き去りにしない）
  await Promise.allSettled(Array.from({ length: Math.min(ASSET_CONCURRENCY, missing.length) }, next));
  if (failure) throw failure;
}
// 準備が重なっても1回にまとめる
function prepare() {
  if (!preparation) preparation = prepareMissing().finally(() => { preparation = null; });
  return preparation;
}

async function ready() {
  try {
    if (!await caches.has(CACHE)) return false;
    const have = new Set((await (await caches.open(CACHE)).keys()).map(request => request.url));
    return ASSETS.every(asset => have.has(cacheURL(asset)));
  } catch { return false; }
}

self.addEventListener('install', event => {
  event.waitUntil(prepare());
});

// 直前の版を1つだけ残し、それより古い保存を消す
self.addEventListener('activate', event => {
  event.waitUntil(
    otherCaches()
      .then(names => Promise.all(names.slice(1).map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'activate-update') {
    // 資材がそろっていない版には切り替えない
    event.waitUntil(ready().then(ok => (ok ? self.skipWaiting() : undefined)));
    return;
  }
  if (event.data?.type === 'AQUA_UPDATE_STATUS' && event.ports?.[0]) {
    const reply = event.ports[0];
    event.waitUntil(ready()
      .then(ok => reply.postMessage({ version: VERSION, ready: ok }))
      .catch(() => reply.postMessage({ version: VERSION, ready: false })));
  }
});

const unavailable = () => new Response(`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>アクア・ノーツ</title><body style="margin:0;padding:24px;background:#eef5fb;color:#1d3550;font:16px/1.7 sans-serif"><h1 style="font-size:22px;color:#1d4f88">アクア・ノーツ</h1><p>起動に必要な資材がそろっていません。通信できる状態で開き直してください。</p><p>この表示で、成績や記録は消えていません。</p><button onclick="location.reload()" style="font:inherit;padding:10px 18px">もう一度開く</button><p style="color:#5b6f86">v${VERSION}</p></body></html>`, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

// 公開先が index.html を / へ転送した応答は、ページの移動に使えないため転送の印を外す
const plain = response => (response.redirected ? responseFrom(response.body, response) : response);

async function fromOldCaches(request) {
  for (const name of await otherCaches()) {
    try { const hit = await (await caches.open(name)).match(request, { ignoreSearch: true }); if (hit) return hit; }
    catch { /* 次の保存を探す */ }
  }
  return null;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    if (request.mode === 'navigate') {
      if (await ready()) {
        const index = await (await caches.open(CACHE)).match(cacheURL('./index.html'));
        if (index) return plain(index);
      }
      try { return await fetch(request); }
      catch {
        const old = await fromOldCaches(cacheURL('./index.html'));
        return old ? plain(old) : unavailable();
      }
    }
    try {
      const hit = await (await caches.open(CACHE)).match(request, { ignoreSearch: true });
      if (hit) return hit;
    } catch { /* 保存場所が使えないときは通信へ */ }
    // 前の版の画面を開いたままのタブも、その版の保存で続けられる
    const old = await fromOldCaches(request);
    return old ?? fetch(request);
  })());
});
