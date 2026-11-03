import test from 'node:test';
import assert from 'node:assert/strict';
import { resultCardDelay, RAINBOW_AFTER_MS, RAINBOW_FADE_MS, RAINBOW_HOLD_MS, STAGE_CUE_MS, STAGE_CUE_WAIT_MS, STAGE_CUE_FLASH_MS, STAGE_CUE_GAP_MS, stageCueOpacity } from '../src/ui/visual-timing.js';

test('面を移ってから700ms待ち、その後2回光る合図。控えめでも待機する', () => {
  const until = STAGE_CUE_WAIT_MS + STAGE_CUE_MS;
  for (const still of [false, true]) {
    assert.equal(stageCueOpacity(until, 0, still), 0);
    assert.equal(stageCueOpacity(until, 699, still), 0);
    assert.equal(stageCueOpacity(until, 850, still), 1);
    assert.equal(stageCueOpacity(until, STAGE_CUE_WAIT_MS + STAGE_CUE_MS + 1, still), 0);
  }
});

test('開始の合図は2回光り、間で暗くなる。控えめ設定では同じ濃さを保ち、古い合図は残らない', () => {
  const at = t => stageCueOpacity(STAGE_CUE_MS, t);
  assert.equal(STAGE_CUE_MS, STAGE_CUE_FLASH_MS * 2 + STAGE_CUE_GAP_MS);
  assert.equal(at(300), 1);
  assert.equal(at(STAGE_CUE_FLASH_MS + STAGE_CUE_GAP_MS / 2), 0);
  assert.equal(at(STAGE_CUE_FLASH_MS + STAGE_CUE_GAP_MS + 300), 1);
  assert.equal(at(STAGE_CUE_MS), 0);
  assert.equal(stageCueOpacity(0, 1), 0);
  assert.equal(stageCueOpacity(STAGE_CUE_MS, 100, true), stageCueOpacity(STAGE_CUE_MS, 800, true));
});

test('開始合図の各回には読み取れる明るさを保つ区間があり、控えめでも同じ最大の濃さを使う', () => {
  for (const start of [0, STAGE_CUE_FLASH_MS + STAGE_CUE_GAP_MS]) {
    assert.equal(stageCueOpacity(STAGE_CUE_MS, start + 150), 1);
    assert.equal(stageCueOpacity(STAGE_CUE_MS, start + 400), 1);
    assert.ok(stageCueOpacity(STAGE_CUE_MS, start + 560) > .4);
  }
  assert.equal(stageCueOpacity(STAGE_CUE_MS, 150, true), 1);
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
