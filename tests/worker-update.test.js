// 通信なしの仕組み（F-022、T-09）。前作 prism 0.82.0 の更新タイムアウト対策に合わせた worker を、
// 保存場所と通信を模した環境で動かして確かめる
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash, webcrypto } from 'node:crypto';
import vm from 'node:vm';

const ORIGIN = 'https://aqua.example/';
const sha = text => createHash('sha256').update(text).digest('hex');
const source = readFileSync(new URL('../src/pwa/worker.js', import.meta.url), 'utf8');

// 版 version の資材一覧と中身。app.js の中身だけを版ごとに変え、画像は同じ中身にする
function release(version, { app = `app ${version}` } = {}) {
  const body = { './index.html': `<script src="./v${version}/app.js">`, [`./v${version}/app.js`]: app, [`./v${version}/art.png`]: 'same picture' };
  const assets = Object.keys(body);
  return { version, body, assets, hashes: Object.fromEntries(assets.map(a => [a, sha(body[a])])) };
}

// 保存場所（caches）の模型。stored は {キャッシュ名: Map(URL → 中身)}
function makeCaches(stored = {}, { broken = false } = {}) {
  const store = new Map(Object.entries(stored).map(([name, entries]) => [name, new Map(Object.entries(entries))]));
  const toURL = r => (typeof r === 'string' ? r : r.url);
  const cacheOf = map => ({
    async match(r) { const v = map.get(toURL(r).split('?')[0]); return v === undefined ? undefined : new Response(v, { status: 200 }); },
    async put(r, res) { map.set(toURL(r), await res.text()); },
    async keys() { return [...map.keys()].map(url => ({ url })); }
  });
  return {
    store,
    async open(name) { if (broken) throw Error('storage unavailable'); if (!store.has(name)) store.set(name, new Map()); return cacheOf(store.get(name)); },
    async has(name) { if (broken) throw Error('storage unavailable'); return store.has(name); },
    async keys() { return [...store.keys()]; },
    async delete(name) { return store.delete(name); }
  };
}

// worker を動かす。network は {URL: 中身|'hang'|'fail'}。取得した URL を fetched に記録する
function boot(rel, { caches = makeCaches(), network = {}, fastTimers = false } = {}) {
  const handlers = new Map(), fetched = [];
  let skipped = false;
  const fetch = async (request, init) => {
    const url = typeof request === 'string' ? request : request.url;
    const signal = request.signal ?? init?.signal;
    fetched.push(url);
    const v = network[url.split('?')[0]];
    if (v === undefined || v === 'fail') throw new TypeError('network error');
    if (v === 'hang') return new Promise((_, reject) => signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
    return new Response(v, { status: 200 });
  };
  const code = source.replace('__AQUA_VERSION__', rel.version).replace('__AQUA_ASSETS__', JSON.stringify(rel.assets)).replace('__AQUA_HASHES__', JSON.stringify(rel.hashes));
  vm.runInNewContext(code, {
    self: { addEventListener: (type, fn) => handlers.set(type, fn), registration: { scope: ORIGIN }, location: { href: `${ORIGIN}sw.js`, origin: new URL(ORIGIN).origin }, skipWaiting: async () => { skipped = true; }, clients: { claim: async () => {} } },
    caches, fetch, crypto: webcrypto, Request, Response, Headers, AbortController, DOMException, URL, TypeError, Promise, Uint8Array, Array, Set, Map, Number, Error, JSON,
    setTimeout: fastTimers ? (fn => setTimeout(fn, 5)) : setTimeout, clearTimeout
  });
  const fire = async (type, event = {}) => {
    let pending, response;
    handlers.get(type)({ ...event, waitUntil: p => { pending = p; }, respondWith: p => { response = p; } });
    if (pending) await pending;
    return response ? await response : undefined;
  };
  const status = async () => { let reply; await fire('message', { data: { type: 'AQUA_UPDATE_STATUS' }, ports: [{ postMessage: v => { reply = JSON.parse(JSON.stringify(v)); } }] }); return reply; };
  return { fire, status, fetched, caches, skipped: () => skipped };
}
const online = rel => Object.fromEntries(rel.assets.map(a => [new URL(a, ORIGIN).href, rel.body[a]]));
const full = rel => Object.fromEntries(rel.assets.map(a => [new URL(a, ORIGIN).href, rel.body[a]]));

test('準備で全資材を保存し、自分の版と準備済みを返す', async () => {
  const rel = release('0.2.0');
  const w = boot(rel, { network: online(rel) });
  await w.fire('install');
  assert.deepEqual(await w.status(), { version: '0.2.0', ready: true });
});

test('資材の不足・保存場所のエラーでは準備済みと答えない', async () => {
  const rel = release('0.2.0');
  const partial = full(rel); delete partial[`${ORIGIN}v0.2.0/app.js`];
  assert.deepEqual(await boot(rel, { caches: makeCaches({ 'aqua-notes-0.2.0': partial }) }).status(), { version: '0.2.0', ready: false });
  assert.deepEqual(await boot(rel, { caches: makeCaches({}, { broken: true }) }).status(), { version: '0.2.0', ready: false });
});

test('取得した中身が照合値と合わなければ準備に失敗し、準備済みにしない', async () => {
  const rel = release('0.2.0');
  const net = online(rel); net[`${ORIGIN}v0.2.0/app.js`] = 'tampered';
  const w = boot(rel, { network: net });
  await assert.rejects(w.fire('install'));
  assert.equal((await w.status()).ready, false);
});

test('通信が返らない資材は時間切れで準備に失敗し、保存済みの前の版は残る', async () => {
  const old = release('0.1.0'), rel = release('0.2.0');
  const caches = makeCaches({ 'aqua-notes-0.1.0': full(old) });
  const net = online(rel); net[`${ORIGIN}v0.2.0/app.js`] = 'hang';
  const w = boot(rel, { caches, network: net, fastTimers: true });
  await assert.rejects(w.fire('install'));
  assert.equal((await w.status()).ready, false);
  assert.equal(caches.store.get('aqua-notes-0.1.0').size, old.assets.length);
});

test('前の版と同じ中身の資材は通信せずに使い回し、変わった資材だけを取る', async () => {
  const old = release('0.1.0'), rel = release('0.2.0');
  const w = boot(rel, { caches: makeCaches({ 'aqua-notes-0.1.0': full(old) }), network: online(rel) });
  await w.fire('install');
  assert.equal((await w.status()).ready, true);
  assert.ok(!w.fetched.includes(`${ORIGIN}v0.2.0/art.png`), '同じ画像は取り直さない');
  assert.ok(w.fetched.includes(`${ORIGIN}v0.2.0/app.js`));
});

test('前の版の保存が壊れた中身なら使い回さず、通信で取り直す', async () => {
  const old = release('0.1.0'), rel = release('0.2.0');
  const broken = full(old); broken[`${ORIGIN}v0.1.0/art.png`] = 'corrupted';
  const w = boot(rel, { caches: makeCaches({ 'aqua-notes-0.1.0': broken }), network: online(rel) });
  await w.fire('install');
  assert.ok(w.fetched.includes(`${ORIGIN}v0.2.0/art.png`));
  assert.equal((await w.status()).ready, true);
});

test('準備済みなら、入口のページは通信を待たずに保存した物を返す', async () => {
  const rel = release('0.2.0');
  const w = boot(rel, { caches: makeCaches({ 'aqua-notes-0.2.0': full(rel) }), network: { [ORIGIN]: 'hang' } });
  const res = await w.fire('fetch', { request: { method: 'GET', mode: 'navigate', url: ORIGIN } });
  assert.equal(await res.text(), rel.body['./index.html']);
  assert.ok(!w.fetched.length);
});

test('準備ができておらず通信もできないとき、前の版の保存か案内のページを返す', async () => {
  const old = release('0.1.0'), rel = release('0.2.0');
  const withOld = boot(rel, { caches: makeCaches({ 'aqua-notes-0.1.0': full(old) }) });
  const a = await withOld.fire('fetch', { request: { method: 'GET', mode: 'navigate', url: ORIGIN } });
  assert.equal(await a.text(), old.body['./index.html']);
  const none = boot(rel);
  const b = await none.fire('fetch', { request: { method: 'GET', mode: 'navigate', url: ORIGIN } });
  assert.equal(b.status, 503);
  assert.match(await b.text(), /成績や記録は消えていません/);
});

test('前の版の画面を開いたままでも、その版の資材を保存から返す', async () => {
  const old = release('0.1.0'), rel = release('0.2.0');
  const w = boot(rel, { caches: makeCaches({ 'aqua-notes-0.1.0': full(old), 'aqua-notes-0.2.0': full(rel) }) });
  const res = await w.fire('fetch', { request: { method: 'GET', mode: 'no-cors', url: `${ORIGIN}v0.1.0/app.js` } });
  assert.equal(await res.text(), 'app 0.1.0');
});

test('資材がそろっていない版には切り替えない。そろっていれば切り替える', async () => {
  const rel = release('0.2.0');
  const notReady = boot(rel);
  await notReady.fire('message', { data: 'activate-update' });
  assert.equal(notReady.skipped(), false);
  const isReady = boot(rel, { caches: makeCaches({ 'aqua-notes-0.2.0': full(rel) }) });
  await isReady.fire('message', { data: 'activate-update' });
  assert.equal(isReady.skipped(), true);
});

test('切り替えたら直前の版の保存を1つ残し、それより古い保存を消す', async () => {
  const rel = release('0.10.0');
  const caches = makeCaches({ 'aqua-notes-0.2.0': {}, 'aqua-notes-0.9.0': {}, 'aqua-notes-0.10.0': full(rel), 'other-app': {} });
  await boot(rel, { caches }).fire('activate');
  assert.deepEqual([...caches.store.keys()].sort(), ['aqua-notes-0.10.0', 'aqua-notes-0.9.0', 'other-app']);
});
