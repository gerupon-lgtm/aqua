import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const worker = readFileSync(new URL('../src/pwa/worker.js', import.meta.url), 'utf8')
  .replace('__AQUA_VERSION__', '0.14.13').replace('__AQUA_ASSETS__', JSON.stringify(['./index.html', './v0.14.13/app.js']));
async function probe({ missing = false, broken = false } = {}) {
  const handlers = new Map(); let response, pending;
  vm.runInNewContext(worker, { self: { addEventListener: (type, fn) => handlers.set(type, fn) },
    caches: { async open() { if (broken) throw Error('storage unavailable'); return { async match(asset) { return !(missing && asset.endsWith('app.js')); } }; } } });
  handlers.get('message')({ data: { type: 'AQUA_UPDATE_STATUS' }, ports: [{ postMessage: value => { response = value; } }], waitUntil: promise => { pending = promise; } });
  await pending;
  return response;
}
test('待機workerは自分の版と、全資材が保存済みかを返す', async () => {
  const result = await probe();
  assert.equal(result.version, '0.14.13'); assert.equal(result.ready, true);
});
test('資材の不足・保存場所のエラーでは準備済みと答えない', async () => {
  for (const options of [{ missing: true }, { broken: true }]) {
    const result = await probe(options);
    assert.equal(result.version, '0.14.13'); assert.equal(result.ready, false);
  }
});
