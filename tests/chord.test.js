// 和音（要件 v0.12、2026-11-04 発案者）：噴水盤が3つの10面・23面は、満点の答えで3つのグラスが3和音を鳴らす。
// 自由作成の見本「和音のお題」は、印に合わせると C メジャーの和音になり、達成できる
import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../src/content/stages.js';
import { CHALLENGES } from '../src/content/challenges.js';
import { applyValues } from '../src/content/challenge-draw.js';
import { judge } from '../src/logic/play.js';
import { triadOf } from '../src/logic/pitch.js';
import { frac } from '../src/logic/fraction.js';
import { FREE_SAMPLES } from '../src/content/free-samples.js';
import * as F from '../src/logic/free.js';

test('3和音の判定：C・E・G はCメジャー、A・C・E はAマイナー。重なる音・目盛りの間・2音は和音にしない', () => {
  assert.equal(triadOf(['5', '3', '2'].map(frac)).name, 'Cメジャー'); // C6・E6・G6
  assert.equal(triadOf(['6', '5', '3'].map(frac)).name, 'Aマイナー'); // A5・C6・E6
  assert.equal(triadOf(['3', '3', '2'].map(frac)), null);
  assert.equal(triadOf(['5', '0', '2'].map(frac)), null); // C6・C7・G6 は音名が C と G の2つだけ
  assert.equal(triadOf(['5', '3', '5/2'].map(frac)), null); // 目盛りの間
});

test('10面・23面の出題は、満点の答えで3つのグラスが3和音を鳴らし、つなぎ方の形が違う2系統', () => {
  for (const n of [10, 23]) {
    const base = STAGES.find(s => s.number === n);
    assert.equal(base.version, 2);
    const bank = CHALLENGES[base.id];
    assert.equal(bank.length, 8);
    const shapes = new Set(bank.map(q => q.expected.perfectKey.split(',').map(id => id.replace(/\d+$/, '')).sort().join(',')));
    assert.equal(shapes.size, 2, `${n}面の系統の形`);
    for (const q of bank) {
      const st = applyValues(base, q.values);
      const j = judge(st, q.expected.perfectKey.split(','));
      const levels = st.towers.map(t => j.result.towers[t.id].level);
      assert.ok(triadOf(levels), `${q.id}：${levels.join('/')} が和音でない`);
    }
  }
});

test('自由作成の見本「和音のお題」：始めは未達成、答えの一例で達成（Cメジャー）', () => {
  const sample = FREE_SAMPLES.find(s => s.id === 'chord');
  let c = F.validateCircuit(sample.circuit());
  assert.equal(F.goalResult(sample.goal, F.evaluateFree(c)).done, false);
  c = F.updatePipe(c, 'SB', { thinness: '2' });
  c = F.removePipeFrom(c, 'SC');
  c = F.addPipe(c, 'B', 'C');
  c = F.addPipe(c, 'A', 'C');
  c = F.updatePipe(c, 'AC', { thinness: '3' });
  const r = F.evaluateFree(c);
  const g = F.goalResult(sample.goal, r);
  assert.ok(g.done);
  assert.equal(triadOf(g.rows.map(x => x.level)).name, 'Cメジャー');
});
