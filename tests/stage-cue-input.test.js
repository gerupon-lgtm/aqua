import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { stageCueOpacity } from '../src/ui/visual-timing.js';

// 本体の描画ループを使い、条件の光だけでは入力先のSVGを置き換えないことを確認する。
const app = readFileSync(new URL('../src/ui/app.js', import.meta.url), 'utf8');
const loop = app.slice(app.indexOf('let frame = 0;'), app.indexOf('\nfunction drawBoard()'));
function fixture(phase = 'edit', still = false) {
  const queue = [], opacity = [];
  let boardDraws = 0;
  const context = { state: { phase, titleOpen: false, stageCueUntil: 1800 },
    performance: { now: () => 0 }, reducedMotionQuery: { matches: still }, practiceStep: () => null,
    stageCueOpacity, $: id => ({ style: { setProperty: (name, value) => { if (id === 'cond') opacity.push(Number(value)); } } }),
    drawBoard: () => { boardDraws++; }, cancelAnimationFrame() {}, requestAnimationFrame: fn => queue.push(fn) };
  vm.runInNewContext(loop + '\nloop();', context);
  return { context, opacity, queue, tick: time => queue.shift()?.(time), get boardDraws() { return boardDraws; } };
}
test('待機とフラッシュの間も編集状態を保ち、盤面のタップ先を置き換えない', () => {
  for (const still of [false, true]) {
    const f = fixture('edit', still);
    for (const time of [0, 699, 850, 1200, 1799, 1800]) f.tick(time);
    assert.equal(f.context.state.phase, 'edit');
    assert.equal(f.boardDraws, 0);
    assert.equal(f.opacity[0], 0); assert.equal(f.opacity[2], 1); assert.equal(f.opacity.at(-1), 0);
    assert.equal(f.queue.length, 0);
  }
});
test('水の再生は条件のフラッシュが終わったあとも描き続ける', () => {
  const f = fixture('running');
  for (const time of [0, 40, 850, 1800, 2000]) f.tick(time);
  assert.equal(f.boardDraws, 4);
  assert.equal(f.queue.length, 1);
});
