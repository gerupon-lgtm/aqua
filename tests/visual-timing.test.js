import test from 'node:test';
import assert from 'node:assert/strict';
import { resultCardDelay, RAINBOW_AFTER_MS, RAINBOW_FADE_MS, RAINBOW_HOLD_MS, STAGE_CUE_MS, stageCueOpacity } from '../src/ui/visual-timing.js';

test('開始の合図は1.1秒だけで、控えめ設定では同じ濃さを保ち、古い合図は残らない', () => {
  assert.ok(stageCueOpacity(STAGE_CUE_MS, 550) > .8);
  assert.equal(stageCueOpacity(STAGE_CUE_MS, STAGE_CUE_MS), 0);
  assert.equal(stageCueOpacity(0, 1), 0);
  assert.equal(stageCueOpacity(STAGE_CUE_MS, 100, true), stageCueOpacity(STAGE_CUE_MS, 1000, true));
});

const timing = { jingleMs: 1400, cardClearMs: 2300, cardNgMs: 2300 };

test('100点の結果は虹が出そろい、500ms見せた後になる', () => {
  const delay = resultCardDelay('perfect', timing);
  assert.equal(delay, 3400);
  assert.ok(delay >= timing.jingleMs + RAINBOW_AFTER_MS + RAINBOW_FADE_MS + RAINBOW_HOLD_MS);
});

test('結果を早くする保存設定でも、遅い噴水・虹に先回りしない', () => {
  assert.equal(resultCardDelay('perfect', { ...timing, jingleMs: 4000, cardClearMs: 0 }), 6000);
});

test('虹より長い保存設定は短縮しない', () => {
  assert.equal(resultCardDelay('perfect', { ...timing, cardClearMs: 5000 }), 5000);
});

test('通常クリアとNGの結果は、これまでの設定どおり', () => {
  assert.equal(resultCardDelay('clear', timing), 2300);
  assert.equal(resultCardDelay('ng', timing), 2300);
  assert.equal(resultCardDelay('clear', { ...timing, cardClearMs: 0 }), 0);
  assert.equal(resultCardDelay('ng', { ...timing, cardNgMs: 5000 }), 5000);
});
