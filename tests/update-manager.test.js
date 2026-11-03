import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createUpdateManager, newerVersion } from '../src/ui/update-manager.js';

const app = readFileSync(new URL('../src/ui/app.js', import.meta.url), 'utf8');
const section = app.slice(app.indexOf('// ---- 通信なしで使う仕組みと、新しい版の案内'), app.indexOf('\nbind();'));
const settle = () => new Promise(resolve => setTimeout(resolve, 25));
class Worker extends EventTarget {
  constructor(version, ready = true) { super(); this.version = version; this.ready = ready; this.state = 'installed'; this.activationRequests = 0; }
  postMessage(message, ports) {
    if (message === 'activate-update') this.activationRequests++;
    else if (message.type === 'AQUA_UPDATE_STATUS') ports[0].postMessage({ version: this.version, ready: this.ready });
  }
}
async function fixture({ candidate = null, phase = 'edit' } = {}) {
  const notice = { hidden: true }, apply = { disabled: false }, title = { hidden: false, disabled: false };
  const elements = { 'update-notice': notice, 'update-apply': apply };
  const registration = Object.assign(new EventTarget(), { waiting: candidate, installing: null, async update() {} });
  const serviceWorker = Object.assign(new EventTarget(), { controller: new Worker('0.14.11'), async register() { return registration; } });
  let reloads = 0;
  const context = { APP_VERSION: '0.14.12', state: { phase }, MessageChannel, setTimeout, clearTimeout,
    navigator: { serviceWorker }, location: { reload() { reloads++; } },
    document: { querySelector: selector => selector.startsWith('meta') ? {} : title },
    $: id => elements[id], createUpdateManager: options => createUpdateManager({ ...options, timeoutMs: 15 }) };
  vm.runInNewContext(section + '\nsetupOffline();', context);
  await settle();
  return { notice, apply, title, registration, serviceWorker, context, get reloads() { return reloads; } };
}

test('最新の画面で同じ版のworkerが待機していても、下部と右上の更新を表示しない', async () => {
  const f = await fixture({ candidate: new Worker('0.14.12') });
  assert.equal(f.notice.hidden, true, '画面と同じ版なのに下部の更新案内が出ている');
  assert.equal(f.title.hidden, true);
});
test('古い版の待機と更新なしでも更新ボタンを出さない', async () => {
  for (const candidate of [null, new Worker('0.14.9')]) {
    const f = await fixture({ candidate });
    assert.equal(f.notice.hidden, true); assert.equal(f.title.hidden, true);
  }
});
test('新しい版でも資材が不足している間は更新を勧めない', async () => {
  const f = await fixture({ candidate: new Worker('0.14.13', false) });
  assert.equal(f.notice.hidden, true); assert.equal(f.title.hidden, true);
});
test('準備済みの新しい版だけ両方のボタンから適用できる', async () => {
  const candidate = new Worker('0.14.13'), f = await fixture({ candidate });
  assert.equal(f.notice.hidden, false); assert.equal(f.title.hidden, false);
  await f.apply.onclick(); await f.title.onclick();
  assert.equal(candidate.activationRequests, 2);
});
test('水が流れている間は更新を適用しない', async () => {
  const candidate = new Worker('0.14.13'), f = await fixture({ candidate, phase: 'running' });
  assert.equal(f.apply.disabled, true); assert.equal(f.title.disabled, true);
  await f.apply.onclick();
  assert.equal(candidate.activationRequests, 0);
});
test('同じ版のworkerへ切り替わっても、最新の画面を再読込しない', async () => {
  const f = await fixture();
  f.serviceWorker.controller = new Worker('0.14.12');
  f.serviceWorker.dispatchEvent(new Event('controllerchange'));
  await settle(); assert.equal(f.reloads, 0);
});
test('表示していない新しい版へ切り替わったときは再読込する', async () => {
  const f = await fixture();
  f.serviceWorker.controller = new Worker('0.14.13');
  f.serviceWorker.dispatchEvent(new Event('controllerchange'));
  await settle(); assert.equal(f.reloads, 1);
});
test('旧形式で版を答えられないworkerを、新しい版と決めつけない', async () => {
  const candidate = new Worker('0.14.13'); candidate.postMessage = () => {};
  const f = await fixture({ candidate });
  assert.equal(f.notice.hidden, true); assert.equal(f.title.hidden, true);
});
test('版は文字列順ではなく数字で比較し、不正な版は勧めない', () => {
  assert.equal(newerVersion('0.14.13', '0.14.12'), true);
  assert.equal(newerVersion('0.14.9', '0.14.12'), false);
  assert.equal(newerVersion('0.14.12', '0.14.12'), false);
  assert.equal(newerVersion('unknown', '0.14.12'), false);
});
test('ページを開いたあとに新しい版の準備が終わった場合も案内する', async () => {
  const f = await fixture(), candidate = new Worker('0.14.13');
  candidate.state = 'installing'; f.registration.installing = candidate;
  f.registration.dispatchEvent(new Event('updatefound'));
  await settle(); assert.equal(f.notice.hidden, true);
  candidate.state = 'installed'; f.registration.installing = null; f.registration.waiting = candidate;
  candidate.dispatchEvent(new Event('statechange'));
  await settle(); assert.equal(f.notice.hidden, false); assert.equal(f.title.hidden, false);
});
test('表示したあとに資材が失われた場合、更新ボタンを押しても適用しない', async () => {
  const candidate = new Worker('0.14.13'), f = await fixture({ candidate });
  candidate.ready = false;
  await f.apply.onclick();
  assert.equal(candidate.activationRequests, 0); assert.equal(f.notice.hidden, true);
});
test('別タブによる新しいworkerへの切替でも、水の再生終了まで再読込を待つ', async () => {
  const f = await fixture({ phase: 'running' });
  f.serviceWorker.controller = new Worker('0.14.13');
  f.serviceWorker.dispatchEvent(new Event('controllerchange')); await settle();
  assert.equal(f.reloads, 0);
  f.context.state.phase = 'result';
  vm.runInNewContext('updates.refreshControls();', f.context);
  assert.equal(f.reloads, 1);
});
test('同じ版の待機とは別に新版を取得している間は、最新版と断定しない', async () => {
  const f = await fixture({ candidate: new Worker('0.14.12') }), next = new Worker('0.14.13');
  next.state = 'installing'; f.registration.installing = next;
  f.registration.dispatchEvent(new Event('updatefound')); await settle();
  assert.equal(vm.runInNewContext('updates.state.status', f.context), 'checking');
  assert.equal(f.notice.hidden, true);
});
